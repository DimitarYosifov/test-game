import { Scene, GameObjects } from 'phaser';
import { Monster } from './in-game/Monster';
import { monsters_power_config } from '../configs/monsters_power_config';
import { IPlayerMonstersData } from './in-game/TestPlayerTeam';

const MONSTER_SIZE = 200;
const HORIZONTAL_DISTANCE = 65;

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    monstersContainer: GameObjects.Container;
    hitRects: Phaser.Geom.Rectangle[] = [];
    selectedMonsters: Monster[] | null[] = [null, null, null, null, null, null, null];

    constructor() {
        super('MainMenu');
    }

    create() {

        this.input.once('pointerdown', () => {
            this.scene.start('Game');
        });
        return;

        const playerMonstersData: IPlayerMonstersData[] = [
            {
                type: 5, stars: 1, row: 1, col: 11
            },
            {
                type: 2, stars: 1, row: 5, col: 11
            },
            {
                type: 7, stars: 1, row: 0, col: 11
            },
            {
                type: 1, stars: 1, row: 6, col: 11
            },
            {
                type: 8, stars: 1, row: 2, col: 11
            },
            {
                type: 9, stars: 1, row: 3, col: 11
            },
            {
                type: 8, stars: 1, row: 4, col: 11
            },
        ]

        this.monstersContainer = this.add.container();


        playerMonstersData.sort((a, b) => {
            if (a.type < b.type) return -1;
            if (a.type > b.type) return 1;
            return 0;
        })

        playerMonstersData.forEach((monstersData: IPlayerMonstersData, index: number) => {
            let data = { ...(monsters_power_config as any)[monstersData.type][monstersData.stars - 1] };

            let monster = new Monster(this, 200 + index * 80, 600, MONSTER_SIZE, MONSTER_SIZE, data, 0, true);
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

                for (let hitRectsIndex = 0; hitRectsIndex < this.hitRects.length; hitRectsIndex++) {
                    const hitRect = this.hitRects[hitRectsIndex]
                    if (hitRect.contains(pointer.x, pointer.y)) {
                        const oldPositionIndex = !isNaN(monster.positionIndex);
                        const monsterOnThisPosition: Monster | null = this.selectedMonsters[hitRectsIndex];

                        if (oldPositionIndex) {
                            this.selectedMonsters[monster.positionIndex] = null;
                        }

                        if (monsterOnThisPosition) {
                            //move old monster to the initial position of the new monster
                            if (oldPositionIndex) {
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
                            }
                            else {
                                //swapping monster from the desk with one from the selected
                                this.selectedMonsters[hitRectsIndex] = monsterOnThisPosition;
                                this.selectedMonsters[hitRectsIndex]!.startX = monster.startX;
                                this.selectedMonsters[hitRectsIndex]!.startY = monster.startY;
                                this.selectedMonsters[hitRectsIndex]!.positionIndex = NaN;
                            }
                        }

                        this.selectedMonsters[hitRectsIndex] = monster;

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

    reposition() {
        const monsters = this.monstersContainer.list.filter((x: any) => isNaN(x.positionIndex))
        console.log(monsters)


        monsters.forEach((element: any, index) => {
            const finalX = 200 + index * 80;
            this.tweens.add({
                targets: element,
                x: finalX,
                y: 600,
                duration: 150
            })
            element.startX = finalX;
        });

    }

    save() {
        // this.data.list.playerMonstersData.push({
        //     type: monster.unitData.type,
        //     stars: monster.unitData.stars,
        //     row: index,
        //     col: 11
        // })

        // console.log(this.data.list.playerMonstersData);
    }
}
