import { Game } from '../../Game';
import { PlayerMonsterSelectedState } from './PlayerMonsterSelectedState';
import { OpponentMonsterSelectedState } from './OpponentMonsterSelectedState';
import { ApplyPoisonState } from './ApplyPoisonState';
import { finishPlayerTurn } from './PlayerEndTurnState';
import { finishOpponentTurn } from './finishOpponentTurn';
import { Monster } from '../Monster';

/**
 * Shared exit of the states in which a monster performs an action (MONSTER_MOVE_STATE,
 * MONSTER_ATTACK_STATE). This is what the old CHECK_END_TURN handler + checkNextTurn decided
 * once an action had finished. The same three exits apply to both teams:
 *
 *  1. the acting monster has more moves  => <TEAM>_MONSTER_SELECTED_STATE (same monster)
 *  2. another monster of its team has moves => <TEAM>_MONSTER_SELECTED_STATE (that monster)
 *  3. no monster of its team has moves   => APPLY_POISON_STATE (the team's turn is over)
 *
 * where <TEAM> is PLAYER for a player monster and OPPONENT for an opponent monster.
 * A monster that still has moves can act again (Monster.move()/performHit() cleared its
 * pendingAction, the old handler restored it); a monster that has none is dimmed.
 */
export function exitAfterMonsterAction(context: Game, monster: Monster): void {

    const isPlayer = monster.isPlayerMonster;
    const team: Monster[] = isPlayer ? context.data.list.playerMonsters : context.data.list.opponentMonsters;
    const selectedState = (m: Monster) => isPlayer ? new PlayerMonsterSelectedState(m) : new OpponentMonsterSelectedState(m);

    // the monster can have died doing its action (e.g. killed by the bomb it stepped on) - then it
    // is gone and neither acts again nor needs dimming
    const isAlive = monster.unitData.health > 0;
    const hasMovesLeft = isAlive && monster.unitData.movesLeft > 0 && monster.frozenForDuration === 0;
    if (hasMovesLeft) {
        monster.pendingAction = true;
    } else if (isAlive) {
        monster.setAlpha(0.7);
    }

    // exit 1: the same monster still has moves left
    if (hasMovesLeft) {
        context.stateMachine.setState(selectedState(monster));
        return;
    }

    // exit 2: another monster of the team has moves
    const nextMonster: Monster | undefined = team.find(
        (m: Monster | null) => m && m !== monster && m.pendingAction && m.frozenForDuration === 0
    );
    if (nextMonster) {
        context.stateMachine.setState(selectedState(nextMonster));
        return;
    }

    // exit 3: no monster of the team has moves left - the team's turn is over
    if (isPlayer) {
        finishPlayerTurn(context);
    } else {
        finishOpponentTurn(context);
    }
    context.stateMachine.setState(new ApplyPoisonState());
}
