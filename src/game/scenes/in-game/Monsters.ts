import { Scene } from 'phaser';
import { main_config } from '../../configs/main_config';
import { IGridDimensions, IUnitData } from '../Game';
import { Monster } from './Monster';
import { TestPlayerTeam } from './TestPlayerTeam';
import { TestOpponentTeam } from './TestOpponentTeam';

export class Monsters {
    static scene: Scene;
    static mainGridContainer: Phaser.GameObjects.Container;

    constructor() { }

    static createMonsters(scene: Phaser.Scene, parent: Phaser.GameObjects.Container, gridDimensions: IGridDimensions): void {
        this.scene = scene;
        this.create(parent, gridDimensions, true);
        this.create(parent, gridDimensions, false);
    }

    static create(parent: Phaser.GameObjects.Container, gridDimensions: IGridDimensions, isPlayer: boolean) {

        const team = isPlayer ? TestPlayerTeam.team : TestOpponentTeam.team;
        this.mainGridContainer = parent;

        team.forEach((unit: IUnitData, index: number) => {
            const gridPosition = this.scene.data.list.gridPositions[unit.row][unit.col];
            gridPosition.isEmpty = false;
            gridPosition.occupiedBy = isPlayer ? 'player' : 'opponent';

            const x = gridDimensions.cellSize * unit.col + gridDimensions.cellSize / 2;
            const y = gridDimensions.cellSize * unit.row + gridDimensions.cellSize / 2;
            const width = gridDimensions.cellSize - main_config.lineWidth;
            const height = gridDimensions.cellSize - main_config.lineWidth;
            const monster = new Monster(this.scene, x, y, width, height, unit, index, isPlayer);

            // monster.on('monster-selected', (data: IUnitData) => {
            //     this.scene.events.emit('monster-selected', [monster, data]);
            // });

            monster.on('monster-died', (data: IUnitData) => {
                this.scene.data.list.gridPositions[data.row][data.col].isEmpty = true;
                delete this.scene.data.list.gridPositions[data.row][data.col].occupiedBy;
                if (isPlayer) {
                    this.scene.data.list.playerMonsters[index] = null;
                } else {
                    this.scene.data.list.opponentMonsters[index] = null;
                }
                this.scene.events.emit('monster-died', [monster, data]);
            });

            this.mainGridContainer.add(monster);
            if (isPlayer) {
                this.scene.data.list.playerMonsters.push(monster);
            } else {
                this.scene.data.list.opponentMonsters.push(monster);
            }
        });
    }
}
