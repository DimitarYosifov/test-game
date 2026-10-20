import { Game, IUnitData } from '../../Game';
import { Monster } from '../Monster';
import { main_config } from '../../../configs/main_config';

/**
 * The opponent's decision making, ported from Game-old.ts (getRandomOpponentMonster,
 * getRandomTargetForOpponent, findClosestPlayerMonsterToMoveTo, checkPossibleMove, getMove,
 * getRandomDirection). Pure helpers - they only read the scene's data, the states act on the result.
 */

export interface IAttackTarget {
    row: number;
    col: number;
    occupiedBy: string;
    justRessurected: boolean;
}

export interface IMovePosition {
    row: number;
    col: number;
}

/**
 * The 8 directions a monster can move to, in the order the old code checked them.
 * A normal monster needs only the cell it moves to to be empty. A giant (2x2, anchored at its
 * top-left cell) needs the listed cells (offsets from its anchor) to be empty.
 */
interface IMoveDirection {
    dRow: number;
    dCol: number;
    giantCells: [number, number][];
}

const DIRECTIONS: Record<string, IMoveDirection> = {
    UP: { dRow: -1, dCol: 0, giantCells: [[-1, 0], [-1, 1]] },
    UP_RIGHT: { dRow: -1, dCol: 1, giantCells: [[-1, 1], [-1, 2], [0, 2]] },
    RIGHT: { dRow: 0, dCol: 1, giantCells: [[0, 2], [1, 2]] },
    RIGHT_DOWN: { dRow: 1, dCol: 1, giantCells: [[2, 1], [2, 2], [1, 2]] },
    DOWN: { dRow: 1, dCol: 0, giantCells: [[2, 0], [2, 1]] },
    LEFT_DOWN: { dRow: 1, dCol: -1, giantCells: [[1, -1], [2, -1], [2, 0]] },
    LEFT: { dRow: 0, dCol: -1, giantCells: [[0, -1], [1, -1]] },
    UP_LEFT: { dRow: -1, dCol: -1, giantCells: [[0, -1], [-1, -1], [-1, 0]] }
};

const ALL_DIRECTIONS: IMoveDirection[] = [
    DIRECTIONS.UP, DIRECTIONS.UP_RIGHT, DIRECTIONS.RIGHT, DIRECTIONS.RIGHT_DOWN,
    DIRECTIONS.DOWN, DIRECTIONS.LEFT_DOWN, DIRECTIONS.LEFT, DIRECTIONS.UP_LEFT
];

function canMove(context: Game, monster: Monster, direction: IMoveDirection): boolean {
    const { row, col, isGiant } = monster.unitData;
    if (isGiant) {
        return direction.giantCells.every(([dRow, dCol]) => context.isCellEmpty(row + dRow, col + dCol));
    }
    return context.isCellEmpty(row + direction.dRow, col + direction.dCol);
}

/** Every cell that is visible (not under the fog) to at least one opponent monster. */
export function getCellsVisibleToOpponent(context: Game): boolean[][] {
    const visible: boolean[][] = Array.from(
        { length: main_config.gridSizeVertical },
        () => Array(main_config.gridSizeHorizontal).fill(false)
    );
    context.data.list.opponentMonsters.filter((m: Monster | null) => m !== null).forEach((m: Monster) => {
        context.getVisibleCells(m.unitData.row, m.unitData.col, m.unitData.vision, [], m.unitData.isGiant)
            .forEach(cell => { visible[cell.row][cell.col] = true; });
    });
    return visible;
}

/** Player monsters the monster can hit right now (in its attack range and visible to the opponent). */
export function getAttackableTargets(context: Game, monster: Monster, visibleToOpponent: boolean[][]): IAttackTarget[] {
    const range = monster.unitData.ranged > 0 ? main_config.rangedUnitsRange : 1;
    return context.getVisibleCells(
        monster.unitData.row,
        monster.unitData.col,
        range,
        visibleToOpponent,
        monster.unitData.isGiant
    ).filter(cell => cell.occupiedBy === 'player' && !cell.justRessurected);
}

/** Prefers a target the monster can kill, otherwise picks a random one. */
export function pickTarget(context: Game, monster: Monster, targets: IAttackTarget[]): IAttackTarget {
    const unit = monster.unitData;

    for (const target of targets) {
        const playerMonster: Monster | undefined = context.data.list.playerMonsters.find(
            (m: Monster | null) => m !== null && m.unitData.row === target.row && m.unitData.col === target.col
        );
        if (!playerMonster) continue;

        if (unit.magic) {
            // magic ignores the shield
            if (playerMonster.unitData.health - unit.magic <= 0) return target;
        } else if (unit.ranged) {
            if (playerMonster.unitData.health + playerMonster.unitData.shield - unit.ranged <= 0) return target;
        } else if (unit.melee) {
            if (playerMonster.unitData.health + playerMonster.unitData.shield - unit.melee <= 0) return target;
        }
    }

    return targets[Phaser.Math.RND.between(0, targets.length - 1)];
}

/** The closest player monster (straight-line distance) standing on a cell visible to the opponent. */
export function findClosestPlayerMonster(context: Game, monster: Monster, visibleToOpponent: boolean[][]): Monster | undefined {
    const x1 = monster.unitData.col;
    const y1 = monster.unitData.row;

    let shortestDistance = Infinity;
    const coords = { x: -1, y: -1 };

    for (let row = 0; row < main_config.gridSizeVertical; row++) {
        for (let col = 0; col < main_config.gridSizeHorizontal; col++) {
            if (visibleToOpponent[row][col] && context.data.list.gridPositions[row][col].occupiedBy === 'player') {
                const distance = Phaser.Math.Distance.Between(x1, y1, col, row);
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    coords.x = col;
                    coords.y = row;
                }
            }
        }
    }

    return context.data.list.playerMonsters.find(
        (m: Monster | null) => m && m.unitData.row === coords.y && m.unitData.col === coords.x
    );
}

/** True if the monster has at least one free neighbouring position to move to. */
export function hasPossibleMove(context: Game, monster: Monster): boolean {
    return ALL_DIRECTIONS.some(direction => canMove(context, monster, direction));
}

/**
 * The move that brings the monster closest to the target: every free position scores a point
 * for getting closer in rows and another for getting closer in columns, one of the best-scoring
 * positions is picked at random. Only call when hasPossibleMove() is true.
 */
export function getMoveTowards(context: Game, monster: Monster, target: IUnitData): IMovePosition {
    const current = monster.unitData;

    const moves = ALL_DIRECTIONS
        .filter(direction => canMove(context, monster, direction))
        .map(direction => {
            const row = current.row + direction.dRow;
            const col = current.col + direction.dCol;
            const weight =
                +(Math.abs(row - target.row) < Math.abs(current.row - target.row)) +
                +(Math.abs(col - target.col) < Math.abs(current.col - target.col));
            return { row, col, weight };
        });

    const maxWeight = Math.max(...moves.map(m => m.weight));
    const best = Phaser.Math.RND.pick(moves.filter(m => m.weight === maxWeight));
    return { row: best.row, col: best.col };
}

/**
 * A random free neighbouring position, biased to the right (towards the player):
 * right 20%, up-right 20%, down-right 20%, up 15%, down 15%, up-left 4%, down-left 3%, left 3%.
 * Only call when hasPossibleMove() is true.
 */
export function getRandomMove(context: Game, monster: Monster): IMovePosition {
    const { row, col } = monster.unitData;

    const pickDirection = (): IMoveDirection => {
        const rnd = Phaser.Math.RND.between(1, 100);
        if (rnd > 80) return DIRECTIONS.RIGHT;
        if (rnd > 60) return DIRECTIONS.UP_RIGHT;
        if (rnd > 40) return DIRECTIONS.RIGHT_DOWN;
        if (rnd > 25) return DIRECTIONS.UP;
        if (rnd > 10) return DIRECTIONS.DOWN;
        if (rnd > 7) return DIRECTIONS.LEFT_DOWN;
        if (rnd > 4) return DIRECTIONS.LEFT;
        return DIRECTIONS.UP_LEFT;
    };

    let direction = pickDirection();
    while (!canMove(context, monster, direction)) {
        direction = pickDirection();
    }

    return { row: row + direction.dRow, col: col + direction.dCol };
}
