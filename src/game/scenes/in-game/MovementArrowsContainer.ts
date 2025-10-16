import { Scene } from 'phaser';
import { IUnitData } from '../Game';
import { DirectionArrow } from './DirectionArrow';
import { main_config } from '../../configs/main_config';

export class MovementArrowsContainer extends Phaser.GameObjects.Container {

    private neighborCells: INeighborCells[];
    private arrows: DirectionArrow[] = [];

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);
        this.scene = scene;
        this.scene.add.existing(this);
        this.setDepth(10);
    }

    createArrows(data: IUnitData): void {
        this.removeArrows();
        this.neighborCells = this.getNeighborCells(data.row, data.col, data.vision, data.ranged, data.magic);
        this.displayArrows(this.neighborCells); // TODO - check if enemy, do not add arrow but attack image
    }

    private getNeighborCells(row: number, col: number, radius: number, range: number, magic: number) {
        const isPlayerTurn = this.scene.data.list.isPlayerTurn;
        let neighborCells = [];
        const array = this.scene.data.list.gridPositions;
        const cloudsArray = this.scene.data.list.clouds;

        //temp - lower the movement to 1 cell at a time
        radius = 1;
        //-------------------------------------------
        const isRanged = range > 0;
        const isMagic = magic > 0;

        if (isRanged) {
            radius = main_config.rangedUnitsRange;
        }

        for (let y = -radius; y <= radius; y++) {
            for (let x = -radius; x <= radius; x++) {
                if (x === 0 && y === 0) continue;

                const newRow = row + y;
                const newCol = col + x;

                if (
                    newRow >= 0 && newRow < array.length &&
                    newCol >= 0 && newCol < array[0].length
                    && cloudsArray[newRow][newCol].alpha === 0
                ) {
                    if (array[newRow][newCol].isEmpty === true) {
                        const direction = this.getDirection(row, newRow, col, newCol)
                        neighborCells.push({ row: newRow, col: newCol, direction });
                    } else if (
                        (isPlayerTurn && array[newRow][newCol].occupiedBy === 'opponent') ||
                        (!isPlayerTurn && array[newRow][newCol].occupiedBy === 'player')
                    ) {
                        const direction = this.getDirection(row, newRow, col, newCol);
                        if (!isNaN(direction) || isRanged || isMagic) {
                            neighborCells.push({ row: newRow, col: newCol, direction, target: true, isRanged, isMagic });
                        }
                    }
                }
            }
        }
        neighborCells = neighborCells.filter(ns => ns.isRanged || !isNaN(ns.direction));
        console.log(neighborCells)
        return neighborCells;
    }

    getDirection(row: number, newRow: number, col: number, newCol: number): number {
        let direction = NaN;
        if (newRow === row - 1 && newCol === col) {
            direction = 0; // UP
        } else if (newRow === row - 1 && newCol === col + 1) {
            direction = 1; // UP RIGHT
        } else if (newRow === row && newCol === col + 1) {
            direction = 2; // RIGHT
        } else if (newRow === row + 1 && newCol === col + 1) {
            direction = 3; // DOWN RIGHT
        } else if (newRow === row + 1 && newCol === col) {
            direction = 4; // DOWN 
        } else if (newRow === row + 1 && newCol === col - 1) {
            direction = 5; // LEFT DOWN 
        } else if (newRow === row && newCol === col - 1) {
            direction = 6; // LEFT  
        } else if (newRow === row - 1 && newCol === col - 1) {
            direction = 7; // LEFT UP
        }

        return direction;
    }

    private getAngle(direction: number) {
        return direction * 45;
    }

    private displayArrows(emptyNeighborCells: INeighborCells[]): void {
        emptyNeighborCells.forEach((emptyCell: INeighborCells) => {
            const row = emptyCell.row;
            const col = emptyCell.col;
            const pos = this.scene.data.list.gridPositions[row][col];
            const angle = this.getAngle(emptyCell.direction);
            const target = emptyCell.target === true;
            const isRanged = emptyCell.isRanged
            const isMagic = emptyCell.isMagic
            let img = null;
            if (!target) {
                img = 'arrow';
            } else if (isRanged) {
                img = 'bow';
            } else if (isMagic) {
                img = 'ball';
            } else {
                img = 'sword';
            }
            const arrow = new DirectionArrow(this.scene, pos.x, pos.y, angle, row, col, img, target, isRanged);
            this.add(arrow);
            this.arrows.push(arrow);
        });
    }

    removeArrows() {
        this.arrows.forEach((arrow: DirectionArrow) => arrow.destroy(true));
        this.arrows = [];
    }
}

interface INeighborCells {
    row: number;
    col: number;
    direction: number;
    target?: boolean;
    isRanged?: boolean;
    isMagic?: boolean;
}
