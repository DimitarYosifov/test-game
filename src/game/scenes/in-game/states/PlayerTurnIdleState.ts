import { Game, GAME_SCENE_SCENE_EVENTS } from '../../Game';
import { BaseState } from './BaseState';
import { PlayerEndTurnState } from './PlayerEndTurnState';
import { PlayerSpellCastingState } from './PlayerSpellCastingState';
import { PlayerGiveUpState } from './PlayerGiveUpState';
import { SpellKey } from './spellTable';

/**
 * It is the player's turn but none of his monsters can act (all of them are frozen), so there is
 * nothing to select. The old code left the turn open in this case so the player could still use
 * his spells (heal, freeze, ...) and end the turn manually.
 *
 * Entered from PLAYER_TURN_START_STATE and ADD_BUFFS_STATE when no monster is available.
 * Exits:
 *  - end turn button   => PLAYER_END_TURN_STATE
 *  - a spell button    => PLAYER_SPELL_CASTING_STATE (it returns here when the spell is done)
 *  - give up button    => PLAYER_GIVE_UP_STATE
 */
export class PlayerTurnIdleState extends BaseState {

    private onEndTurnPressed: () => void;
    private onGiveUpPressed: () => void;
    private onSpellPressed: (spellKey: SpellKey) => void;

    enter(context: Game): void {
        this.active = true;
        console.log('[PlayerTurnIdleState] enter');

        // nothing is selected: no arrows, no selection marker, no acting monster
        context.movementArrowsContainer.removeArrows();
        context.currentlySelectedMonsterAnimation!.hide().pause();
        context.currentlySelectedMonster = null;

        // there is no monster to skip a move for
        context.skipButton.disableInteractive();
        context.endTurnButton.setInteractive();
        context.giveUpButton.setInteractive();
        context.updatePlayerSpellButtonsInteraction();

        // ── END TURN pressed → PLAYER_END_TURN ──
        this.onEndTurnPressed = () => {
            if (!this.active) return;
            context.stateMachine.setState(new PlayerEndTurnState());
        };
        context.events.on(GAME_SCENE_SCENE_EVENTS.END_TURN_PRESSED, this.onEndTurnPressed);

        // ── SPELL button pressed → PLAYER_SPELL_CASTING (no monster to return to - it comes back here) ──
        this.onSpellPressed = (spellKey: SpellKey) => {
            if (!this.active) return;
            context.stateMachine.setState(new PlayerSpellCastingState(spellKey, null));
        };
        context.events.on(GAME_SCENE_SCENE_EVENTS.SPELL_PRESSED, this.onSpellPressed);

        // ── GIVE UP pressed → PLAYER_GIVE_UP ──
        this.onGiveUpPressed = () => {
            if (!this.active) return;
            context.stateMachine.setState(new PlayerGiveUpState());
        };
        context.events.on(GAME_SCENE_SCENE_EVENTS.GIVE_UP_PRESSED, this.onGiveUpPressed);
    }

    exit(context: Game): void {
        this.active = false;
        console.log('[PlayerTurnIdleState] exit');

        context.events.off(GAME_SCENE_SCENE_EVENTS.END_TURN_PRESSED, this.onEndTurnPressed);
        context.events.off(GAME_SCENE_SCENE_EVENTS.SPELL_PRESSED, this.onSpellPressed);
        context.events.off(GAME_SCENE_SCENE_EVENTS.GIVE_UP_PRESSED, this.onGiveUpPressed);
    }
}
