import { Game } from '../../Game';
import { Monster } from '../Monster';

/**
 * What the old pauseResumeInteraction(false) did when the player started a move/attack:
 * disables the skip / end turn buttons, the spell buttons and the player's monsters while the
 * action plays out. The next state re-enables whatever it needs.
 */
export function pausePlayerInput(context: Game): void {
    context.skipButton.disableInteractive();
    context.endTurnButton.disableInteractive();
    context.updatePlayerSpellButtonsInteraction(true);

    context.data.list.playerMonsters.forEach((m: Monster | null) => {
        if (m && m.frozenForDuration === 0) {
            m.setInteraction(false);
        }
    });
}
