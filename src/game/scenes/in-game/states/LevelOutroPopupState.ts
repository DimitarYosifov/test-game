import { Game } from '../../Game';
import { BaseState } from './BaseState';
import { pausePlayerInput } from './pausePlayerInput';

/**
 * The level is over: shows the outro popup - "level won" (with the claim button) or "level lost"
 * (try again / give up). Its buttons change the scene, so this is a terminal state: it has no exits.
 *
 * Entered from ONE place only: Game.monsterDieHandler, when a monster dies and that leaves one of
 * the teams without monsters (the opponent's => won, the player's => lost). Whatever state was
 * running at that moment is exited, which stops all of its pending callbacks (they all check
 * their `active` flag).
 * (The give up button does not come through here - PLAYER_GIVE_UP_STATE shows the popup itself.)
 */
export class LevelOutroPopupState extends BaseState {

    readonly levelWon: boolean;

    constructor(levelWon: boolean) {
        super();
        this.levelWon = levelWon;
    }

    enter(context: Game): void {
        this.active = true;
        console.log('[LevelOutroPopupState] enter - level', this.levelWon ? 'won' : 'lost');

        context.levelFinished = true;

        // nothing can be played any more
        pausePlayerInput(context);
        context.endTurnButton.disableInteractive();
        context.giveUpButton.disableInteractive();

        context.createLevelOutroPopup(this.levelWon);
    }

    exit(_context: Game): void {
        this.active = false;
        console.log('[LevelOutroPopupState] exit');
    }
}
