import { Game, BUFF_TYPES } from '../../Game';
import { BaseState } from './BaseState';
import { applyPendingResurrections } from './applyPendingResurrections';
import { exitAfterMonsterAction } from './exitAfterMonsterAction';
import { Monster } from '../Monster';
import { GAME_OBJECT_DEPTHS, main_config } from '../../../configs/main_config';

export interface IBombPosition {
    row: number;
    col: number;
}

/** The 3x3 area of an explosion, in the order the old code applied it (the center is [0, 0]). */
const EXPLOSION_AREA: [number, number][] = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 0], [0, 1],
    [1, -1], [1, 0], [1, 1]
];

const CENTER_DAMAGE = 2;
const SURROUNDING_DAMAGE = 1;

/**
 * A monster stepped on a bomb buff (buffBombExplodeHandler in Game-old.ts).
 *
 * Entered from MONSTER_MOVE_STATE only (first thing it checks once the move is done), with the
 * monster that moved and the bomb position(s) it stepped on (a giant can step on several).
 * Every bomb explodes: 2 damage to whoever stands on the bomb's cell (the monster that stepped on
 * it too!) and 1 damage to the 8 cells around it, armor is ignored. Bombs in the surrounding
 * cells explode as a chain reaction half a second later. When all explosions are over and the
 * deaths they caused have played out, killed N5 monsters are resurrected and the state exits - the
 * same 3 exits as MONSTER_MOVE_STATE (see exitAfterMonsterAction), for the monster's team:
 *  - the monster has more moves             => PLAYER_ / OPPONENT_MONSTER_SELECTED_STATE (same monster)
 *  - another monster of its team has moves  => PLAYER_ / OPPONENT_MONSTER_SELECTED_STATE (that monster)
 *  - no monster of its team has moves       => APPLY_POISON_STATE
 * (the monster that moved can have died in the explosion - it is then not an option.)
 * If the explosion ends the level the outro popup owns the scene and nothing happens here.
 */
export class BombExplosionState extends BaseState {

    readonly monster: Monster;
    readonly bombs: IBombPosition[];

    /** explosion centers whose animation is still playing */
    private pendingExplosions: number = 0;
    /** chain reactions that are scheduled but have not started yet */
    private pendingChainReactions: number = 0;
    private anyMonsterDied: boolean = false;
    private finishing: boolean = false;

    constructor(monster: Monster, bombs: IBombPosition[]) {
        super();
        this.monster = monster;
        this.bombs = bombs;
    }

    enter(context: Game): void {
        this.active = true;
        console.log('[BombExplosionState] enter - bombs:', this.bombs);

        this.bombs.forEach(bomb => this.explode(context, bomb.row, bomb.col));

        // (the explosion animations are what completes the state - see checkAllExplosionsDone)
    }

    exit(_context: Game): void {
        this.active = false;
        console.log('[BombExplosionState] exit');
    }

    // ── private ──────────────────────────────────────────────────────────────

    private explode(context: Game, row: number, col: number): void {
        const grid = context.data.list.gridPositions;

        // the bomb is used up (a chained bomb is still lying on the grid)
        grid[row][col].buff?.buffContainer?.destroy(true);
        delete grid[row][col].buff;

        this.pendingExplosions++;
        const chainedBombs: IBombPosition[] = [];

        EXPLOSION_AREA.forEach(([dRow, dCol]) => {
            const r = row + dRow;
            const c = col + dCol;
            if (r < 0 || r >= main_config.gridSizeVertical || c < 0 || c >= main_config.gridSizeHorizontal) return;

            const isCenter = dRow === 0 && dCol === 0;
            this.showExplosion(context, r, c, isCenter);

            if (grid[r][c].occupiedBy) {
                const monster = this.findMonster(context, r, c);
                // takeDamege returns true when the monster has no health left
                if (monster && monster.takeDamege(isCenter ? CENTER_DAMAGE : SURROUNDING_DAMAGE, false, true, false, 0)) {
                    this.anyMonsterDied = true;
                }
            } else if (grid[r][c].buff?.buffType === BUFF_TYPES.BOMB) {
                chainedBombs.push({ row: r, col: c });
            }
        });

        if (chainedBombs.length) {
            this.pendingChainReactions++;
            context.time.delayedCall(500, () => {
                this.pendingChainReactions--;
                if (!this.active) return;
                chainedBombs.forEach(bomb => {
                    // another explosion can have reached it in the meantime
                    if (grid[bomb.row][bomb.col].buff) {
                        this.explode(context, bomb.row, bomb.col);
                    }
                });
                this.checkAllExplosionsDone(context);
            });
        }
    }

    /** Any cell of a giant leads to the giant itself. */
    private findMonster(context: Game, row: number, col: number): Monster | undefined {
        const position = context.data.list.gridPositions[row][col];
        const monsters: Monster[] = position.occupiedBy === 'player'
            ? context.data.list.playerMonsters
            : context.data.list.opponentMonsters;

        const monsterRow = position.giantData ? position.giantData.row : row;
        const monsterCol = position.giantData ? position.giantData.col : col;

        return monsters.find((m: Monster | null) => m && m.unitData.row === monsterRow && m.unitData.col === monsterCol);
    }

    private showExplosion(context: Game, row: number, col: number, isCenter: boolean): void {
        const { x, y } = context.data.list.gridPositions[row][col];
        const explodeImage = context.add
            .image(x + context.mainGridContainer.x, y + context.mainGridContainer.y, 'boom')
            .setScale(1)
            .setOrigin(0.5)
            .setDepth(GAME_OBJECT_DEPTHS.gameSceneExplodeImage);

        context.tweens.chain({
            tweens: [
                {
                    targets: explodeImage,
                    scale: explodeImage.scale * 1.1,
                    yoyo: true,
                    duration: 150
                },
                {
                    targets: explodeImage,
                    alpha: 0,
                    duration: 700,
                    onComplete: () => {
                        explodeImage.destroy(true);
                        // the center cell's animation is the one that counts an explosion as finished
                        if (isCenter) {
                            this.pendingExplosions--;
                            this.checkAllExplosionsDone(context);
                        }
                    }
                }
            ]
        });
    }

    private checkAllExplosionsDone(context: Game): void {
        if (!this.active || this.finishing) return;
        if (this.pendingExplosions > 0 || this.pendingChainReactions > 0) return;

        this.finishing = true;
        // give the death animations (and item drops) of the killed monsters time to play out
        context.time.delayedCall(this.anyMonsterDied ? 2100 : 1100, () => this.finish(context));
    }

    private finish(context: Game): void {
        // the explosion ended the level - the outro popup owns the scene
        if (!this.active || context.levelFinished) return;

        // N3's displayed magic bonus depends on who stands next to it
        context.updateAdditionalMagicDamage();

        // a killed N5 comes back right away
        applyPendingResurrections(context, () => {
            if (!this.active || context.levelFinished) return;
            exitAfterMonsterAction(context, this.monster);
        });
    }
}
