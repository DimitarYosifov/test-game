import { Game, GAME_SCENE_SCENE_EVENTS } from '../../Game';
import { BaseState } from './BaseState';
import { PlayerMonsterSelectedState } from './PlayerMonsterSelectedState';
import { PlayerTurnIdleState } from './PlayerTurnIdleState';
import { applyPendingResurrections } from './applyPendingResurrections';
import { pausePlayerInput } from './pausePlayerInput';
import { getSpell, SpellKey } from './spellTable';
import { Monster } from '../Monster';

/**
 * The player casts one of his spells (the player branch of the old newXSpell methods + the
 * callbacks of the spell buttons in Game-old.ts).
 *
 * Entered when a spell button is pressed, from PLAYER_MONSTER_SELECTED_STATE (with the selected
 * monster) or from PLAYER_TURN_IDLE_STATE (no monster). Starts the button's cooldown over, plays the
 * cast animation and the spell, waits until the spell is completely done (the spell classes emit
 * CHECK_END_TURN when their last target has been dealt with), resurrects any N5 the spell killed
 * and returns (the only exit) to the state it came from: PLAYER_MONSTER_SELECTED_STATE with the
 * same monster, or PLAYER_TURN_IDLE_STATE.
 */
export class PlayerSpellCastingState extends BaseState {

    readonly spellKey: SpellKey;
    /** the monster that was selected when the spell was cast, null when cast from PLAYER_TURN_IDLE_STATE */
    readonly monster: Monster | null;

    private onSpellComplete: (() => void) | null = null;

    constructor(spellKey: SpellKey, monster: Monster | null) {
        super();
        this.spellKey = spellKey;
        this.monster = monster;
    }

    enter(context: Game): void {
        this.active = true;
        console.log('[PlayerSpellCastingState] enter - spell:', this.spellKey);

        const spell = getSpell(this.spellKey);
        const spellData = context.playerSpellsData?.[this.spellKey] as any;
        const button = spell.getPlayerButton(context);

        if (!spellData || !button) {
            console.error('[PlayerSpellCastingState] the player has no such spell:', this.spellKey);
            this.returnToPreviousState(context);
            return;
        }

        const cooldown: number = spellData.cooldown;

        // the spell starts its cooldown over right away
        context.spellCastInProgress = true;
        spellData.cooldownProgress = 0;
        button.readyForUse = false;

        // no skip / end turn / other spells / monster selection while the spell plays out
        pausePlayerInput(context);

        button.setAlpha(1);
        button.animateSpellTrigger(() => {
            if (!this.active) return;

            button.removeSpellFilledTween();
            button.onSpellUse();
            // the button shows the cooldown again once the round is over
            context.events.once(GAME_SCENE_SCENE_EVENTS.ROUND_END, () => {
                button.tweenUpdateCooldown(0, cooldown);
            });

            // must be registered before the spell is created - an immune freeze target emits synchronously
            this.onSpellComplete = () => {
                this.onSpellComplete = null;
                this.afterSpell(context);
            };
            context.events.once(GAME_SCENE_SCENE_EVENTS.CHECK_END_TURN, this.onSpellComplete);

            const targets: Monster[] = spell.targetsOwnSide
                ? context.data.list.playerMonsters
                : context.data.list.opponentMonsters;
            spell.cast(context, targets, spellData);
        });
    }

    exit(context: Game): void {
        this.active = false;
        console.log('[PlayerSpellCastingState] exit');
        context.spellCastInProgress = false;
        if (this.onSpellComplete) {
            context.events.off(GAME_SCENE_SCENE_EVENTS.CHECK_END_TURN, this.onSpellComplete);
            this.onSpellComplete = null;
        }
    }

    // ── private ──────────────────────────────────────────────────────────────

    private afterSpell(context: Game): void {
        // the spell killed the last enemy - the outro popup owns the scene
        if (!this.active || context.levelFinished) return;

        // N3's displayed magic bonus depends on who stands next to it
        context.updateAdditionalMagicDamage();

        // a killed N5 comes back right away (old checkNextTurn did this first)
        applyPendingResurrections(context, () => {
            if (!this.active || context.levelFinished) return;
            this.returnToPreviousState(context);
        });
    }

    private returnToPreviousState(context: Game): void {
        if (this.monster) {
            context.stateMachine.setState(new PlayerMonsterSelectedState(this.monster));
        } else {
            context.stateMachine.setState(new PlayerTurnIdleState());
        }
    }
}
