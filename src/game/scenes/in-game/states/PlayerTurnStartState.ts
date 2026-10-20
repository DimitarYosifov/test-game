import { Game } from '../../Game';
import { BaseState } from './BaseState';
import { PlayerMonsterSelectedState } from './PlayerMonsterSelectedState';
import { PlayerTurnIdleState } from './PlayerTurnIdleState';
import { Monster } from '../Monster';

/**
 * Player branch of the old addInteraction(): a new turn for the player's monsters. Resets their
 * moves, makes them selectable and returns the first player monster that can act (the one that
 * gets selected), or undefined if none can (all frozen).
 * Shared by every state that hands control over to the player (this one, ADD_BUFFS_STATE).
 */
export function preparePlayerTurn(context: Game): Monster | undefined {
    context.removeQuestionMarks();

    // reset moves for all player monsters
    context.data.list.playerMonsters.forEach((monster: Monster) => {
        if (monster) {
            monster.resetMoves();
        }
    });

    // set pendingAction for all non-frozen player monsters
    context.data.list.playerMonsters.forEach((monster: Monster) => {
        if (monster) {
            monster.setAlpha(1);
            monster.setInteraction(true);
            monster.pendingAction = monster.frozenForDuration === 0;
        }
    });

    // opponent monsters stay non-interactive
    context.data.list.opponentMonsters.forEach((monster: Monster) => {
        if (monster) {
            monster.setAlpha(1);
            monster.setInteraction(false);
            if (monster.unitData.movesLeft === 0) {
                monster.pendingAction = false;
            }
        }
    });

    context.endTurnButton.setInteractive();
    context.updatePlayerSpellButtonsInteraction();

    return context.data.list.playerMonsters.find((m: Monster) => m !== null && m.pendingAction);
}

export class PlayerTurnStartState extends BaseState {

    enter(context: Game): void {
        this.active = true;
        console.log('[PlayerTurnStartState] enter');

        const firstAvailable = preparePlayerTurn(context);

        if (firstAvailable) {
            context.stateMachine.setState(new PlayerMonsterSelectedState(firstAvailable));
        } else {
            // all player monsters are frozen - the player can still use spells and end the turn manually
            context.stateMachine.setState(new PlayerTurnIdleState());
        }
    }

    exit(_context: Game): void {
        this.active = false;
        console.log('[PlayerTurnStartState] exit');
    }
}
