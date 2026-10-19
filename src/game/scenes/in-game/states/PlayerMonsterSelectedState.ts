import { Game, GAME_SCENE_SCENE_EVENTS } from '../../Game';
import { BaseState } from './BaseState';
import { PlayerMovingState } from './PlayerMovingState';
import { PlayerAttackingState } from './PlayerAttackingState';
import { PlayerSpellCastingState } from './PlayerSpellCastingState';
import { PlayerSkipMoveState } from './PlayerSkipMoveState';
import { PlayerEndTurnState } from './PlayerEndTurnState';
import { PlayerGiveUpState } from './PlayerGiveUpState';
import { Monster } from '../Monster';

export class PlayerMonsterSelectedState extends BaseState {

    private monster: Monster;

    // stored listeners so exit() can remove them cleanly
    private onDirectionSelected: (data: number[]) => void;
    private onTargetSelected: (data: number[]) => void;
    private onEndTurnPressed: () => void;
    private onSkipPressed: () => void;
    private onGiveUpPressed: () => void;

    // one listener per selectable monster so we can remove them individually
    private otherMonsterListeners: Map<Monster, () => void> = new Map();

    constructor(monster: Monster) {
        super();
        this.monster = monster;
    }

    enter(context: Game): void {
        this.active = true;
        console.log('[PlayerMonsterSelectedState] enter', this.monster);

        // clean up FX on previously selected monster if different
        if (context.currentlySelectedMonster && context.currentlySelectedMonster !== this.monster) {
            context.currentlySelectedMonster.removeFX(context);
        }

        context.currentlySelectedMonster = this.monster;
        context.mainGridContainer.bringToTop(this.monster);

        // show selection animation over current monster
        const monsterBounds = this.monster.bg.getBounds();
        context.currentlySelectedMonsterAnimation!
            .moveTo(
                monsterBounds.x + monsterBounds.width / 2,
                monsterBounds.y + monsterBounds.height / 2
            )
            .show()
            .resume();

        // apply FX to selected monster
        const barrelFX = this.monster.bg.preFX.addBarrel(1.075);
        context.tweens.add({
            targets: barrelFX,
            amount: 1,
            yoyo: true,
            duration: 600,
            loop: -1,
            ease: 'sine.inout'
        });
        this.monster.bg.postFX.addShine(0.5, 0.3, 3);

        // create movement/attack arrows for current monster
        context.movementArrowsContainer.createArrows(this.monster.unitData);

        // enable buttons
        context.endTurnButton.setInteractive();
        context.skipButton.setInteractive();
        context.giveUpButton.setInteractive();
        context.updatePlayerSpellButtonsInteraction();

        // ── other player monsters with moves left → re-enter same state ──
        this.wireOtherMonsters(context);

        // ── DIRECTION arrow clicked → PLAYER_MOVING ──
        this.onDirectionSelected = (data: number[]) => {
            if (!this.active) return;
            context.stateMachine.setState(new PlayerMovingState(data[0], data[1]));
        };
        context.events.on(GAME_SCENE_SCENE_EVENTS.DIRECTION_SELECTED, this.onDirectionSelected);

        // ── ATTACK arrow clicked → PLAYER_ATTACKING ──
        this.onTargetSelected = (data: number[]) => {
            if (!this.active) return;
            context.stateMachine.setState(new PlayerAttackingState(data[0], data[1], data[2] as unknown as boolean));
        };
        context.events.on(GAME_SCENE_SCENE_EVENTS.TARGET_SELECTED, this.onTargetSelected);

        // ── END TURN pressed → PLAYER_END_TURN ──
        this.onEndTurnPressed = () => {
            if (!this.active) return;
            context.stateMachine.setState(new PlayerEndTurnState());
        };
        context.events.on(GAME_SCENE_SCENE_EVENTS.END_TURN_PRESSED, this.onEndTurnPressed);

        // ── SKIP pressed → PLAYER_SKIP_MOVE ──
        this.onSkipPressed = () => {
            if (!this.active) return;
            context.stateMachine.setState(new PlayerSkipMoveState());
        };
        context.events.on(GAME_SCENE_SCENE_EVENTS.SKIP_PRESSED, this.onSkipPressed);

        // ── GIVE UP pressed → PLAYER_GIVE_UP ──
        this.onGiveUpPressed = () => {
            if (!this.active) return;
            context.stateMachine.setState(new PlayerGiveUpState());
        };
        context.events.on(GAME_SCENE_SCENE_EVENTS.GIVE_UP_PRESSED, this.onGiveUpPressed);

        // ── Spell buttons → PLAYER_SPELL_CASTING ──
        this.wireSpellButtons(context);
    }

    exit(context: Game): void {
        this.active = false;
        console.log('[PlayerMonsterSelectedState] exit');

        // remove all scene event listeners
        context.events.off(GAME_SCENE_SCENE_EVENTS.DIRECTION_SELECTED, this.onDirectionSelected);
        context.events.off(GAME_SCENE_SCENE_EVENTS.TARGET_SELECTED, this.onTargetSelected);
        context.events.off(GAME_SCENE_SCENE_EVENTS.END_TURN_PRESSED, this.onEndTurnPressed);
        context.events.off(GAME_SCENE_SCENE_EVENTS.SKIP_PRESSED, this.onSkipPressed);
        context.events.off(GAME_SCENE_SCENE_EVENTS.GIVE_UP_PRESSED, this.onGiveUpPressed);

        // remove per-monster re-select listeners and disable interactivity on them
        this.otherMonsterListeners.forEach((listener, monster) => {
            monster.bg.off('pointerdown', listener);
            monster.bg.disableInteractive();
        });
        this.otherMonsterListeners.clear();

        // clean up arrows and animation
        context.movementArrowsContainer.removeArrows();
        context.currentlySelectedMonsterAnimation!.hide().pause();

        if (context.currentlySelectedMonster) {
            context.currentlySelectedMonster.removeFX(context);
        }
    }

    // ── private helpers ──────────────────────────────────────────────────────

    private wireOtherMonsters(context: Game): void {
        this.otherMonsterListeners.clear();

        context.data.list.playerMonsters.forEach((m: Monster) => {
            // skip nulls, the currently selected monster, and monsters with no moves or frozen
            if (!m || m === this.monster || !m.pendingAction || m.frozenForDuration > 0) return;

            m.bg.setInteractive();

            const listener = () => {
                if (!this.active) return;
                if (context.data.list.selectedMonsterDragged) return;
                context.stateMachine.setState(new PlayerMonsterSelectedState(m));
            };

            m.bg.on('pointerdown', listener);
            this.otherMonsterListeners.set(m, listener);
        });
    }

    private wireSpellButtons(context: Game): void {
        const spellButtons = [
            context.playerMagicBallButton,
            context.playerPoisonButton,
            context.playerRainOfArrowsButton,
            context.playerFreezeButton,
            context.playerHealButton,
        ];

        spellButtons.forEach(btn => {
            if (!btn) return;
            btn.once('pointerdown', () => {
                if (!this.active) return;
                context.stateMachine.setState(new PlayerSpellCastingState(btn));
            });
        });
    }
}
