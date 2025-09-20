import { Scene, GameObjects } from 'phaser';
import { Monster } from './in-game/Monster';
import { monsters_power_config } from '../configs/monsters_power_config';
import { IPlayerMonstersData } from './in-game/TestPlayerTeam';

const MONSTER_SIZE = 200;
const HORIZONTAL_DISTANCE = 65;
const MAIN_DECK_Y = 500;
const MONSTER_GAP = 80;
const MONSTER_INITIAL_X = 200;
const MAX_SELECTED_MONSTERS = 7;

export class CardSelection extends Scene {
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
        super('CardSelection');
    }

    create() {


        // this.input.once('pointerdown', () => {
        //     this.scene.start('Game');
        // });
        // return;

        this.monstersContainer = this.add.container();

        this.loadPlayerMonsters();
        this.createMonstersSlots();
        this.createMainDeckHitRect();
        this.createOkButton();

        this.initializeMonsters();
    }

    private loadPlayerMonsters() {

        const playerMonstersDataFromStorage = JSON.parse(localStorage.getItem('playerMonstersData') ?? "null", (key, value) => {
            return key === 'row' && value === null ? NaN : value;
        });
        this.playerMonstersData = playerMonstersDataFromStorage ||
            [
                {
                    type: 1, stars: 1, row: NaN, col: 1
                },
                {
                    type: 1, stars: 1, row: NaN, col: 1
                },
                {
                    type: 1, stars: 1, row: NaN, col: 1
                },
                {
                    type: 2, stars: 1, row: NaN, col: 1
                },
                {
                    type: 2, stars: 1, row: NaN, col: 1
                },
                {
                    type: 2, stars: 1, row: NaN, col: 1
                },
                {
                    type: 5, stars: 1, row: NaN, col: 1
                },
                {
                    type: 5, stars: 1, row: NaN, col: 11
                },
                {
                    type: 5, stars: 1, row: NaN, col: 11
                },
                {
                    type: 7, stars: 1, row: NaN, col: 11
                },
                {
                    type: 7, stars: 1, row: NaN, col: 11
                },
                {
                    type: 7, stars: 1, row: NaN, col: 11
                },
                {
                    type: 8, stars: 1, row: NaN, col: 11
                },
                {
                    type: 8, stars: 1, row: NaN, col: 11
                },
                {
                    type: 8, stars: 1, row: NaN, col: 11
                },
                {
                    type: 9, stars: 1, row: NaN, col: 11
                },
                {
                    type: 9, stars: 1, row: NaN, col: 11
                },
                {
                    type: 9, stars: 1, row: NaN, col: 11
                },
            ]

        this.playerMonstersData.sort((a, b) => {
            if (+a.type < +b.type) return -1;
            if (+a.type > +b.type) return 1;
            return 0;
        })

        console.log(`${playerMonstersDataFromStorage} - from local storage`);
    }

    private initializeMonsters() {
        this.playerMonstersData.forEach((monsterData, index) => {
            const config = { ...(monsters_power_config as any)[monsterData.type][monsterData.stars - 1] };


            if (isNaN(monsterData.row)) {
                const x = MONSTER_INITIAL_X + index * MONSTER_GAP;
                const y = MAIN_DECK_Y;
                const monster = new Monster(this, x, y, MONSTER_SIZE, MONSTER_SIZE, config, 0, true);

                monster.originalIndex = index;
                monster.starsContainer.x = MONSTER_SIZE / -4 + 10;
                monster.movesLeftContainer.x = MONSTER_SIZE / 2 + 10;
                monster.bg.setInteractive({ draggable: true });

                monster.startX = x;
                monster.startY = y;

                this.setupMonsterInteractions(monster, index);
                this.setupMonsterDrag(monster, index);

                this.monstersContainer.add(monster);
            } else {

                const x = this.hitRects[monsterData.row].x + MONSTER_SIZE / 2;
                const y = this.hitRects[monsterData.row].y + MONSTER_SIZE / 2;

                const monster = new Monster(this, x, y, MONSTER_SIZE, MONSTER_SIZE, config, 0, true);
                this.selectedMonsters[monsterData.row] = monster;

                monster.originalIndex = index;
                monster.starsContainer.x = MONSTER_SIZE / -4 + 10;
                monster.movesLeftContainer.x = MONSTER_SIZE / 2 + 10;
                monster.bg.setInteractive({ draggable: true });

                monster.startX = x;
                monster.startY = y;

                this.setupMonsterInteractions(monster, index);
                this.setupMonsterDrag(monster, index);

                this.monstersContainer.add(monster);

                monster.positionIndex = monsterData.row;
            }
        });
        this.reposition();
    }

    private setupMonsterInteractions(monster: Monster, index: number) {
        monster.bg.on('pointerover', () => {
            this.tweens.add({ targets: monster, scale: 1.1, duration: 150 });
            this.monstersContainer.bringToTop(monster);
        });

        monster.bg.on('pointerout', () => {
            this.tweens.add({ targets: monster, scale: 1, duration: 150 });
            this.monstersContainer.moveTo(monster, index);
        });
    }

    private setupMonsterDrag(monster: Monster, index: number) {
        monster.bg.on('dragstart', () => {
            // Optional: Add drag start visual feedback
        });

        monster.bg.on('drag', (pointer: Phaser.Input.Pointer) => {
            monster.x = pointer.x;
            monster.y = pointer.y;
        });

        monster.bg.on('dragend', (pointer: Phaser.Input.Pointer) => {
            this.handleMonsterDrop(monster, pointer, index);
        });
    }

    private handleMonsterDrop(monster: Monster, pointer: Phaser.Input.Pointer, index: number) {

        if (this.mainDeckHitRect.contains(pointer.x, pointer.y)) {

            this.selectedMonsters[monster.positionIndex] = null;
            monster.positionIndex = NaN;
            this.playerMonstersData[monster.originalIndex].row = NaN;
            this.monstersContainer.moveTo(monster, index);
            this.reposition();
            return
        }

        let droppedInSlot = false;

        for (let i = 0; i < this.hitRects.length; i++) {
            const hitRect = this.hitRects[i];

            if (hitRect.contains(pointer.x, pointer.y)) {
                droppedInSlot = true;

                const hasOldPosition = !isNaN(monster.positionIndex);
                const existingMonster = this.selectedMonsters[i];

                if (hasOldPosition) {
                    this.selectedMonsters[monster.positionIndex] = null;
                }

                if (existingMonster) {
                    // Handle swapping
                    if (hasOldPosition) {
                        this.selectedMonsters[monster.positionIndex] = existingMonster;
                        this.animateMonsterReturn(existingMonster, monster.startX, monster.startY);
                        existingMonster.startX = monster.startX;
                        existingMonster.startY = monster.startY;
                        existingMonster.positionIndex = monster.positionIndex;
                        this.playerMonstersData[existingMonster.originalIndex].row = monster.positionIndex;
                    } else {
                        this.selectedMonsters[i] = existingMonster;
                        this.animateMonsterReturn(existingMonster, monster.startX, monster.startY);
                        existingMonster.positionIndex = NaN;
                        existingMonster.startX = monster.startX;
                        existingMonster.startY = monster.startY;
                        this.playerMonstersData[existingMonster.originalIndex].row = NaN;
                    }
                }

                // Place dragged monster into the new slot
                monster.setPosition(hitRect.x + hitRect.width / 2, hitRect.y + hitRect.height / 2);
                monster.startX = monster.x;
                monster.startY = monster.y;
                monster.positionIndex = i;
                this.playerMonstersData[monster.originalIndex].row = i;
                this.selectedMonsters[i] = monster;

                this.reposition();
                break;
            }
        }

        if (!droppedInSlot) {
            monster.setPosition(monster.startX, monster.startY);
        }
    }

    private animateMonsterReturn(monster: Monster, x: number, y: number) {
        this.tweens.add({
            targets: monster,
            x: x,
            y: y,
            duration: 150
        });
    }

    private createMonstersSlots() {
        for (let index = 0; index < MAX_SELECTED_MONSTERS; index++) {
            const hitRect = new Phaser.Geom.Rectangle(HORIZONTAL_DISTANCE + (HORIZONTAL_DISTANCE + MONSTER_SIZE) * index, 100, MONSTER_SIZE, MONSTER_SIZE);
            const graphics = this.add.graphics();
            graphics.lineStyle(2, 0xffffff);
            graphics.strokeRectShape(hitRect);
            this.hitRects.push(hitRect);
        }
    }

    private createMainDeckHitRect() {
        this.mainDeckHitRect = new Phaser.Geom.Rectangle(65, MAIN_DECK_Y - MONSTER_SIZE / 2, 1790, 200);
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffffff);
        graphics.strokeRectShape(this.mainDeckHitRect);
    }

    private reposition() {
        const monsters = this.monstersContainer.list.filter((x: any) => isNaN(x.positionIndex))
        console.log(monsters)

        monsters.forEach((element: any, index) => {
            const finalX = MONSTER_INITIAL_X + index * MONSTER_GAP;
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

    private createOkButton() {
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

    private save() {
        console.table(this.playerMonstersData);
        localStorage.setItem('playerMonstersData', JSON.stringify(this.playerMonstersData));
        this.scene.start('MainMenu');
    }
}
