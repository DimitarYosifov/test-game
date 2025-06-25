import { Scene } from 'phaser';
import { main_config } from '../configs/main_config';
import { Monsters } from './in-game/Monsters';
import { MovementArrowsContainer } from './in-game/MovementArrowsContainer';
import { Monster } from './in-game/Monster';

export class Game extends Scene {

    mainGridContainer: Phaser.GameObjects.Container;
    movementArrowsContainer: MovementArrowsContainer;
    private gridLines: Phaser.GameObjects.Graphics;
    private gridDimensions: IGridDimensions;
    currentlySelectedMonster: Monster;

    constructor() {
        super('Game');
    }

    create() {

        this.add.image(0, 0, 'bg').setOrigin(0);
        this.data.list.isPlayerTurn = true;
        this.setGridDimensions();
        this.drawGridLines();
        this.createContainers();
        this.setGridPositions();
        this.setInitialMonsters();

        Monsters.createMonsters(this, this.mainGridContainer, this.gridDimensions);

        this.events.on('monster-selected', (data: Monster[] | IUnitData[]) => {
            this.currentlySelectedMonster = data[0] as Monster;
            this.mainGridContainer.bringToTop(this.currentlySelectedMonster);
            this.movementArrowsContainer.createArrows(data[1] as IUnitData)
        });

        this.events.on('direction-selected', (data: number[]) => {

            // this.currentlySelectedMonster.pendingAction = false;
            const newRow = data[0];
            const newCol = data[1];

            const currentData = this.currentlySelectedMonster.unitData;
            this.data.list.gridPositions[currentData.row][currentData.col].isEmpty = true;
            delete this.data.list.gridPositions[currentData.row][currentData.col].occupiedBy;

            this.movementArrowsContainer.removeArrows();
            this.currentlySelectedMonster.move(newRow, newCol);

            this.data.list.gridPositions[newRow][newCol].isEmpty = false;
            const isPlayerTurn = this.data.list.isPlayerTurn;
            this.data.list.gridPositions[newRow][newCol].occupiedBy = isPlayerTurn ? 'player' : 'opponent';

        });

        this.events.on('target-selected', (data: number[]) => {

            const newRow = data[0];
            const newCol = data[1];
            const isRanged = data[2];

            // const currentData = this.currentlySelectedMonster.unitData;

            this.movementArrowsContainer.removeArrows();
            this.currentlySelectedMonster.performHit(newRow, newCol);

            const isPlayerTurn = this.data.list.isPlayerTurn;
            const damage = isRanged ? this.currentlySelectedMonster.unitData.ranged : this.currentlySelectedMonster.unitData.melee;
            if (isPlayerTurn) {
                const target: Monster = this.data.list.opponentMonsters.find((m: Monster) => m.unitData.row === newRow && m.unitData.col === newCol);
                // target.setScale(2) // test
                target.takeDamege(damage);
            } else {
                const target: Monster = this.data.list.playerMonsters.find((m: Monster) => m.unitData.row === newRow && m.unitData.col === newCol);
                target.takeDamege(damage);
            }

        });

        this.events.on('check-end-turn', () => {
            this.checkNextTurn()
        })
        this.addInteraction();
    }

    private checkNextTurn(): void {
        let turnEnd = false;
        if (this.data.list.isPlayerTurn) {
            turnEnd = this.data.list.playerMonsters.filter((m: Monster | null) => m !== null && m.pendingAction === true).length === 0;
        } else {
            turnEnd = this.data.list.opponentMonsters.filter((m: Monster | null) => m !== null && m.pendingAction === true).length === 0;
        }
        if (turnEnd) {
            alert('end turn');
            this.data.list.isPlayerTurn = !this.data.list.isPlayerTurn;
            this.addInteraction();
        }
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

    private createContainers(): void {

        const sceneWidth = this.cameras.main.width;
        const sceneHeight = this.cameras.main.height;

        const x = sceneWidth / 2 - this.gridDimensions.totalSizeHorizontal / 2;
        const y = sceneHeight / 2 - this.gridDimensions.totalSizeVertical / 2;

        this.mainGridContainer = this.add.container(x, y);
        this.mainGridContainer.add(this.gridLines);

        this.movementArrowsContainer = new MovementArrowsContainer(this, x, y);
    }

    private setGridPositions(): void {
        const positions = [];
        for (let row = 0; row < this.gridDimensions.gridSizeVertical; row++) {
            let rowPositionsData = [];
            for (let col = 0; col < this.gridDimensions.gridSizeHorizontal; col++) {
                const x = this.gridDimensions.cellSize * col + this.gridDimensions.cellSize / 2;
                const y = this.gridDimensions.cellSize * row + this.gridDimensions.cellSize / 2;
                const isEmpty = true;
                rowPositionsData.push({ x, y, isEmpty });
            }
            positions.push(rowPositionsData);
        }
        this.data.set('gridPositions', positions);
        console.log(this.data.get('gridPositions'))
    }

    private setInitialMonsters(): void {
        this.data.set('playerMonsters', []);
        this.data.set('opponentMonsters', []);
    }

    private addInteraction(): void {
        this.data.list.playerMonsters.forEach((monster: Monster) => {
            if (monster) {
                monster.setInteraction(this.data.list.isPlayerTurn);
                monster.pendingAction = this.data.list.isPlayerTurn;
            }
        });
        this.data.list.opponentMonsters.forEach((monster: Monster) => {
            if (monster) {
                monster.setInteraction(!this.data.list.isPlayerTurn);
                monster.pendingAction = !this.data.list.isPlayerTurn;
            }
        });
    }
}

export interface IGridDimensions {
    gridSizeHorizontal: number;
    gridSizeVertical: number;
    cellSize: number;
    totalSizeHorizontal: number;
    totalSizeVertical: number;
}

export interface IUnitData {
    col: number;
    row: number;
    melee: number;
    ranged: number;
    health: number;
    shield: number;
    vision: number;
    stars: number;
    type: string;
}
