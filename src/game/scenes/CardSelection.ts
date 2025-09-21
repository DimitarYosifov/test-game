import { Scene, GameObjects } from 'phaser';
import { Monster } from './in-game/Monster';
import { monsters_power_config } from '../configs/monsters_power_config';
import { IPlayerMonstersData } from './in-game/TestPlayerTeam';
import { Button } from './in-main-menu/Button';

const MONSTER_SIZE = 200;
const HORIZONTAL_DISTANCE = 65;
const MAIN_DECK_Y = 440;
const MONSTER_GAP = 80;
const MONSTER_INITIAL_X = 165;
const MAX_SELECTED_MONSTERS = 7;
const MONSTERS_NEEDED_FOR_UPGRADE = 3;
const MAIN_DECK_WIDTH = 1790;
const MAIN_DECK_HEIGHT = 450;
const MAX_MONSTERS_0N_ROW = 20;

export class CardSelection extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    monstersContainer: GameObjects.Container;
    hitRects: Phaser.Geom.Rectangle[] = [];
    upgradeHitRects: Phaser.Geom.Rectangle[] = [];
    selectedMonsters: Monster[] | null[] = [null, null, null, null, null, null, null];
    upgradeSelectedMonsters: Monster[] | null[] = [null, null, null];
    mainDeckHitRect: Phaser.Geom.Rectangle;
    okButton: GameObjects.Image;
    playerMonstersData: IPlayerMonstersData[];
    upgradeCostText: GameObjects.Text;
    upgradeCost: number = 0;
    sellFor: number = 0;
    upgradeButton: GameObjects.Image;
    sellHitRect: Phaser.Geom.Rectangle;
    sellButton: Button;
    monsterAddedForSale: Monster | null;

    constructor() {
        super('CardSelection');
    }

    create() {

        // this.input.once('pointerdown', () => {
        //     this.scene.start('Game');
        // });
        // return;

        this.monstersContainer = this.add.container().setDepth(100);

        this.loadPlayerMonsters();
        this.createMonstersSlots();
        this.createMainDeckHitRect();
        this.createUpgradeSlots();
        this.createSellCardSlot();
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
                    type: 1, stars: 1, row: NaN, col: 11
                },
                {
                    type: 1, stars: 1, row: NaN, col: 11
                },
                {
                    type: 1, stars: 1, row: NaN, col: 11
                },
                {
                    type: 2, stars: 1, row: NaN, col: 11
                },
                {
                    type: 2, stars: 1, row: NaN, col: 11
                },
                {
                    type: 2, stars: 1, row: NaN, col: 11
                },
                {
                    type: 5, stars: 1, row: NaN, col: 11
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
                }, {
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

        this.sortMonsters();
        console.log(`${playerMonstersDataFromStorage} - from local storage`);
    }

    private sortMonsters() {
        this.playerMonstersData.sort((a, b) => {
            if (+a.type < +b.type) return -1;
            if (+a.type > +b.type) return 1;
            return 0;
        })
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
            this.monstersContainer.moveTo(monster, monster.originalIndex);
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

        // dropped in main deck
        if (this.mainDeckHitRect.contains(pointer.x, pointer.y)) {
            if (!isNaN(monster.positionIndex)) {
                this.selectedMonsters[monster.positionIndex] = null;
                monster.positionIndex = NaN;
                this.playerMonstersData[monster.originalIndex].row = NaN;
            } else if (!isNaN(monster.upgradePostionIndex)) {
                this.upgradeSelectedMonsters[monster.upgradePostionIndex] = null;
                monster.upgradePostionIndex = NaN;
            } else if (monster.addedForSale) {
                monster.addedForSale = false;
                this.monsterAddedForSale = null;
            }

            this.monstersContainer.moveTo(monster, monster.originalIndex);
            this.reposition();
            this.checkUpgradeButtonEnable();
            return
        }

        let droppedInSlot = false;
        let droppedInUpgradeSlot = false;
        let droppedInSellSlot = false;


        //region check dropped in sell section
        if (this.sellHitRect.contains(pointer.x, pointer.y)) {

            droppedInSellSlot = true;

            const hasOldSelectedPosition = !isNaN(monster.positionIndex);//old position was from selected monsters
            const hasOldUpgradePosition = !isNaN(monster.upgradePostionIndex);//old position was from upgrade monsters
            const hasOldSellPosition = monster.addedForSale;//old position was from sell section
            const existingMonster = this.monsterAddedForSale;// has monster on the current drop spot

            if (hasOldSelectedPosition) {
                this.selectedMonsters[monster.positionIndex] = null;
            } else if (hasOldUpgradePosition) {
                this.upgradeSelectedMonsters[monster.upgradePostionIndex] = null;
            } else if (hasOldSellPosition) {
                monster.addedForSale = false;
                this.monsterAddedForSale = null;
            }

            if (existingMonster) {
                // Handle swapping
                if (hasOldSelectedPosition) {
                    // this.monsterAddedForSale!.addedForSale = false;

                    this.selectedMonsters[monster.positionIndex] = existingMonster;
                    this.animateMonsterReturn(existingMonster, monster.startX, monster.startY);
                    existingMonster.startX = monster.startX;
                    existingMonster.startY = monster.startY;
                    existingMonster.positionIndex = monster.positionIndex;
                    existingMonster.upgradePostionIndex = NaN;
                    // this.monsterAddedForSale = null;
                    existingMonster.addedForSale = false;

                    this.playerMonstersData[existingMonster.originalIndex].row = monster.positionIndex;
                }
                else if (hasOldUpgradePosition) {
                    // this.monsterAddedForSale!.addedForSale = false;

                    this.upgradeSelectedMonsters[monster.upgradePostionIndex] = existingMonster;
                    this.animateMonsterReturn(existingMonster, monster.startX, monster.startY);
                    existingMonster.startX = monster.startX;
                    existingMonster.startY = monster.startY;
                    // this.monsterAddedForSale = null;
                    existingMonster.addedForSale = false;
                    existingMonster.upgradePostionIndex = monster.upgradePostionIndex;
                    existingMonster.positionIndex = NaN;
                } else if (hasOldSellPosition) {
                    this.monsterAddedForSale = existingMonster;
                    existingMonster.addedForSale = true;
                    this.animateMonsterReturn(existingMonster, monster.startX, monster.startY);
                    existingMonster.startX = monster.startX;
                    existingMonster.startY = monster.startY;
                    existingMonster.upgradePostionIndex = NaN;
                    existingMonster.positionIndex = NaN;
                } else {
                    // this.upgradeSelectedMonsters[i] = existingMonster;
                    this.animateMonsterReturn(existingMonster, monster.startX, monster.startY);
                    existingMonster.positionIndex = NaN;
                    existingMonster.upgradePostionIndex = NaN;
                    existingMonster.addedForSale = false;
                    existingMonster.startX = monster.startX;
                    existingMonster.startY = monster.startY;
                    this.playerMonstersData[existingMonster.originalIndex].row = NaN;
                }
            }

            // Place dragged monster into the new slot
            monster.setPosition(this.sellHitRect.x + this.sellHitRect.width / 2, this.sellHitRect.y + this.sellHitRect.height / 2);
            monster.startX = monster.x;
            monster.startY = monster.y;

            monster.positionIndex = NaN;
            monster.upgradePostionIndex = NaN;
            monster.addedForSale = true;
            this.monsterAddedForSale = monster;

            // this.upgradeSelectedMonsters[i] = monster;
            this.reposition();
            // this.checkUpgradeButtonEnable();
            // break;
        }
        if (droppedInSellSlot) {
            return;
        }
        //end region

        //region check dropped in upgrade section
        for (let i = 0; i < this.upgradeHitRects.length; i++) {
            const hitRect = this.upgradeHitRects[i];

            if (hitRect.contains(pointer.x, pointer.y)) {

                droppedInUpgradeSlot = true;

                const hasOldSelectedPosition = !isNaN(monster.positionIndex);//old position was from selected monsters
                const hasOldUpgradePosition = !isNaN(monster.upgradePostionIndex);//old position was from upgrade monsters
                const hasOldSellPosition = monster.addedForSale;//old position was from sell section
                const existingMonster = this.upgradeSelectedMonsters[i];// has monster on the current drop spot

                if (hasOldSelectedPosition) {
                    this.selectedMonsters[monster.positionIndex] = null;
                } else if (hasOldUpgradePosition) {
                    this.upgradeSelectedMonsters[monster.upgradePostionIndex] = null;
                } else if (hasOldSellPosition) {
                    monster.addedForSale = false;
                    this.monsterAddedForSale = null;
                }

                if (existingMonster) {
                    // Handle swapping
                    if (hasOldSelectedPosition) {
                        // this.monsterAddedForSale!.addedForSale = false;
                        // this.monsterAddedForSale = null;
                        existingMonster.addedForSale = false;
                        this.selectedMonsters[monster.positionIndex] = existingMonster;
                        this.animateMonsterReturn(existingMonster, monster.startX, monster.startY);
                        existingMonster.startX = monster.startX;
                        existingMonster.startY = monster.startY;
                        existingMonster.positionIndex = monster.positionIndex;
                        existingMonster.upgradePostionIndex = NaN;

                        this.playerMonstersData[existingMonster.originalIndex].row = monster.positionIndex;
                    }
                    else if (hasOldUpgradePosition) {
                        // this.monsterAddedForSale!.addedForSale = false;
                        // this.monsterAddedForSale = null;
                        existingMonster.addedForSale = false;

                        this.upgradeSelectedMonsters[monster.upgradePostionIndex] = existingMonster;
                        this.animateMonsterReturn(existingMonster, monster.startX, monster.startY);
                        existingMonster.startX = monster.startX;
                        existingMonster.startY = monster.startY;
                        existingMonster.upgradePostionIndex = monster.upgradePostionIndex;
                        existingMonster.positionIndex = NaN;
                    } else if (hasOldSellPosition) {
                        this.monsterAddedForSale = existingMonster;
                        existingMonster.addedForSale = true;
                        this.animateMonsterReturn(existingMonster, monster.startX, monster.startY);
                        existingMonster.startX = monster.startX;
                        existingMonster.startY = monster.startY;
                        existingMonster.upgradePostionIndex = NaN;
                        existingMonster.positionIndex = NaN;
                    } else {
                        this.upgradeSelectedMonsters[i] = existingMonster;
                        this.animateMonsterReturn(existingMonster, monster.startX, monster.startY);
                        existingMonster.positionIndex = NaN;
                        existingMonster.upgradePostionIndex = NaN;
                        existingMonster.startX = monster.startX;
                        existingMonster.startY = monster.startY;
                        this.playerMonstersData[existingMonster.originalIndex].row = NaN;
                    }
                }

                // Place dragged monster into the new slot
                monster.setPosition(hitRect.x + hitRect.width / 2, hitRect.y + hitRect.height / 2);
                monster.startX = monster.x;
                monster.startY = monster.y;

                monster.addedForSale = false;
                monster.positionIndex = NaN;
                monster.upgradePostionIndex = i;


                this.upgradeSelectedMonsters[i] = monster;
                this.reposition();
                this.checkUpgradeButtonEnable();
                break;
            }
        }
        if (droppedInUpgradeSlot) {
            return;
        }
        //end region

        //region check dropped in selected section
        for (let i = 0; i < this.hitRects.length; i++) {
            const hitRect = this.hitRects[i];

            if (hitRect.contains(pointer.x, pointer.y)) {
                droppedInSlot = true;

                const hasOldSelectedPosition = !isNaN(monster.positionIndex);//old position was from selected monsters
                const hasOldUpgradePosition = !isNaN(monster.upgradePostionIndex);//old position was from upgrade monsters
                const hasOldSellPosition = monster.addedForSale;//old position was from sell section
                const existingMonster = this.selectedMonsters[i];// has monster on the current drop spot

                if (hasOldSelectedPosition) {
                    this.selectedMonsters[monster.positionIndex] = null;
                } else if (hasOldUpgradePosition) {
                    this.upgradeSelectedMonsters[monster.upgradePostionIndex] = null;
                } else if (hasOldSellPosition) {
                    monster.addedForSale = false;
                    this.monsterAddedForSale = null;
                }

                if (existingMonster) {
                    // Handle swapping
                    if (hasOldSelectedPosition) {
                        existingMonster.addedForSale = false;
                        // this.monsterAddedForSale = null;
                        this.selectedMonsters[monster.positionIndex] = existingMonster;
                        this.animateMonsterReturn(existingMonster, monster.startX, monster.startY);
                        existingMonster.startX = monster.startX;
                        existingMonster.startY = monster.startY;
                        existingMonster.positionIndex = monster.positionIndex;
                        existingMonster.upgradePostionIndex = NaN;
                        this.playerMonstersData[existingMonster.originalIndex].row = monster.positionIndex;
                    } else if (hasOldUpgradePosition) {
                        existingMonster.addedForSale = false;
                        // this.monsterAddedForSale = null;
                        this.upgradeSelectedMonsters[monster.upgradePostionIndex] = existingMonster;
                        this.animateMonsterReturn(existingMonster, monster.startX, monster.startY);
                        existingMonster.startX = monster.startX;
                        existingMonster.startY = monster.startY;
                        existingMonster.upgradePostionIndex = monster.upgradePostionIndex;
                        existingMonster.positionIndex = NaN;
                    } else if (hasOldSellPosition) {
                        // this.monsterAddedForSale!.addedForSale = false;
                        // this.monsterAddedForSale = null;

                        this.monsterAddedForSale = existingMonster;
                        existingMonster.addedForSale = true;
                        this.animateMonsterReturn(existingMonster, monster.startX, monster.startY);
                        existingMonster.startX = monster.startX;
                        existingMonster.startY = monster.startY;
                        existingMonster.upgradePostionIndex = NaN;
                        existingMonster.positionIndex = NaN;
                    } else {
                        this.selectedMonsters[i] = existingMonster;
                        this.animateMonsterReturn(existingMonster, monster.startX, monster.startY);
                        existingMonster.positionIndex = NaN;
                        existingMonster.upgradePostionIndex = NaN;
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
                monster.upgradePostionIndex = NaN;
                monster.addedForSale = false;

                this.playerMonstersData[monster.originalIndex].row = i;
                this.selectedMonsters[i] = monster;

                this.reposition();
                this.checkUpgradeButtonEnable();
                break;
            }
        }
        //end region

        if (!droppedInSlot && !droppedInUpgradeSlot && !droppedInSellSlot) {
            monster.setPosition(monster.startX, monster.startY);
        }
    }

    private toggleUpgradeButtonEnable(enable: boolean) {
        if (enable) {
            this.upgradeButton.setInteractive().setAlpha(1);
        } else {
            this.upgradeButton.disableInteractive().setAlpha(0.65);
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
        const selectedMonsters: Phaser.GameObjects.Text = this.add.text(
            65,
            5,
            'SELECTED MONSTERS',
            {
                fontFamily: 'Arial Black', fontSize: 50, color: '#ffffff',
                stroke: '#000000', strokeThickness: 2,
                align: 'center'
            }).setOrigin(0);

        this.add.existing(selectedMonsters);

        for (let index = 0; index < MAX_SELECTED_MONSTERS; index++) {
            const hitRect = new Phaser.Geom.Rectangle(HORIZONTAL_DISTANCE + (HORIZONTAL_DISTANCE + MONSTER_SIZE) * index, 65, MONSTER_SIZE, MONSTER_SIZE);
            const graphics = this.add.graphics();
            graphics.lineStyle(2, 0xffffff);
            graphics.strokeRectShape(hitRect);
            this.hitRects.push(hitRect);
        }
    }

    private createMainDeckHitRect() {
        const allMonsters: Phaser.GameObjects.Text = this.add.text(
            65,
            280,
            'MONSTERS (40 max)',
            {
                fontFamily: 'Arial Black', fontSize: 50, color: '#ffffff',
                stroke: '#000000', strokeThickness: 2,
                align: 'center'
            }).setOrigin(0);

        this.add.existing(allMonsters);

        this.mainDeckHitRect = new Phaser.Geom.Rectangle(65, MAIN_DECK_Y - MONSTER_SIZE / 2, MAIN_DECK_WIDTH, MAIN_DECK_HEIGHT);
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffffff);
        graphics.strokeRectShape(this.mainDeckHitRect);
    }

    // region SELL
    private createSellCardSlot() {
        const sellCardText: Phaser.GameObjects.Text = this.add.text(
            1415,
            820,
            `sell monster for: ${this.sellFor}`,
            {
                fontFamily: 'Arial Black', fontSize: 50, color: '#ffffff',
                stroke: '#000000', strokeThickness: 2,
                align: 'center'
            }).setOrigin(0.5);

        this.add.existing(sellCardText);

        const hitRect = new Phaser.Geom.Rectangle(1165, 860, MONSTER_SIZE, MONSTER_SIZE);
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffffff);
        graphics.strokeRectShape(hitRect);
        this.sellHitRect = hitRect;

        this.sellButton = new Button(this, 1470, 970, 'sell-btn', this.onSellMonster.bind(this), true, 1.1);
    }

    private onSellMonster() {

    }
    //end region

    // region UPGRADE
    private createUpgradeSlots() {
        const upgradeMonsters: Phaser.GameObjects.Text = this.add.text(
            65,
            800,
            'UPGRADE MONSTER',
            {
                fontFamily: 'Arial Black', fontSize: 50, color: '#ffffff',
                stroke: '#000000', strokeThickness: 2,
                align: 'center'
            }).setOrigin(0);

        this.add.existing(upgradeMonsters);

        for (let index = 0; index < MONSTERS_NEEDED_FOR_UPGRADE; index++) {
            const hitRect = new Phaser.Geom.Rectangle(HORIZONTAL_DISTANCE + (HORIZONTAL_DISTANCE + MONSTER_SIZE) * index, 860, MONSTER_SIZE, MONSTER_SIZE);
            const graphics = this.add.graphics();
            graphics.lineStyle(2, 0xffffff);
            graphics.strokeRectShape(hitRect);
            this.upgradeHitRects.push(hitRect);
        }

        this.upgradeCostText = this.add.text(
            970,
            820,
            `cost: ${this.upgradeCost}`,
            {
                fontFamily: 'Arial Black', fontSize: 50, color: '#ffffff',
                stroke: '#000000', strokeThickness: 2,
                align: 'center'
            }).setOrigin(0.5);

        this.add.existing(this.upgradeCostText);

        this.upgradeButton = new Button(this, 970, 970, 'upgrade', this.onUpgradeMonster.bind(this), true);
    }

    private checkUpgradeButtonEnable() {

        if (this.upgradeSelectedMonsters.filter((m: Monster | null) => m !== null).length !== 3) {
            // less than 3 monstars
            this.upgradeCost = 0;
            this.upgradeCostText.setText(`cost: ${this.upgradeCost}`)
            this.toggleUpgradeButtonEnable(false);
            return;
        }

        let firstUnitData = this.upgradeSelectedMonsters[0]!.unitData;
        for (let index = 1; index < 3; index++) {
            const unitData = this.upgradeSelectedMonsters[index]!.unitData;
            if (unitData.type !== firstUnitData.type || unitData.stars !== firstUnitData.stars) {
                this.toggleUpgradeButtonEnable(false);
                return;
            }
        }

        const playerCoins = localStorage.getItem('coins') || '0';
        this.upgradeCost = this.upgradeSelectedMonsters[0]?.unitData.upgradeCost || 0;
        this.upgradeCostText.setText(`cost: ${this.upgradeCost}`)

        if (+playerCoins < this.upgradeCost) {
            // not enough coin to upgrade
            this.toggleUpgradeButtonEnable(false);
            return;
        }

        this.toggleUpgradeButtonEnable(true);
    }

    private onUpgradeMonster() {
        console.log(this.playerMonstersData);
        console.log(this.monstersContainer.list);

        // remove and destroy monsters in the upgrade section and set monsters as null in playerMonstersData for this monsters
        this.upgradeSelectedMonsters.forEach((m: Monster | null, index: number) => {
            if (!isNaN(m!.upgradePostionIndex)) {
                const originalIndex = m?.originalIndex || 0;
                (this.playerMonstersData as any)[originalIndex] = null;

                m?.list.forEach(element => {
                    element.destroy(true);
                });
                m!.bg.removeAllListeners();
                m!.destroy(true);
                m!.removeAllListeners();
                m = null;
            }
        });

        // remove monsters in playerMonstersData that were in the upgrade section
        this.playerMonstersData = this.playerMonstersData.filter((x: any) => x !== null);

        console.log(this.playerMonstersData);
        console.log(this.monstersContainer.list);

        // update coins and upgrade cost text
        const playerCoins = localStorage.getItem('coins') || '0';
        this.upgradeCost = this.upgradeSelectedMonsters[0]?.unitData.upgradeCost || 0;
        const playerCoinsAfterUpgrade = +playerCoins - this.upgradeCost;
        localStorage.setItem('coins', JSON.stringify(playerCoinsAfterUpgrade));
        localStorage.setItem('playerMonstersData', JSON.stringify(this.playerMonstersData));
        this.toggleUpgradeButtonEnable(false);
        this.upgradeCost = 0;
        this.upgradeCostText.setText(`cost: ${this.upgradeCost}`);

        // set stats for the new monster
        const newMonsterType = this.upgradeSelectedMonsters[0]?.unitData.type!;
        const newMonsterStars = this.upgradeSelectedMonsters[0]?.unitData.stars! + 1;

        // create new card
        const config = { ...(monsters_power_config as any)[newMonsterType][newMonsterStars - 1] };
        const newMonster = new Monster(this, 960, 540, MONSTER_SIZE, MONSTER_SIZE, config, 0, true).setAlpha(0);
        newMonster.starsContainer.x = MONSTER_SIZE / -4 + 10;
        newMonster.movesLeftContainer.x = MONSTER_SIZE / 2 + 10;
        newMonster.bg.setInteractive({ draggable: true });
        this.monstersContainer.add(newMonster);

        // reset upgrade section
        this.upgradeSelectedMonsters = [null, null, null];

        // add new monster to playerMonstersData
        this.addNewMonster(+newMonsterType, newMonsterStars);

        // sort monsters in the container
        this.sortMonsters();

        // get the index where new monster should be placed and move it there
        const newMonsterIndex = this.playerMonstersData.findIndex(i => i.type === +newMonsterType && i.stars === +newMonsterStars);
        this.monstersContainer.moveTo(newMonster, newMonsterIndex);

        // update all indexes for monsters in the container
        this.monstersContainer.list.forEach((m: any, index: number) => {
            m.originalIndex = index;
        });

        // set interaction for the new monster
        this.setupMonsterInteractions(newMonster, newMonsterIndex);
        this.setupMonsterDrag(newMonster, newMonsterIndex);

        // update local storage with the data including the new monster
        localStorage.setItem('playerMonstersData', JSON.stringify(this.playerMonstersData));

        // introduce new card
        let overlay = this.add.image(0, 0, 'black-overlay').setScale(192, 108).setOrigin(0).setAlpha(0);
        this.monstersContainer.add(overlay);
        overlay.setInteractive();
        overlay.on('pointerdown', function (pointer: any) {
            pointer.event.stopPropagation();
        });

        this.tweens.chain({
            tweens: [
                {
                    targets: overlay,
                    duration: 200,
                    alpha: 0.85
                },
                {
                    targets: newMonster,
                    scale: 2,
                    duration: 350,
                    delay: 250,
                    alpha: 1,
                    onStart: () => {
                        this.monstersContainer.bringToTop(newMonster);
                        newMonster.setScale(3);
                    }
                },
                {
                    targets: overlay,
                    duration: 200,
                    alpha: 0,
                    delay: 1000,
                    onComplete: () => {
                        this.monstersContainer.moveTo(newMonster, newMonster.originalIndex);
                        overlay.destroy();
                        this.reposition();
                    }
                },
            ]
        })

        console.table(this.playerMonstersData);
        console.log(this.selectedMonsters)
        console.log(this.upgradeSelectedMonsters)
    }
    // end region

    private addNewMonster(type: number, stars: number) {
        const newObject = { type, stars, row: NaN, col: 11 };
        this.playerMonstersData.push(newObject);
    }

    private reposition() {
        const monsters = this.monstersContainer.list.filter((x: any) => isNaN(x.positionIndex) && isNaN(x.upgradePostionIndex) && !x.addedForSale)

        monsters.forEach((element: any, index) => {
            let finalX = MONSTER_INITIAL_X + index * MONSTER_GAP;
            if (index > MAX_MONSTERS_0N_ROW) {
                finalX = MONSTER_INITIAL_X + (index - MAX_MONSTERS_0N_ROW - 1) * MONSTER_GAP;
            }
            const finalY = MAIN_DECK_Y + (index - MAX_MONSTERS_0N_ROW > 0 ? MAIN_DECK_HEIGHT / 2 : 0)
            this.tweens.add({
                targets: element,
                x: finalX,
                y: finalY,
                duration: 150,
                scale: 1
            })
            element.startX = finalX;
            element.startY = finalY;
            // this.monstersContainer.bringToTop(element); // causes bugs
        });
        console.log(this.selectedMonsters)
        console.log(this.upgradeSelectedMonsters)
        console.log(this.monsterAddedForSale)
    }

    private createOkButton() {
        this.okButton = new Button(this, 1800, 970, 'ok-btn', this.save.bind(this));
    }

    private save() {
        console.log(this)
        console.table(this.playerMonstersData);
        localStorage.setItem('playerMonstersData', JSON.stringify(this.playerMonstersData));
        this.scene.start('MainMenu');
    }
}
