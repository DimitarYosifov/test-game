import { Game } from '../../Game';
import { BaseState } from './BaseState';
import { PlayerMonsterSelectedState } from './PlayerMonsterSelectedState';
import { ApplyPoisonState } from './ApplyPoisonState';
import { finishPlayerTurn } from './PlayerEndTurnState';
import { Monster } from '../Monster';

/**
 * Entered from PlayerMonsterSelectedState when the skip button (or SPACE) is pressed.
 * Spends one move of the selected monster without acting, then exits to:
 *  - PlayerMonsterSelectedState (same monster)   -> it still has moves left
 *  - PlayerMonsterSelectedState (another monster) -> another player monster has moves
 *  - ApplyPoisonState                             -> no player monster has moves
 */
export class PlayerSkipMoveState extends BaseState {

    enter(context: Game): void {
        this.active = true;
        console.log('[PlayerSkipMoveState] enter');

        context.skipButton.disableInteractive();

        const monster: Monster | null = context.currentlySelectedMonster;

        if (monster) {
            // skipping costs one move (decreaseMoves also clears the N6 ranged bonus)
            monster.decreaseMoves();

            // exit 1: the same monster has more moves
            if (monster.unitData.movesLeft > 0 && monster.frozenForDuration === 0) {
                context.stateMachine.setState(new PlayerMonsterSelectedState(monster));
                return;
            }

            // monster is done for this turn - dim it and make it non-selectable
            monster.pendingAction = false;
            monster.setInteraction(false);
            monster.setAlpha(0.7);
        }

        // exit 2: another player monster still has moves
        const nextMonster: Monster | undefined = context.data.list.playerMonsters.find(
            (m: Monster | null) => m && m !== monster && m.pendingAction && m.frozenForDuration === 0
        );
        if (nextMonster) {
            context.stateMachine.setState(new PlayerMonsterSelectedState(nextMonster));
            return;
        }

        // exit 3: nobody has moves left - the player's turn is over
        finishPlayerTurn(context);
        context.stateMachine.setState(new ApplyPoisonState());
    }

    exit(_context: Game): void {
        this.active = false;
        console.log('[PlayerSkipMoveState] exit');
    }
}
