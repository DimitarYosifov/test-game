import { Scene, GameObjects } from 'phaser';
import { Monster } from './in-game/Monster';
import { monsters_power_config } from '../configs/monsters_power_config';
import { IPlayerMonstersData } from './in-game/TestPlayerTeam';
import { Button } from './in-main-menu/Button';
import { AbstractScene } from './AbstractScene';
import { getMonsterDataConfig } from '../configs/main_config';
import { DataHandler } from './in-daily-quest/DataHandler';

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

export class CardSelection extends AbstractScene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    monstersContainer: GameObjects.Container;
    hitRects: Phaser.Geom.Rectangle[];
    upgradeHitRects: Phaser.Geom.Rectangle[];
    selectedMonsters: Monster[] | null[] = [null, null, null, null, null, null, null];
    upgradeSelectedMonsters: Monster[] | null[] = [null, null, null];
    mainDeckHitRect: Phaser.Geom.Rectangle;
    okButton: Button;
    playerMonstersData: IPlayerMonstersData[];
    upgradeCostText: GameObjects.Text;
    upgradeCost: number = 0;
    sellsFor: number = 0;
    upgradeButton: Button;
    sellHitRect: Phaser.Geom.Rectangle;
    sellButton: Button;
    monsterAddedForSale: Monster | null;
    sellCardText: GameObjects.Text;
    coinText: GameObjects.Text;
    coinTexture: GameObjects.Image;
    gems: string;
    gemsText: GameObjects.Text;
    gemsTexture: GameObjects.Image;
    upgradeCostGemsText: GameObjects.Text;
    upgradeCostGems: number = 0;
    ;

    constructor() {
        super('CardSelection');
    }

    init() {

    }

    create() {
        super.create();

        this.monstersContainer = this.add.container().setDepth(100);
        this.hitRects = [];
        this.upgradeHitRects = [];
        this.loadPlayerMonsters();
        this.createMonstersSlots();
        this.createMainDeckHitRect();
        this.createUpgradeSlots();
        this.createSellCardSlot();
        this.createOkButton();
        this.createCoins();

        this.initializeMonsters();
    }

    private loadPlayerMonsters() {

        const playerMonstersDataFromStorage = JSON.parse(localStorage.getItem('playerMonstersData') ?? "null", (key, value) => {
            return key === 'row' && value === null ? NaN : value;
        });

        //for testing when starting new game - start with the monsters below
        this.playerMonstersData = playerMonstersDataFromStorage ||
            [
                // {
                //     type: 9, stars: 3, row: NaN, col: 11
                // },
                // {
                //     type: 9, stars: 2, row: NaN, col: 11
                // },
                // {
                //     type: 9, stars: 2, row: NaN, col: 11
                // },
                // {
                //     type: 9, stars: 1, row: NaN, col: 11
                // },
                // {
                //     type: 9, stars: 1, row: NaN, col: 11
                // },
                // {
                //     type: 9, stars: 1, row: NaN, col: 11
                // },



                // {
                //     type: 6, stars: 3, row: NaN, col: 11
                // },
                // {
                //     type: 5, stars: 1, row: NaN, col: 11
                // },
                // {
                //     type: 5, stars: 3, row: NaN, col: 11
                // },
                // {
                //     type: 7, stars: 1, row: NaN, col: 11
                // },
                // {
                //     type: 7, stars: 1, row: NaN, col: 11
                // },
                // {
                //     type: 7, stars: 3, row: NaN, col: 11
                // },
                // {
                //     type: 8, stars: 2, row: NaN, col: 11
                // },
                // {
                //     type: 8, stars: 3, row: NaN, col: 11
                // },
                // {
                //     type: 8, stars: 1, row: NaN, col: 11
                // },
                // {
                //     type: 9, stars: 1, row: NaN, col: 11
                // },
                // {
                //     type: 9, stars: 1, row: NaN, col: 11
                // },
                // {
                //     type: 9, stars: 1, row: NaN, col: 11
                // },
                // {
                //     type: 7, stars: 1, row: NaN, col: 11
                // },
                // {
                //     type: 7, stars: 1, row: NaN, col: 11
                // },
                // {
                //     type: 7, stars: 1, row: NaN, col: 11
                // },
                // {
                //     type: 8, stars: 1, row: NaN, col: 11
                // },
                // {
                //     type: 8, stars: 1, row: NaN, col: 11
                // },
                // {
                //     type: 8, stars: 1, row: NaN, col: 11
                // },
                // {
                //     type: 9, stars: 1, row: NaN, col: 11
                // },
                // {
                //     type: 9, stars: 1, row: NaN, col: 11
                // },
                // {
                //     type: 9, stars: 1, row: NaN, col: 11
                // },
                // {
                //     type: 8, stars: 1, row: NaN, col: 11
                // },
                // {
                //     type: 8, stars: 1, row: NaN, col: 11
                // },
                // {
                //     type: 8, stars: 1, row: NaN, col: 11
                // },
                // {
                //     type: 9, stars: 1, row: NaN, col: 11
                // },
                // {
                //     type: 9, stars: 1, row: NaN, col: 11
                // },
                // {
                //     type: 9, stars: 1, row: NaN, col: 11
                // },
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
            const config = getMonsterDataConfig(+monsterData.type, monsterData.stars - 1);

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
        this.reposition(true);
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
            this.toggleSellButtonEnable(!!this.monsterAddedForSale);
            return
        }

        let droppedInSlot = false;
        let droppedInUpgradeSlot = false;
        let droppedInSellSlot = false;

        const proceed = (i: number = NaN, hitRect?: Phaser.Geom.Rectangle) => {
            console.log(this.selectedMonsters);
            // this.hasDuplicates();

            const hasOldSelectedPosition = !isNaN(monster.positionIndex);       //old position was from selected monsters
            const hasOldUpgradePosition = !isNaN(monster.upgradePostionIndex);  //old position was from upgrade monsters
            const hasOldSellPosition = monster.addedForSale;                    //old position was from sell section

            let existingMonster = null;

            if (droppedInSellSlot) {
                existingMonster = this.monsterAddedForSale;// has monster on the current drop spot
            } else if (droppedInUpgradeSlot) {
                existingMonster = this.upgradeSelectedMonsters[i];// has monster on the current drop spot
            } else if (droppedInSlot) {
                existingMonster = this.selectedMonsters[i];// has monster on the current drop spot
            }

            console.log(existingMonster?.positionIndex)
            console.log(monster?.positionIndex)

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
                    this.selectedMonsters[monster.positionIndex] = existingMonster;
                    existingMonster.positionIndex = monster.positionIndex;
                    existingMonster.upgradePostionIndex = NaN;
                    existingMonster.addedForSale = false;
                    this.playerMonstersData[existingMonster.originalIndex].row = monster.positionIndex;
                }
                else if (hasOldUpgradePosition) {
                    this.upgradeSelectedMonsters[monster.upgradePostionIndex] = existingMonster;
                    existingMonster.addedForSale = false;
                    existingMonster.upgradePostionIndex = monster.upgradePostionIndex;
                    existingMonster.positionIndex = NaN;
                    this.playerMonstersData[existingMonster.originalIndex].row = monster.positionIndex;
                } else if (hasOldSellPosition) {
                    this.monsterAddedForSale = existingMonster;
                    existingMonster.addedForSale = true;
                    existingMonster.upgradePostionIndex = NaN;
                    existingMonster.positionIndex = NaN;
                    this.playerMonstersData[existingMonster.originalIndex].row = monster.positionIndex;
                } else {
                    existingMonster.positionIndex = NaN;
                    existingMonster.upgradePostionIndex = NaN;
                    existingMonster.addedForSale = false;//??
                    this.playerMonstersData[existingMonster.originalIndex].row = NaN;
                }
                this.animateMonsterReturn(existingMonster, monster.startX, monster.startY)
                existingMonster.startX = monster.startX;
                existingMonster.startY = monster.startY;
            }

            if (droppedInSellSlot) {
                // Place dragged monster into the new slot
                monster.setPosition(this.sellHitRect.x + this.sellHitRect.width / 2, this.sellHitRect.y + this.sellHitRect.height / 2);
                this.monsterAddedForSale = monster;
                this.playerMonstersData[monster.originalIndex].row = NaN;
            } else if (droppedInUpgradeSlot) {
                monster.setPosition(hitRect!.x + hitRect!.width / 2, hitRect!.y + hitRect!.height / 2);
                this.upgradeSelectedMonsters[i] = monster;
                this.playerMonstersData[monster.originalIndex].row = NaN;
                this.checkUpgradeButtonEnable();
            } else if (droppedInSlot) {
                monster.setPosition(hitRect!.x + hitRect!.width / 2, hitRect!.y + hitRect!.height / 2);
                this.playerMonstersData[monster.originalIndex].row = i;
                this.selectedMonsters[i] = monster;
                this.checkUpgradeButtonEnable();
            }
            monster.positionIndex = droppedInSlot ? i : NaN;
            monster.upgradePostionIndex = droppedInUpgradeSlot ? i : NaN;
            monster.addedForSale = droppedInSellSlot;
            monster.startX = monster.x;
            monster.startY = monster.y;
            this.toggleSellButtonEnable(!!this.monsterAddedForSale);
            this.reposition();



            console.log(existingMonster?.positionIndex)
            console.log(monster?.positionIndex)
            console.log(this.selectedMonsters)
            // this.hasDuplicates();

        }

        // check dropped in sell section
        if (this.sellHitRect.contains(pointer.x, pointer.y)) {
            droppedInSellSlot = true;
            proceed();
            return;
        }

        // check dropped in upgrade section
        for (let i = 0; i < this.upgradeHitRects.length; i++) {
            const hitRect = this.upgradeHitRects[i];
            if (hitRect.contains(pointer.x, pointer.y)) {

                if (monster.unitData.stars === 5) {
                    // monster is 5 stars and can not be upgraded!
                    break;
                }

                droppedInUpgradeSlot = true;
                proceed(i, hitRect);
                break;
            }
        }
        if (droppedInUpgradeSlot) {
            return;
        }

        //region check dropped in selected section
        for (let i = 0; i < this.hitRects.length; i++) {
            const hitRect = this.hitRects[i];
            if (hitRect.contains(pointer.x, pointer.y)) {
                console.log(this.playerMonstersData)
                droppedInSlot = true;
                proceed(i, hitRect)
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
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 50, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
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
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 50, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
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
        this.sellCardText = this.add.text(
            1415,
            820,
            `sell monster for: ${this.sellsFor} `,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 50, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0.5);

        this.add.existing(this.sellCardText);

        const hitRect = new Phaser.Geom.Rectangle(1165, 860, MONSTER_SIZE, MONSTER_SIZE);
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffffff);
        graphics.strokeRectShape(hitRect);
        this.sellHitRect = hitRect;

        this.sellButton = new Button(this, 1470, 970, 'button', 'sell', this.onSellMonster.bind(this), true, 1);
    }

    private toggleSellButtonEnable(enable: boolean) {
        if (enable) {
            this.sellButton.setInteractive();
            this.sellsFor = this.monsterAddedForSale?.unitData.sellsFor || 0;
        } else {
            this.sellButton.disableInteractive();
            this.sellsFor = 0;
        }
        this.sellCardText.setText(`sell monster for: ${this.sellsFor}`);
    }

    private onSellMonster() {
        console.log(this.playerMonstersData)
        console.log(this.monstersContainer.list)

        const playerCoins = localStorage.getItem('coins') || '0';
        // this.coinText.setText(`${+playerCoins + this.sellsFor}`);
        this.updateCoinsText(+playerCoins + this.sellsFor);

        localStorage.setItem('coins', JSON.stringify(+playerCoins + this.sellsFor));

        const originalIndex = this.monsterAddedForSale?.originalIndex || 0;
        (this.playerMonstersData as any)[originalIndex] = null;

        this.monsterAddedForSale!.bg.removeAllListeners();
        this.monsterAddedForSale!.destroy(true);
        this.monsterAddedForSale!.removeAllListeners();
        this.monsterAddedForSale = null;

        this.playerMonstersData = this.playerMonstersData.filter((x: any) => x !== null);
        localStorage.setItem('playerMonstersData', JSON.stringify(this.playerMonstersData));

        this.sortMonsters();
        this.updateMonstersOrder();

        this.toggleSellButtonEnable(false);

        // update all indexes for monsters in the container
        this.monstersContainer.list.forEach((m: any, index: number) => {
            m.originalIndex = index;
        });

        this.checkUpgradeButtonEnable();
        this.sellButton.setScale(1);

        console.log(this.playerMonstersData)
        console.log(this.monstersContainer.list)

        // notify daily quests that a monster is sold
        DataHandler.onMonsterSold();

    }
    //end region

    // region UPGRADE
    private createUpgradeSlots() {
        const upgradeMonsters: Phaser.GameObjects.Text = this.add.text(
            65,
            800,
            'UPGRADE MONSTER',
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 50, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
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
            `cost: ${this.upgradeCost} `,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 50, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0.5);

        this.add.existing(this.upgradeCostText);

        this.upgradeCostGemsText = this.add.text(
            1000,
            870,
            `${this.upgradeCostGems} `,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 50, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0.5);

        this.add.existing(this.upgradeCostGemsText);
        let gemsTexture = this.add.image(this.upgradeCostGemsText.x - this.upgradeCostGemsText.width + 15, this.upgradeCostGemsText.y + 5, 'gem').setScale(0.1).setOrigin(1, 0.5);
        this.upgradeButton = new Button(this, 970, 970, 'upgrade', null, this.onUpgradeMonster.bind(this), true);
    }

    private checkUpgradeButtonEnable() {

        if (this.upgradeSelectedMonsters.filter((m: Monster | null) => m !== null).length !== 3) {
            // less than 3 monstars
            this.upgradeCost = 0;
            this.upgradeCostGems = 0;
            this.upgradeCostText.setText(`cost: ${this.upgradeCost} `);
            this.upgradeCostGemsText.setText(`${this.upgradeCostGems}`)
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
        const playerGems = localStorage.getItem('gems') || '0';
        this.upgradeCost = this.upgradeSelectedMonsters[0]?.unitData.upgradeCost || 0;
        this.upgradeCostGems = this.upgradeSelectedMonsters[0]?.unitData.stars as number;

        this.upgradeCostText.setText(`cost: ${this.upgradeCost}`)
        this.upgradeCostGemsText.setText(`${this.upgradeCostGems}`)

        if (+playerCoins < this.upgradeCost || +playerGems < this.upgradeCostGems) {
            // not enough coin to upgrade
            this.toggleUpgradeButtonEnable(false);
            return;
        }

        this.toggleUpgradeButtonEnable(true);
    }

    private onUpgradeMonster() {
        console.log(this.playerMonstersData);
        console.log(this.monstersContainer.list);
        this.hasDuplicates();


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
        const playerGems = localStorage.getItem('gems') || '0';
        this.upgradeCost = this.upgradeSelectedMonsters[0]?.unitData.upgradeCost || 0;
        this.upgradeCostGems = this.upgradeSelectedMonsters[0]?.unitData.stars as number;

        const playerCoinsAfterUpgrade = +playerCoins - this.upgradeCost;
        const playerGemsAfterUpgrade = +playerGems - this.upgradeCostGems;
        this.updateCoinsText(playerCoinsAfterUpgrade, playerGemsAfterUpgrade);
        localStorage.setItem('coins', JSON.stringify(playerCoinsAfterUpgrade));
        localStorage.setItem('gems', JSON.stringify(playerGemsAfterUpgrade));
        localStorage.setItem('playerMonstersData', JSON.stringify(this.playerMonstersData));
        this.toggleUpgradeButtonEnable(false);
        this.upgradeCost = 0;
        this.upgradeCostGems = 0;

        this.upgradeCostText.setText(`cost: ${this.upgradeCost} `);
        this.upgradeCostGemsText.setText(`${this.upgradeCostGems} `);

        // set stats for the new monster
        const newMonsterType = this.upgradeSelectedMonsters[0]?.unitData.type!;
        const newMonsterStars = this.upgradeSelectedMonsters[0]?.unitData.stars! + 1;

        // create new card
        let overlay = this.add.image(0, 0, 'black-overlay').setScale(192, 108).setOrigin(0).setAlpha(0);
        this.monstersContainer.add(overlay);
        overlay.setInteractive();
        overlay.on('pointerdown', function (pointer: any) {
            pointer.event.stopPropagation();
        });
        const config = getMonsterDataConfig(+newMonsterType, newMonsterStars - 1);
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
        this.updateMonstersOrder();

        // set interaction for the new monster
        this.setupMonsterInteractions(newMonster, newMonsterIndex);
        this.setupMonsterDrag(newMonster, newMonsterIndex);

        // update local storage with the data including the new monster
        localStorage.setItem('playerMonstersData', JSON.stringify(this.playerMonstersData));

        // introduce new card
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
                    delay: 1250,
                    onComplete: () => {
                        // this.monstersContainer.moveTo(newMonster, newMonster.originalIndex);
                        this.monstersContainer.moveTo(newMonster, newMonsterIndex);
                        overlay.destroy();
                        this.reposition();
                    }
                },
            ]
        })

        // notify daily quests that a monster is upgraded
        DataHandler.onMonsterUpgrade();

        console.table(this.playerMonstersData);
        console.log(this.selectedMonsters)
        console.log(this.upgradeSelectedMonsters)
        this.hasDuplicates();

    }
    // end region

    private addNewMonster(type: number, stars: number) {
        const newObject = { type, stars, row: NaN, col: 11 };
        this.playerMonstersData.push(newObject);
    }

    private reposition(moveImmediately: boolean = false) {
        const monsters = this.monstersContainer.list.filter((x: any) => isNaN(x.positionIndex) && isNaN(x.upgradePostionIndex) && !x.addedForSale)

        monsters.forEach((element: any, index) => {
            let finalX = MONSTER_INITIAL_X + index * MONSTER_GAP;
            if (index > MAX_MONSTERS_0N_ROW) {
                finalX = MONSTER_INITIAL_X + (index - MAX_MONSTERS_0N_ROW - 1) * MONSTER_GAP;
            }
            const finalY = MAIN_DECK_Y + (index - MAX_MONSTERS_0N_ROW > 0 ? MAIN_DECK_HEIGHT / 2 : 0);
            const duration = moveImmediately ? 1 : 150;
            this.tweens.add({
                targets: element,
                x: finalX,
                y: finalY,
                duration,
                scale: 1
            })
            element.startX = finalX;
            element.startY = finalY;
            // this.monstersContainer.bringToTop(element); // causes bugs
        });
        console.log(this.selectedMonsters)
        console.log(this.upgradeSelectedMonsters)
        console.log(this.monsterAddedForSale)
        console.log(this.selectedMonsters.map((m: any/*  */) => m?.positionIndex))
        // this.hasDuplicates();
        console.table(this.playerMonstersData);
    }

    private hasDuplicates() {
        let arr = this.selectedMonsters.map((m: any/*  */) => m?.positionIndex);
        console.log(arr)
        const freq: any = {};
        for (let item of arr) {
            if (freq[item] && item !== undefined && !isNaN(item)) {
                alert('has Duplicates');
                debugger;
                console.log('has duplicartes')
            }
            freq[item] = 1;
        }

        let arr2 = this.playerMonstersData.map((m: any) => m?.row);
        // arr2 = [2, 2, NaN, NaN];
        console.log(arr2)
        const freq2: any = {};
        for (let item of arr2) {
            if (freq2[item] && !isNaN(item)) {
                alert('has Duplicates');
                debugger;
                console.log('has duplicartes')
            }
            freq2[item] = 1;
        }
    }

    private createOkButton() {
        this.okButton = new Button(this, 1800, 970, 'button', 'OK', this.save.bind(this));
    }

    // updates order of monsters- similar to zOrder
    private updateMonstersOrder() {
        this.monstersContainer.list.forEach((m: any, index: number) => {
            m.originalIndex = index;
        });
    }

    private save() {
        console.log(this)
        console.log(this.selectedMonsters.map((m: any) => m?.unitData?.row))
        // this.hasDuplicates();

        //=============test to fix bug with multiple monsters on same spot after upgrade!=================
        this.playerMonstersData.forEach((element: IPlayerMonstersData) => {
            element.row = NaN;
        });
        //================================================================================================

        this.selectedMonsters.filter(m => m !== null).forEach((monster) => {
            this.playerMonstersData[monster!.originalIndex].row = monster!.positionIndex;
            monster.addedForSale = false;
            monster.positionIndex = NaN;
            monster.upgradePostionIndex = NaN;
            monster.originalIndex = NaN;

        });
        this.hasDuplicates();

        console.table(this.playerMonstersData);
        this.selectedMonsters = [null, null, null, null, null, null, null];
        this.upgradeSelectedMonsters = [null, null, null];
        this.monsterAddedForSale = null;
        localStorage.setItem('playerMonstersData', JSON.stringify(this.playerMonstersData));
        this.changeScene('MainMenu');
    }

    createCoins() {
        const coins = localStorage.getItem('coins') || '0';
        this.coinText = this.add.text(
            1900,
            30,
            `${coins}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(1, 0.5);
        this.coinTexture = this.add.image(this.coinText.x - this.coinText.displayWidth, 30, 'coin').setScale(0.35).setOrigin(1, 0.5);
        this.gems = localStorage.getItem('gems') || '0';
        this.gemsText = this.add.text(
            this.coinTexture.x - this.coinTexture.displayWidth - 25,
            30,
            `${this.gems}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(1, 0.5);
        this.gemsTexture = this.add.image(this.gemsText.x - this.gemsText.displayWidth, 30, 'gem').setScale(0.1).setOrigin(1, 0.5);
    }

    private updateCoinsText(value: number | string, playerGemsAfterUpgrade: number | null = null) {
        this.coinText.setText(`${value}`);
        this.coinTexture.x = this.coinText.x - this.coinText.width;
        if (typeof playerGemsAfterUpgrade === 'number') {
            this.gemsText.setText(`${playerGemsAfterUpgrade}`);
            this.gemsText.x = this.coinTexture.x - this.coinTexture.displayWidth - 20;
            this.gemsTexture.x = this.gemsText.x - this.gemsText.displayWidth;
        }
    }

    changeScene(nextScene: string): void {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(nextScene);
        });
    }

    createBackButton(): void { };

}
