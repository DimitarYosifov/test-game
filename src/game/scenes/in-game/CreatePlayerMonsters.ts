import { main_config } from '../../configs/main_config';
import { IGridDimensions, IGridPosition } from '../Game';
import { Monster } from './Monster';

export class CreatePlayerMonsters {

    // scene: Phaser.Scene;

    constructor() { }


    static setSpawnPositions(scene: Phaser.Scene, parent: Phaser.GameObjects.Container, gridDimensions: IGridDimensions) {

        const spawnPositions = [
            { col: 10, row: 3 },
            { col: 11, row: 6 },
            { col: 10, row: 1 },
        ];

        const mainGridContainer = parent;

        spawnPositions.forEach((pos: IGridPosition) => {
            //TODO interface here !!!!
            const x = gridDimensions.cellSize * pos.col + gridDimensions.cellSize / 2;
            const y = gridDimensions.cellSize * pos.row + gridDimensions.cellSize / 2;
            const width = gridDimensions.cellSize - main_config.lineWidth / 2;
            const height = gridDimensions.cellSize - main_config.lineWidth / 2;
            const monster = new Monster(scene, x, y, width, height);
            mainGridContainer.add(monster);
        });
    }
}
