import { Game, GAME_SCENE_SCENE_EVENTS } from '../../Game';
import { BaseState } from './BaseState';
import { applyPendingResurrections } from './applyPendingResurrections';
import { exitAfterMonsterAction } from './exitAfterMonsterAction';
import { pausePlayerInput } from './pausePlayerInput';
import { Monster } from '../Monster';

/**
 * Makes ANY monster (player's or opponent's - the side comes from monster.isPlayerMonster) hit
 * the monster standing on the target cell. Logic of the old targetSelectHandler plus the attack
 * part of the CHECK_END_TURN handler / checkNextTurn.
 *
 * Flow: work out the damage (ranged > magic > melee, with the N3/N6/N8 bonuses) -> find the
 * target -> Monster.performHit() (animation + N1/N7 specials + takeDamege) -> wait for
 * CHECK_END_TURN (emitted once the damage/death/drop sequence is over) -> resurrect any N5 that
 * died -> exit (see exitAfterMonsterAction), the same 3 exits for both teams:
 *  - the attacker has more moves           => PLAYER_ / OPPONENT_MONSTER_SELECTED_STATE (same monster)
 *  - another monster of its team has moves => PLAYER_ / OPPONENT_MONSTER_SELECTED_STATE (that monster)
 *  - no monster of its team has moves      => APPLY_POISON_STATE
 */
export class MonsterAttackState extends BaseState {

    readonly attacker: Monster;
    readonly targetRow: number;
    readonly targetCol: number;

    private onAttackComplete: (() => void) | null = null;

    constructor(attacker: Monster, targetRow: number, targetCol: number) {
        super();
        this.attacker = attacker;
        this.targetRow = targetRow;
        this.targetCol = targetCol;
    }

    enter(context: Game): void {
        this.active = true;
        const attacker = this.attacker;
        console.log(`[MonsterAttackState] enter - ${attacker.isPlayerMonster ? 'player' : 'opponent'} monster attacks row:`, this.targetRow, 'col:', this.targetCol);

        // Game.monsterDieHandler (N6 bonus) and the other kill-time rules read the acting monster from here
        context.currentlySelectedMonster = attacker;
        context.movementArrowsContainer.removeArrows();

        if (attacker.isPlayerMonster) {
            // no skip / end turn / spells / monster selection while the attack plays out
            pausePlayerInput(context);
        }

        const target = this.findTarget(context);
        if (!target) {
            console.error('[MonsterAttackState] no target at', this.targetRow, this.targetCol);
            exitAfterMonsterAction(context, attacker);
            return;
        }

        const damage = this.getDamage(context, attacker);
        const isTargetToTheLeft = target.unitData.col < attacker.unitData.col;

        // listen BEFORE the hit - takeDamege emits CHECK_END_TURN when its damage/death sequence ends
        this.onAttackComplete = () => {
            this.onAttackComplete = null;
            this.afterAttack(context);
        };
        context.events.once(GAME_SCENE_SCENE_EVENTS.CHECK_END_TURN, this.onAttackComplete);

        attacker.performHit(target, isTargetToTheLeft, () => {
            // the hit has landed
            if (+attacker.type === 7) {
                // monster N7 special - 20% chance to freeze
                if (Phaser.Math.RND.between(1, 100) <= 20) {
                    target.setFrozen(1, () => { });
                }
            } else if (+attacker.type === 1) {
                // monster N1 special - 20% chance to poison
                if (Phaser.Math.RND.between(1, 100) <= 20) {
                    target.setPoisoned(2, 1, () => { });
                }
            }
            target.takeDamege(damage, attacker.unitData.magic > 0);
        });
    }

    exit(context: Game): void {
        this.active = false;
        console.log('[MonsterAttackState] exit');
        // safety: remove listener if the state is exited before the attack finishes
        if (this.onAttackComplete) {
            context.events.off(GAME_SCENE_SCENE_EVENTS.CHECK_END_TURN, this.onAttackComplete);
            this.onAttackComplete = null;
        }
    }

    // ── private ──────────────────────────────────────────────────────────────

    private afterAttack(context: Game): void {
        // level is over (last enemy / last player monster died) - the outro popup owns the scene
        if (!this.active || context.levelFinished) return;

        // N3's displayed magic bonus depends on who stands next to it
        context.updateAdditionalMagicDamage();

        // a killed N5 comes back right away (old checkNextTurn did this before anything else)
        applyPendingResurrections(context, () => {
            if (!this.active || context.levelFinished) return;
            exitAfterMonsterAction(context, this.attacker);
        });
    }

    private getDamage(context: Game, attacker: Monster): number {
        const unit = attacker.unitData;

        if (unit.ranged > 0) {
            // monster N6 special - bonus ranged damage after a kill (set in Game.checkSpecificMonsterSkillOnMonsterDie)
            return unit.ranged + attacker.additionalRangedDamage;
        }

        if (unit.magic > 0) {
            let additionalDamage = 0;
            if (+attacker.type === 3) {
                // monster N3 special - +1 for every adjacent enemy magic monster
                additionalDamage = context.movementArrowsContainer
                    .getNeighborCells(unit.row, unit.col, 1, 0, 1)
                    .filter((cell: any) => cell.isTargetMagicMonster).length;
            }
            return unit.magic + additionalDamage;
        }

        // monster N8 special - bonus melee when low on health
        const additionalDamage = +attacker.type === 8 ? attacker.additionaMelee : 0;
        return unit.melee + additionalDamage;
    }

    private findTarget(context: Game): Monster | undefined {
        const enemies: Monster[] = this.attacker.isPlayerMonster
            ? context.data.list.opponentMonsters
            : context.data.list.playerMonsters;

        // any cell of a giant leads to the giant itself
        const giantData = context.data.list.gridPositions[this.targetRow][this.targetCol].giantData;
        const row = giantData ? giantData.row : this.targetRow;
        const col = giantData ? giantData.col : this.targetCol;

        return enemies.find((m: Monster | null) => m && m.unitData.row === row && m.unitData.col === col);
    }
}
