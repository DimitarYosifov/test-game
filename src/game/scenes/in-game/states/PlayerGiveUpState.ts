import { Game } from '../../Game';
import { BaseState } from './BaseState';
import { pausePlayerInput } from './pausePlayerInput';

/**
 * The player gave up (the give up button in Game-old.ts just opened the "level lost" popup).
 * Entered from PLAYER_MONSTER_SELECTED_STATE and PLAYER_TURN_IDLE_STATE when the give up button is
 * pressed. Locks the player's input and shows the level lost popup (try again / give up) - its
 * buttons change the scene, so this state has no exits.
 */
export class PlayerGiveUpState extends BaseState {

    enter(context: Game): void {
        this.active = true;
        console.log('[PlayerGiveUpState] enter');

        // the level is over - same flag the "last player monster died" path sets
        context.levelFinished = true;

        pausePlayerInput(context);
        context.endTurnButton.disableInteractive();
        context.giveUpButton.disableInteractive();

        context.createLevelOutroPopup(false);
    }

    exit(_context: Game): void {
        this.active = false;
        console.log('[PlayerGiveUpState] exit');
    }
}
