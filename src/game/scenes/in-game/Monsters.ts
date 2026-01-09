import { Scene } from 'phaser';
import { main_config } from '../../configs/main_config';
import { GAME_SCENE_SCENE_EVENTS, IGridDimensions, IUnitData } from '../Game';
import { Monster } from './Monster';
import { TestPlayerTeam } from './TestPlayerTeam';
import { TestOpponentTeam } from './TestOpponentTeam';

export class Monsters {
    static scene: Scene;
    static mainGridContainer: Phaser.GameObjects.Container;

    constructor() { }

    static createMonsters(scene: Phaser.Scene, parent: Phaser.GameObjects.Container, gridDimensions: IGridDimensions, isGiantFightLevel: boolean): void {
        this.scene = scene;
        this.create(parent, gridDimensions, true, isGiantFightLevel);
        this.create(parent, gridDimensions, false, isGiantFightLevel);
    }

    static create(parent: Phaser.GameObjects.Container, gridDimensions: IGridDimensions, isPlayer: boolean, isGiantFightLevel: boolean) {

        TestOpponentTeam.isGiantFightLevel = !isPlayer && isGiantFightLevel;
        console.log(TestOpponentTeam.isGiantFightLevel);

        const team = isPlayer ? TestPlayerTeam.team : TestOpponentTeam.team;
        this.mainGridContainer = parent;


        team.forEach((unit: IUnitData, index: number) => {
            console.log(unit);

            const gridPosition = this.scene.data.list.gridPositions[unit.row][unit.col];
            gridPosition.isEmpty = false;
            gridPosition.occupiedBy = isPlayer ? 'player' : 'opponent';

            let x = gridDimensions.cellSize * unit.col + gridDimensions.cellSize / 2;
            let y = gridDimensions.cellSize * unit.row + gridDimensions.cellSize / 2;
            let width = gridDimensions.cellSize - main_config.lineWidth;
            let height = gridDimensions.cellSize - main_config.lineWidth;
            if (unit.isGiant) {
                width *= 2;
                height *= 2;
                x = gridDimensions.cellSize * unit.col + gridDimensions.cellSize;
                y = gridDimensions.cellSize * unit.row + gridDimensions.cellSize;
                this.scene.data.list.gridPositions[unit.row][unit.col + 1].occupiedBy = 'opponent';
                this.scene.data.list.gridPositions[unit.row + 1][unit.col].occupiedBy = 'opponent';
                this.scene.data.list.gridPositions[unit.row + 1][unit.col + 1].occupiedBy = 'opponent';
                this.scene.data.list.gridPositions[unit.row][unit.col + 1].isEmpty = false;
                this.scene.data.list.gridPositions[unit.row + 1][unit.col].isEmpty = false;
                this.scene.data.list.gridPositions[unit.row + 1][unit.col + 1].isEmpty = false;
            }
            const monster = new Monster(this.scene, x, y, width, height, unit, index, isPlayer);
            if (unit.isGiant) {
                monster.starsContainer.x -= 55;
                monster.movesLeftContainer.x -= 80;
            }

            monster.on(GAME_SCENE_SCENE_EVENTS.MONSTER_DIED, (data: IUnitData) => {
                this.scene.data.list.gridPositions[data.row][data.col].isEmpty = true;
                delete this.scene.data.list.gridPositions[data.row][data.col].occupiedBy;
                delete this.scene.data.list.gridPositions[data.row][data.col].giantData;
                if (monster.isGiant) {
                    this.scene.data.list.gridPositions[data.row][data.col + 1].isEmpty = true;
                    this.scene.data.list.gridPositions[data.row + 1][data.col].isEmpty = true;
                    this.scene.data.list.gridPositions[data.row + 1][data.col + 1].isEmpty = true;

                    delete this.scene.data.list.gridPositions[data.row][data.col + 1].occupiedBy;
                    delete this.scene.data.list.gridPositions[data.row + 1][data.col].occupiedBy;
                    delete this.scene.data.list.gridPositions[data.row + 1][data.col + 1].occupiedBy;

                    delete this.scene.data.list.gridPositions[data.row][data.col + 1].giantData;
                    delete this.scene.data.list.gridPositions[data.row + 1][data.col].giantData;
                    delete this.scene.data.list.gridPositions[data.row + 1][data.col + 1].giantData;
                }
                if (isPlayer) {
                    this.scene.data.list.playerMonsters[index] = null;
                } else {
                    this.scene.data.list.opponentMonsters[index] = null;
                }
                this.scene.events.emit(GAME_SCENE_SCENE_EVENTS.MONSTER_DIED, [monster, data]);
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
