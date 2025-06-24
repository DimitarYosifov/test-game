import { Scene } from 'phaser';
import { main_config } from '../configs/main_config';
import { CreatePlayerMonsters } from './in-game/CreatePlayerMonsters';
import { CreateOpponentMonsters } from './in-game/CreateOpponentMonsters';

export class Game extends Scene {

    private mainGridContainer: Phaser.GameObjects.Container;
    private gridLines: Phaser.GameObjects.Graphics;
    private gridDimensions: IGridDimensions;

    constructor() {
        super('Game');
    }

    create() {
        this.setGridDimensions();
        this.drawGridLines();
        this.createMainGridContainer();
        this.setGridPositions();

        CreatePlayerMonsters.setSpawnPositions(this, this.mainGridContainer, this.gridDimensions);
        CreateOpponentMonsters.setSpawnPositions(this, this.mainGridContainer, this.gridDimensions);
    }

    private setGridDimensions(): void {
        this.gridDimensions = {
            gridSizeHorizontal: main_config.gridSizeHorizontal,
            gridSizeVertical: main_config.gridSizeVertical,
            cellSize: main_config.cellSize,
            totalSizeHorizontal: main_config.cellSize * main_config.gridSizeHorizontal,
            totalSizeVertical: main_config.cellSize * main_config.gridSizeVertical
        }
    }

    private drawGridLines(): void {

        this.gridLines = this.add.graphics();
        this.gridLines.lineStyle(main_config.lineWidth, 0xffffff);

        for (let x = 0; x <= this.gridDimensions.gridSizeHorizontal; x++) {
            this.gridLines.moveTo(x * this.gridDimensions.cellSize, 0);
            this.gridLines.lineTo(x * this.gridDimensions.cellSize, this.gridDimensions.totalSizeVertical);
        }

        for (let y = 0; y <= this.gridDimensions.gridSizeVertical; y++) {
            this.gridLines.moveTo(0, y * this.gridDimensions.cellSize);
            this.gridLines.lineTo(this.gridDimensions.totalSizeHorizontal, y * this.gridDimensions.cellSize);
        }

        this.gridLines.strokePath();
        this.gridLines.setPosition(0, 0);
    }

    private createMainGridContainer(): void {

        this.mainGridContainer = this.add.container(0, 0);
        this.mainGridContainer.add(this.gridLines);

        const sceneWidth = this.cameras.main.width;
        const sceneHeight = this.cameras.main.height;

        this.mainGridContainer.x = sceneWidth / 2 - this.gridDimensions.totalSizeHorizontal / 2;
        this.mainGridContainer.y = sceneHeight / 2 - this.gridDimensions.totalSizeVertical / 2;
    }

    private setGridPositions(): void {
        const positions = [];
        for (let row = 0; row < this.gridDimensions.gridSizeVertical; row++) {
            let rowPositionsData = [];
            for (let col = 0; col < this.gridDimensions.gridSizeHorizontal; col++) {
                const x = this.mainGridContainer.x + this.gridDimensions.cellSize * col + this.gridDimensions.cellSize / 2;
                const y = this.mainGridContainer.y + this.gridDimensions.cellSize * row + this.gridDimensions.cellSize / 2;

                /**   TEST   */
                // let img = this.add.image(x, y, '8').setOrigin(0.5);
                // img.displayWidth = this.gridDimensions.cellSize - main_config.lineWidth / 2;
                // img.displayHeight = this.gridDimensions.cellSize - main_config.lineWidth / 2;
                /** -------------------*/

                rowPositionsData.push({ x, y });
            }
            positions.push(rowPositionsData);
        }
        this.data.set('gridPositions', positions);
        console.log(this.data.get('gridPositions'))
    }

}

export interface IGridDimensions {
    gridSizeHorizontal: number;
    gridSizeVertical: number;
    cellSize: number;
    totalSizeHorizontal: number;
    totalSizeVertical: number;
}

export interface IGridPosition {
    col: number;
    row: number;
}


