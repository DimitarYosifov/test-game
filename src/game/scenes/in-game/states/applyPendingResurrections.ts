import { Game, GAME_SCENE_SCENE_EVENTS, IUnitData } from '../../Game';
import { Monster } from '../Monster';
import { getAllMonsterTypes, getMonsterDataConfig, main_config } from '../../../configs/main_config';

/**
 * Monster N5's special skill: when it dies it is resurrected (logic of applyPendingResurrections
 * in Game-old.ts). Killed N5 monsters are queued in context.pendingRessurections by the
 * CHECK_PENDING_RESSURECTION handler.
 *
 * Exported so states that can kill monsters while they run (e.g. opponent spells) can resurrect
 * them in place without leaving the state.
 */
export function applyPendingResurrections(context: Game, onComplete: () => void): void {

    const pending = context.pendingRessurections;

    if (!pending.length) {
        context.pendingRessurections = [];
        onComplete();
        return;
    }

    pending.forEach((killedMonster: Monster, index: number) => {
        const isLast = index === pending.length - 1;
        const isPlayer = killedMonster.isPlayerMonster;
        const row = killedMonster.unitData.row;
        const col = killedMonster.unitData.col;

        const gridPosition = context.data.list.gridPositions[row][col];
        gridPosition.isEmpty = false;
        gridPosition.occupiedBy = isPlayer ? 'player' : 'opponent';

        // resurrected as a random monster (never another N5) with one star less
        const randomMonsterType = Phaser.Math.RND.pick(getAllMonsterTypes().filter((x: string) => x !== '5'));
        const unitData = getMonsterDataConfig(+randomMonsterType, killedMonster.unitData.stars - 1);

        const cellSize = main_config.cellSize;
        const x = cellSize * col + cellSize / 2;
        const y = cellSize * row + cellSize / 2;
        const width = cellSize - main_config.lineWidth;
        const height = cellSize - main_config.lineWidth;

        unitData.health = 1;
        unitData.row = row;
        unitData.col = col;

        const resurrectedMonster = new Monster(context, x, y, width, height, unitData, killedMonster.index, isPlayer);
        // can not be attacked on the turn it comes back
        gridPosition.justRessurected = true;
        resurrectedMonster.unitData.movesLeft = 0;

        resurrectedMonster.on(GAME_SCENE_SCENE_EVENTS.MONSTER_DIED, (data: IUnitData) => {
            context.data.list.gridPositions[data.row][data.col].isEmpty = true;
            delete context.data.list.gridPositions[data.row][data.col].occupiedBy;
            delete context.data.list.gridPositions[data.row][data.col].giantData;
            if (isPlayer) {
                context.data.list.playerMonsters[killedMonster.index] = null;
            } else {
                context.data.list.opponentMonsters[killedMonster.index] = null;
            }
            context.events.emit(GAME_SCENE_SCENE_EVENTS.MONSTER_DIED, [resurrectedMonster, data]);
        });

        context.mainGridContainer.add(resurrectedMonster);

        if (isPlayer) {
            context.data.list.playerMonsters[killedMonster.index] = resurrectedMonster;
        } else {
            context.data.list.opponentMonsters[killedMonster.index] = resurrectedMonster;
        }

        if (isLast) {
            context.checkMapVisibility(true);
            context.time.delayedCall(1000, () => {
                context.pendingRessurections = [];
                context.events.emit(GAME_SCENE_SCENE_EVENTS.PENDING_RESSURECTIONS_COMPLETE);
                onComplete();
            });
        }
    });
}
