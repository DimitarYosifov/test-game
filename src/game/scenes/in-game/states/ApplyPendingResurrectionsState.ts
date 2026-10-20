import { Game } from '../../Game';
import { BaseState } from './BaseState';
import { AddBuffsState } from './AddBuffsState';
import { OpponentSpellCastState } from './OpponentSpellCastState';
import { applyPendingResurrections } from './applyPendingResurrections';

/**
 * Monster N5's special skill: killed N5 monsters are queued in context.pendingRessurections by
 * the CHECK_PENDING_RESSURECTION handler and brought back here (see applyPendingResurrections).
 *
 * Exits - by whose turn is starting:
 *  - player's turn   => ADD_BUFFS_STATE
 *  - opponent's turn => OPPONENT_SPELL_CAST_STATE
 * Nothing happens if the level is already over (e.g. poison killed the last enemy) - the outro
 * popup owns the scene then.
 */
export class ApplyPendingResurrectionsState extends BaseState {

    enter(context: Game): void {
        this.active = true;
        console.log('[ApplyPendingResurrectionsState] enter');

        applyPendingResurrections(context, () => {
            if (!this.active) return;
            if (context.levelFinished) {
                return;
            }

            if (context.data.list.isPlayerTurn) {
                context.stateMachine.setState(new AddBuffsState());
            } else {
                context.stateMachine.setState(new OpponentSpellCastState());
            }
        });
    }

    exit(_context: Game): void {
        this.active = false;
        console.log('[ApplyPendingResurrectionsState] exit');
    }
}
