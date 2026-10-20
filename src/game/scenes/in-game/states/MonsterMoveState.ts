import { Game, GAME_SCENE_SCENE_EVENTS } from '../../Game';
import { BaseState } from './BaseState';
import { BombExplosionState, IBombPosition } from './BombExplosionState';
import { exitAfterMonsterAction } from './exitAfterMonsterAction';
import { pausePlayerInput } from './pausePlayerInput';
import { Monster } from '../Monster';

/**
 * Moves ANY monster (player's or opponent's - the side comes from monster.isPlayerMonster) to a
 * new cell: updates the grid data, the fog of war and runs the move tween (Monster.move).
 * Logic of the old directionSelectHandler + the move part of the CHECK_END_TURN handler.
 *
 * Exits, once the move has finished (checked in this order):
 *  1. the monster stepped on a bomb buff    => BOMB_EXPLOSION_STATE (it has the exits below)
 *  then (see exitAfterMonsterAction), the same 3 for both teams:
 *  2. the monster has more moves            => PLAYER_ / OPPONENT_MONSTER_SELECTED_STATE (same monster)
 *  3. another monster of its team has moves => PLAYER_ / OPPONENT_MONSTER_SELECTED_STATE (that monster)
 *  4. no monster of its team has moves      => APPLY_POISON_STATE
 */
export class MonsterMoveState extends BaseState {

    readonly monster: Monster;
    readonly newRow: number;
    readonly newCol: number;

    private onMoveComplete: (() => void) | null = null;
    private onBombFound: ((data: number[]) => void) | null = null;
    /** bombs the monster stepped on, reported by Monster.move() (a giant can step on several) */
    private bombs: IBombPosition[] = [];

    constructor(monster: Monster, newRow: number, newCol: number) {
        super();
        this.monster = monster;
        this.newRow = newRow;
        this.newCol = newCol;
    }

    enter(context: Game): void {
        this.active = true;
        const monster = this.monster;
        const isPlayer = monster.isPlayerMonster;
        console.log(`[MonsterMoveState] enter - ${isPlayer ? 'player' : 'opponent'} monster to row:`, this.newRow, 'col:', this.newCol);

        context.movementArrowsContainer.removeArrows();

        this.updateGrid(context, monster, isPlayer ? 'player' : 'opponent');

        // update fog of war
        context.checkMapVisibility(false);

        if (isPlayer) {
            // no skip / end turn / spells / monster selection while the monster is moving
            pausePlayerInput(context);
        }

        // Monster.move() tweens the monster, calls decreaseMoves() on complete and then emits
        // CHECK_END_TURN. We listen once for that event to know when to leave this state.
        this.onMoveComplete = () => {
            this.onMoveComplete = null;
            if (!this.active) return;
            this.onAfterMove(context, monster);
        };
        context.events.once(GAME_SCENE_SCENE_EVENTS.CHECK_END_TURN, this.onMoveComplete);

        // When the monster steps on a bomb buff Monster.move() does NOT emit CHECK_END_TURN, it
        // emits BUFF_BOMB_EXPLODE (once per bomb, all in the same tick, after the monster has
        // spent its move) instead. That is the other way the move can complete.
        this.onBombFound = (data: number[]) => {
            if (!this.active) return;
            this.bombs.push({ row: data[0], col: data[1] });
            if (this.bombs.length === 1) {
                // a giant can step on up to 4 bombs - the rest are reported right after the first,
                // so wait for the next tick before leaving
                context.time.delayedCall(0, () => this.onAfterMove(context, monster));
            }
        };
        context.events.on(GAME_SCENE_SCENE_EVENTS.BUFF_BOMB_EXPLODE, this.onBombFound);

        monster.move(this.newRow, this.newCol);
    }

    exit(context: Game): void {
        this.active = false;
        console.log('[MonsterMoveState] exit');
        // safety: remove listeners if the state is exited before the tween completes
        if (this.onMoveComplete) {
            context.events.off(GAME_SCENE_SCENE_EVENTS.CHECK_END_TURN, this.onMoveComplete);
            this.onMoveComplete = null;
        }
        if (this.onBombFound) {
            context.events.off(GAME_SCENE_SCENE_EVENTS.BUFF_BOMB_EXPLODE, this.onBombFound);
            this.onBombFound = null;
        }
    }

    // ── private ──────────────────────────────────────────────────────────────

    /** Frees the cells the monster leaves and occupies the ones it moves to (giants take 2x2 cells). */
    private updateGrid(context: Game, monster: Monster, side: 'player' | 'opponent'): void {
        const grid = context.data.list.gridPositions;
        const { row, col } = monster.unitData;

        const cellsOf = (r: number, c: number): { row: number, col: number }[] => monster.isGiant
            ? [{ row: r, col: c }, { row: r, col: c + 1 }, { row: r + 1, col: c }, { row: r + 1, col: c + 1 }]
            : [{ row: r, col: c }];

        // clear old position
        cellsOf(row, col).forEach(cell => {
            grid[cell.row][cell.col].isEmpty = true;
            delete grid[cell.row][cell.col].occupiedBy;
            delete grid[cell.row][cell.col].giantData;
        });

        // mark new position
        cellsOf(this.newRow, this.newCol).forEach(cell => {
            grid[cell.row][cell.col].isEmpty = false;
            grid[cell.row][cell.col].occupiedBy = side;
            if (monster.isGiant) {
                grid[cell.row][cell.col].giantData = { row: this.newRow, col: this.newCol };
            }
        });
    }

    private onAfterMove(context: Game, monster: Monster): void {
        if (!this.active) return;

        // 1. the monster stepped on a bomb
        if (this.bombs.length) {
            context.stateMachine.setState(new BombExplosionState(monster, this.bombs));
            return;
        }

        // N3's displayed magic bonus depends on who stands next to it (old checkNextTurn did this first)
        context.updateAdditionalMagicDamage();

        // 2.-4. same exits as after an attack: see exitAfterMonsterAction
        exitAfterMonsterAction(context, monster);
    }
}
