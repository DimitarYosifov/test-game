import { Game } from '../../Game';
import { BaseState } from './BaseState';
import { ApplyPoisonState } from './ApplyPoisonState';
import { Monster } from '../Monster';

/**
 * Shared "the player's turn is over" bookkeeping, used by every state that can end the
 * player's turn (end turn button, skipping/moving the last monster, ...):
 * disables all player input, clears selection FX, drains remaining moves and flips the turn.
 * The caller is responsible for transitioning to the next state afterwards.
 */
export function finishPlayerTurn(context: Game): void {
    // disable all interaction immediately
    context.endTurnButton.disableInteractive();
    context.skipButton.disableInteractive();
    context.giveUpButton.disableInteractive();
    context.updatePlayerSpellButtonsInteraction(true);
    context.movementArrowsContainer.removeArrows();

    // remove FX from selected monster
    if (context.currentlySelectedMonster) {
        context.currentlySelectedMonster.removeFX(context);
    }
    context.currentlySelectedMonsterAnimation!.hide().pause();

    // drain all player monsters' moves and mark as done
    context.data.list.playerMonsters.forEach((m: Monster) => {
        if (m !== null) {
            while (m.unitData.movesLeft > 0) {
                m.decreaseMoves();
            }
            m.pendingAction = false;
            m.setInteraction(false);
        }
    });

    // flip turn flag (opponent's turn starts) and do the flip-time bookkeeping
    // that the old checkNextTurn did right after it
    context.activeExplodePositions = 0;
    context.data.list.isPlayerTurn = false;
    context.updateFrozenMonsters();
    context.removeMonstersInvincibilty();

    // nothing is selected during the opponent's turn start (also stops the player's
    // N6 "on kill" bonus from reacting to poison deaths)
    context.currentlySelectedMonster = null;
}

export class PlayerEndTurnState extends BaseState {

    enter(context: Game): void {
        this.active = true;
        console.log('[PlayerEndTurnState] enter');

        finishPlayerTurn(context);

        // transition immediately — APPLY_POISON_STATE owns what happens next
        context.stateMachine.setState(new ApplyPoisonState());
    }

    exit(_context: Game): void {
        this.active = false;
        console.log('[PlayerEndTurnState] exit');
    }
}
