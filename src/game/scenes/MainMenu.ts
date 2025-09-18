import { Scene, GameObjects } from 'phaser';
import { Monster } from './in-game/Monster';
import { monsters_power_config } from '../configs/monsters_power_config';
import { IPlayerMonstersData } from './in-game/TestPlayerTeam';

const MONSTER_SIZE = 200;
const HORIZONTAL_DISTANCE = 65;
const MAIN_DECK_Y = 500;

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    monstersContainer: GameObjects.Container;
    hitRects: Phaser.Geom.Rectangle[] = [];
    selectedMonsters: Monster[] | null[] = [null, null, null, null, null, null, null];
    mainDeckHitRect: Phaser.Geom.Rectangle;
    okButton: GameObjects.Image;
    playerMonstersData: IPlayerMonstersData[];

    constructor() {
        super('MainMenu');
    }

    create() {

        // this.input.once('pointerdown', () => {
        //     this.scene.start('Game');
        // });
        // return;

        this.playerMonstersData = [
            {
                type: 5, stars: 1, row: NaN, col: 11
            },
            {
                type: 2, stars: 1, row: NaN, col: 11
            },
            {
                type: 7, stars: 1, row: NaN, col: 11
            },
            {
                type: 1, stars: 1, row: NaN, col: 11
            },
            {
                type: 8, stars: 1, row: NaN, col: 11
            },
            {
                type: 9, stars: 1, row: NaN, col: 11
            },
            {
                type: 8, stars: 1, row: NaN, col: 11
            },
            {
                type: 2, stars: 1, row: NaN, col: 11
            },
            {
                type: 5, stars: 1, row: NaN, col: 11
            },
        ]

        this.monstersContainer = this.add.container();


        this.playerMonstersData.sort((a, b) => {
            if (a.type < b.type) return -1;
            if (a.type > b.type) return 1;
            return 0;
        })

        this.playerMonstersData.forEach((monstersData: IPlayerMonstersData, index: number) => {
            let data = { ...(monsters_power_config as any)[monstersData.type][monstersData.stars - 1] };

            let monster = new Monster(this, 200 + index * 80, MAIN_DECK_Y, MONSTER_SIZE, MONSTER_SIZE, data, 0, true);
            monster.originalIndex = index;
            monster.starsContainer.x = MONSTER_SIZE / -4 + 10;
            monster.movesLeftContainer.x = MONSTER_SIZE / 2 + 10;
            monster.bg.setInteractive({ draggable: true });
            this.monstersContainer.add(monster);

            monster.startX = monster.x;
            monster.startY = monster.y;

            monster.bg.on('pointerover', () => {
                this.tweens.add({
                    targets: monster,
                    scale: 1.1,
                    duration: 150,
                })
                this.monstersContainer.bringToTop(monster);
            });
            monster.bg.on('pointerout', () => {
                this.tweens.add({
                    targets: monster,
                    scale: 1,
                    duration: 150,
                })
                this.monstersContainer.moveTo(monster, index);
            });

            monster.bg.on('dragstart', function (pointer: any) {

            }, this);

            monster.bg.on('drag', (pointer: any) => {
                monster.x = pointer.x;
                monster.y = pointer.y;
            });

            monster.bg.on('dragend', (pointer: any) => {

                if (this.mainDeckHitRect.contains(pointer.x, pointer.y)) {

                    this.selectedMonsters[monster.positionIndex] = null;
                    monster.positionIndex = NaN;
                    this.playerMonstersData[monster.originalIndex].row = NaN;
                    this.monstersContainer.moveTo(monster, index);
                    this.reposition();
                    return
                }


                for (let hitRectsIndex = 0; hitRectsIndex < this.hitRects.length; hitRectsIndex++) {
                    const hitRect = this.hitRects[hitRectsIndex]
                    if (hitRect.contains(pointer.x, pointer.y)) {
                        const hasOldPositionIndex = !isNaN(monster.positionIndex);
                        const monsterOnThisPosition: Monster | null = this.selectedMonsters[hitRectsIndex];

                        if (hasOldPositionIndex) {
                            this.selectedMonsters[monster.positionIndex] = null;
                        }

                        if (monsterOnThisPosition) {
                            //move old monster to the initial position of the new monster
                            if (hasOldPositionIndex) {
                                //swapping 2 monsters from the starting ones
                                this.selectedMonsters[monster.positionIndex] = monsterOnThisPosition;
                                this.tweens.add({
                                    targets: this.selectedMonsters[monster.positionIndex],
                                    x: monster.startX,
                                    y: monster.startY,
                                    duration: 150
                                })
                                this.selectedMonsters[monster.positionIndex]!.startX = monster.startX;
                                this.selectedMonsters[monster.positionIndex]!.startY = monster.startY;
                                this.selectedMonsters[monster.positionIndex]!.positionIndex = monster.positionIndex;
                                this.playerMonstersData[monsterOnThisPosition.originalIndex].row = monster.positionIndex

                            }
                            else {
                                //swapping monster from the desk with one from the selected
                                this.selectedMonsters[hitRectsIndex] = monsterOnThisPosition;
                                this.selectedMonsters[hitRectsIndex]!.startX = monster.startX;
                                this.selectedMonsters[hitRectsIndex]!.startY = monster.startY;
                                this.playerMonstersData[this.selectedMonsters[monsterOnThisPosition.positionIndex]!.originalIndex].row = monster.positionIndex
                                this.selectedMonsters[hitRectsIndex]!.positionIndex = NaN;
                            }
                        }

                        if (this.selectedMonsters[hitRectsIndex]) {
                            this.playerMonstersData[monster.originalIndex].row = hitRectsIndex;
                            this.selectedMonsters[hitRectsIndex] = monster;
                        } else {
                            this.selectedMonsters[hitRectsIndex] = monster;
                            this.playerMonstersData[monster.originalIndex].row = hitRectsIndex;
                        }

                        monster.setPosition(hitRect.x + hitRect.width / 2, hitRect.y + hitRect.height / 2);
                        monster.startX = hitRect.x + hitRect.width / 2;
                        monster.startY = hitRect.y + hitRect.height / 2;

                        monster.positionIndex = hitRectsIndex;
                        this.reposition();
                        break;
                    } else {
                        monster.setPosition(monster.startX, monster.startY);
                    }
                }
            });
        });

        this.createMonstersSlots();
        this.createMainDeckHitRect();
        this.createOkButton();
    }




    loadPlayerMonsters() {

    }

    initializeMonsters() {

    }

    setupMonsterInteractions(monster, index) {

    }

    setupMonsterDrag(monster) {

    }

    handleMonsterDrop(monster, pointer) {

    }




    createMonstersSlots() {
        for (let index = 0; index < 7; index++) {
            const hitRect = new Phaser.Geom.Rectangle(HORIZONTAL_DISTANCE + (HORIZONTAL_DISTANCE + MONSTER_SIZE) * index, 100, MONSTER_SIZE, MONSTER_SIZE);
            const graphics = this.add.graphics();
            graphics.lineStyle(2, 0xffffff);
            graphics.strokeRectShape(hitRect);
            this.hitRects.push(hitRect);
        }
    }

    createMainDeckHitRect() {
        this.mainDeckHitRect = new Phaser.Geom.Rectangle(65, MAIN_DECK_Y - MONSTER_SIZE / 2, 1790, 200);
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffffff);
        graphics.strokeRectShape(this.mainDeckHitRect);
    }

    reposition() {
        const monsters = this.monstersContainer.list.filter((x: any) => isNaN(x.positionIndex))
        console.log(monsters)


        monsters.forEach((element: any, index) => {
            const finalX = 200 + index * 80;
            this.tweens.add({
                targets: element,
                x: finalX,
                y: MAIN_DECK_Y,
                duration: 150
            })
            element.startX = finalX;
            element.startY = MAIN_DECK_Y;
        });

    }

    createOkButton() {
        this.okButton = this.add.image(1800, 950, 'ok-btn').setScale(1).setOrigin(0.5).setInteractive();
        this.okButton.on('pointerover', () => {
            this.tweens.add({
                targets: this.okButton,
                scale: 1.1,
                duration: 150,
            })
        });
        this.okButton.on('pointerout', () => {
            this.tweens.add({
                targets: this.okButton,
                scale: 1,
                duration: 150,
            })
        });
        this.okButton.on('pointerdown', () => {
            this.save();
        });
    }

    save() {

        console.table(this.playerMonstersData);
        // this.data.list.playerMonstersData.push({
        //     type: monster.unitData.type,
        //     stars: monster.unitData.stars,
        //     row: index,
        //     col: 11
        // })

        // console.log(this.data.list.playerMonstersData);
    }
}
