import { Game, GAME_SCENE_SCENE_EVENTS } from '../../Game';
import { BaseState } from './BaseState';
import { OpponentMonsterSelectedState } from './OpponentMonsterSelectedState';
import { applyPendingResurrections } from './applyPendingResurrections';
import { Monster } from '../Monster';
import { ISpellDefinition, SPELLS } from './spellTable';

/**
 * The opponent's turn begins: shows the "opponent's turn" message, then casts every opponent
 * spell whose cooldown is filled, one after the other (checkOpponentForSpellCast in Game-old.ts).
 * Spell classes emit CHECK_END_TURN when their last target has been dealt with - that is the
 * signal to look for the next ready spell.
 *
 * When nothing is left to cast: resurrects monsters (N5) killed by the spells, prepares the
 * opponent's monsters for the turn (old addInteraction) and exits to
 * OPPONENT_MONSTER_SELECTED_STATE (the only exit).
 */
export class OpponentSpellCastState extends BaseState {

    private onSpellComplete: (() => void) | null = null;

    enter(context: Game): void {
        this.active = true;
        console.log('[OpponentSpellCastState] enter');

        this.showOpponentTurnMsg(context, () => this.castNextReadySpell(context));
    }

    exit(context: Game): void {
        this.active = false;
        console.log('[OpponentSpellCastState] exit');
        if (this.onSpellComplete) {
            context.events.off(GAME_SCENE_SCENE_EVENTS.CHECK_END_TURN, this.onSpellComplete);
            this.onSpellComplete = null;
        }
    }

    // ── private ──────────────────────────────────────────────────────────────

    private showOpponentTurnMsg(context: Game, onComplete: () => void): void {
        context.opponentTurnMsg.setScale(1.5);
        context.tweens.chain({
            tweens: [
                {
                    targets: context.opponentTurnMsg,
                    alpha: 1,
                    scale: 1,
                    duration: 250,
                    ease: 'Back.easeOut'
                },
                {
                    targets: context.opponentTurnMsg,
                    alpha: 0,
                    delay: 800,
                    scale: 0,
                    duration: 250,
                    ease: 'Back.easeIn',
                    onComplete: () => {
                        if (this.active) onComplete();
                    }
                }
            ]
        });
    }

    private castNextReadySpell(context: Game): void {
        if (!this.active || context.levelFinished) return;

        const spellsData = context.opponentSpellsData;
        const spell = SPELLS.find(s => {
            const data = spellsData?.[s.key];
            return data && data.cooldownProgress === data.cooldown;
        });

        if (spell) {
            this.castSpell(context, spell);
        } else {
            this.onNoMoreSpells(context);
        }
    }

    private castSpell(context: Game, spell: ISpellDefinition): void {
        const spellData = context.opponentSpellsData[spell.key] as any;
        const button = spell.getOpponentButton(context);
        const cooldown: number = spellData.cooldown;

        spellData.cooldownProgress = 0;
        button.setAlpha(1);

        button.animateSpellTrigger(() => {
            if (!this.active) return;

            button.removeSpellFilledTween();
            button.onSpellUse();
            context.events.once(GAME_SCENE_SCENE_EVENTS.ROUND_END, () => {
                button.tweenUpdateCooldown(0, cooldown);
            });

            // must be registered before the spell is created - an immune freeze target emits synchronously
            this.onSpellComplete = () => {
                this.onSpellComplete = null;
                this.castNextReadySpell(context);
            };
            context.events.once(GAME_SCENE_SCENE_EVENTS.CHECK_END_TURN, this.onSpellComplete);

            const targets: Monster[] = spell.targetsOwnSide
                ? context.data.list.opponentMonsters
                : context.data.list.playerMonsters;
            spell.cast(context, targets, spellData);
        });
    }

    private onNoMoreSpells(context: Game): void {
        // spells may have killed N5 monsters
        applyPendingResurrections(context, () => {
            if (!this.active || context.levelFinished) return;

            this.prepareOpponentMonsters(context);
            context.stateMachine.setState(new OpponentMonsterSelectedState());
        });
    }

    /** Opponent branch of the old addInteraction(): new turn for the opponent's monsters. */
    private prepareOpponentMonsters(context: Game): void {
        context.removeQuestionMarks();
        context.skipButton.disableInteractive();
        context.endTurnButton.disableInteractive();

        if (context.isSurvivalLevel) {
            context.addNewSurvivalLevelMonsters();
        }

        context.data.list.opponentMonsters.forEach((monster: Monster) => {
            if (monster) {
                monster.resetMoves();
            }
        });

        // player monsters can't act during the opponent's turn
        context.data.list.playerMonsters.forEach((monster: Monster) => {
            if (monster) {
                monster.setAlpha(1);
                monster.setInteraction(false);
                monster.pendingAction = false;
            }
        });

        // frozen opponent monsters (or ones without moves, e.g. just resurrected) skip the turn
        context.data.list.opponentMonsters.forEach((monster: Monster) => {
            if (monster) {
                monster.setAlpha(1);
                monster.pendingAction = monster.unitData.movesLeft > 0 && monster.frozenForDuration === 0;
                monster.setInteraction(false);
            }
        });

        context.updatePlayerSpellButtonsInteraction();
    }
}
