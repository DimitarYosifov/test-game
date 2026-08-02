import { Scene } from 'phaser';
import { IUnitData } from '../Game';
import { DirectionArrow } from './DirectionArrow';
import { GAME_OBJECT_DEPTHS, getMonsterAtSpot, main_config } from '../../configs/main_config';
import { Monster } from './Monster';

export class MovementArrowsContainer extends Phaser.GameObjects.Container {

    private neighborCells: INeighborCells[];
    private arrows: DirectionArrow[] = [];
    private potentialDamageTexts: Phaser.GameObjects.Text[] = [];
    private potentialDamageTextTweens: Phaser.Tweens.Tween[] = [];
    additionalPotentialDamage: number = 0;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);
        this.scene = scene;
        this.scene.add.existing(this);
        this.setDepth(GAME_OBJECT_DEPTHS.movementArrowsContainer);
    }

    createArrows(data: IUnitData): void {
        this.removeArrows();
        this.neighborCells = this.getNeighborCells(data.row, data.col, data.vision, data.ranged, data.magic);
        this.displayArrows(this.neighborCells, data); // TODO - check if enemy, do not add arrow but attack image
    }

    getNeighborCells(row: number, col: number, radius: number, range: number, magic: number) {
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
                let isTargetMagicMonster = false;

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

                        if (isPlayerTurn && array[newRow][newCol].occupiedBy === 'opponent') {
                            const monster = this.scene.data.list.opponentMonsters.find((m: Monster) => m && m.unitData.row === newRow && m.unitData.col === newCol);
                            if (monster.unitData.magic > 0) {
                                isTargetMagicMonster = true;
                            }
                        } else if (!isPlayerTurn && array[newRow][newCol].occupiedBy === 'player') {
                            const monster = this.scene.data.list.playerMonsters.find((m: Monster) => m && m.unitData.row === newRow && m.unitData.col === newCol);
                            if (monster.unitData.magic > 0) {
                                isTargetMagicMonster = true;
                            }
                        }

                        const direction = this.getDirection(row, newRow, col, newCol);
                        if (!isNaN(direction) || isRanged || isMagic) {
                            neighborCells.push({ row: newRow, col: newCol, direction, target: true, isRanged, isMagic, isTargetMagicMonster });
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

    private displayArrows(emptyNeighborCells: INeighborCells[], data: IUnitData): void {

        const atackingMonster = this.scene.data.list.playerMonsters.find((m: Monster) => m && m.unitData.row === data.row && m.unitData.col === data.col);
        this.additionalPotentialDamage = 0;
      
        if (+data.type === 3) {
            // monster N3 special skill
            this.additionalPotentialDamage = emptyNeighborCells.filter(enc => enc.isTargetMagicMonster).length;
        }
        else if (+data.type === 6) {
            // monster N6 special skill
            this.additionalPotentialDamage = atackingMonster.additionalRangedDamage;
        }

        emptyNeighborCells.forEach((emptyCell: INeighborCells) => {
            let row = emptyCell.row;
            let col = emptyCell.col;
            let position_x = this.scene.data.list.gridPositions[row][col].x;
            let position_y = this.scene.data.list.gridPositions[row][col].y;
            let angle = this.getAngle(emptyCell.direction);
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

            const giantData = this.scene.data.list.gridPositions[row][col].giantData;

            if (giantData) {
                // attackingMonster should be set here because row and col are changed below
                row = giantData.row;
                col = giantData.col;
                const mainGiantPosition = this.scene.data.list.opponentMonsters.find((m: Monster) => m && m.unitData.row === row && m.unitData.col === col);
                position_x = mainGiantPosition.x;
                position_y = mainGiantPosition.y;
                angle = Phaser.Math.Angle.Between(
                    mainGiantPosition.x,
                    mainGiantPosition.y,
                    atackingMonster.x,
                    atackingMonster.y
                )
            } else {
                angle = Phaser.Math.Angle.Between(
                    position_x,
                    position_y,
                    atackingMonster.x,
                    atackingMonster.y
                )
            }
            angle = Phaser.Math.RadToDeg(angle) - 90;

            let potentialDamage = NaN;

            const arrow = new DirectionArrow(this.scene, position_x, position_y, angle, row, col, img, target, isRanged, this);
            this.add(arrow);
            this.arrows.push(arrow);

            if (target) {
                potentialDamage = this.getPotentialDamageForSpot(atackingMonster, row, col, isRanged, isMagic, this.additionalPotentialDamage);
                this.showPotentialDamage(position_x, position_y, potentialDamage);
            }
        });
    }

    getPotentialDamageForSpot(atackingMonster: Monster, row: number, col: number, isRanged: boolean, isMagic: boolean, additionalPotentialDamage: number): number {

        const targetMonster = getMonsterAtSpot(row, col, this.scene.data.list.playerMonsters, this.scene.data.list.opponentMonsters);
        let potentialDamage = 0;

        if (isRanged) {
            potentialDamage = atackingMonster.unitData.ranged - targetMonster.unitData.shield + additionalPotentialDamage;
        } else if (isMagic) {
            potentialDamage = atackingMonster.unitData.magic + additionalPotentialDamage;
        } else {
            potentialDamage = atackingMonster.unitData.melee - targetMonster.unitData.shield + additionalPotentialDamage;
        }

        return potentialDamage > targetMonster.unitData.health ? targetMonster.unitData.health : potentialDamage;
    }

    private showPotentialDamage(x: number, y: number, potentialDamage: number) {
        const scene = this.scene;

        const potentialDamageText = scene.add.text(
            x,
            y,
            `${potentialDamage}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 40, color: '#6fa8fd',
                stroke: '#000000', letterSpacing: 4, strokeThickness: 3,
                align: 'center'
            }).setOrigin(0.5);

        this.add(potentialDamageText);
        this.potentialDamageTexts.push(potentialDamageText);

        const potentialDamageTextTween = this.scene.tweens.add({
            targets: potentialDamageText,
            scale: potentialDamageText.scale * 1.2,
            duration: 350,
            yoyo: true,
            repeat: -1
        })
        this.potentialDamageTextTweens.push(potentialDamageTextTween);
    }

    removeArrows() {
        this.arrows.forEach((arrow: DirectionArrow) => arrow.destroy(true));
        this.arrows = [];
        this.potentialDamageTexts.forEach((potentialDamageText: Phaser.GameObjects.Text) => potentialDamageText.destroy(true));
        this.potentialDamageTexts = [];
        this.potentialDamageTextTweens.forEach((potentialDamageTween: Phaser.Tweens.Tween) => potentialDamageTween.remove());
        this.potentialDamageTextTweens = [];
    }
}

interface INeighborCells {
    row: number;
    col: number;
    direction: number;
    target?: boolean;
    isRanged?: boolean;
    isMagic?: boolean;
    isTargetMagicMonster?: boolean;
}
