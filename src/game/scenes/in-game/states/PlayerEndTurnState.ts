import { Game } from '../../Game';
import { BaseState } from './BaseState';
import { ApplyPoisonState } from './ApplyPoisonState';
import { Monster } from '../Monster';

export class PlayerEndTurnState extends BaseState {

    enter(context: Game): void {
        this.active = true;
        console.log('[PlayerEndTurnState] enter');

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

        // flip turn flag
        context.data.list.isPlayerTurn = false;

        // transition immediately — APPLY_POISON_STATE owns what happens next
        context.stateMachine.setState(new ApplyPoisonState());
    }

    exit(_context: Game): void {
        this.active = false;
        console.log('[PlayerEndTurnState] exit');
    }
}
