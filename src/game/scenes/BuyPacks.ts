import { IOpponentMonstersData } from '../configs/level_config';
import { getMonsterDataConfig, getRandomMonsterType, main_config } from '../configs/main_config';
import { LOCAL_STORAGE_MANAGER } from '../LOCAL_STORAGE_MANAGER';
import { AbstractScene } from './AbstractScene';
import { Monster } from './in-game/Monster';
import { Button } from './in-main-menu/Button';

export type PackName = keyof typeof main_config.packData;
const MONSTER_SIZE = 200;
const POSITION_CFG = {
    commonPack: {
        x: 400,
        y: 125
    },
    silverPack: {
        x: 960,
        y: 125
    },
    goldenPack: {
        x: 1520,
        y: 125
    }
}
const PACK_COST = [
    main_config.packData.commonPack.cost,
    main_config.packData.silverPack.cost,
    main_config.packData.goldPack.cost
]

export class BuyPacks extends AbstractScene {
    commonPackButton: Button;
    commonPackTexture: Phaser.GameObjects.Image;
    silverPackTexture: Phaser.GameObjects.Image;
    silverPackButton: Button;
    goldenPackTexture: Phaser.GameObjects.Image;
    goldenPackButton: Button;
    backButton: Button;
    coins: string | number;
    coinText: Phaser.GameObjects.Text;
    coinTexture: Phaser.GameObjects.Image;
    monstersContainer: Phaser.GameObjects.Container;
    monsters: Monster[];
    overlay: Phaser.GameObjects.Image | null;
    claimButton: Button | null;
    gems: string;
    gemsText: Phaser.GameObjects.Text;
    gemsTexture: Phaser.GameObjects.Image;

    constructor() {
        super('BuyPacks');
    }

    create() {
        super.create();

        this.add.image(0, 0, 'bg-buy-packs').setOrigin(0);

        this.monstersContainer = this.add.container(0, 0).setDepth(100).setAlpha(1);
        this.monsters = [];

        this.createCoins(); // should be called before other methods
        this.createCommonPack();
        this.createSilverPack();
        this.createGoldenrPack();
        this.createBackButton();
    }

    changeScene(nextScene: string): void {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(nextScene);
        });
    }

    private createCommonPack() {
        //title
        const commonPackTitle = this.add.text(
            POSITION_CFG.commonPack.x,
            POSITION_CFG.commonPack.y,
            `common pack`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }
        ).setOrigin(0.5);

        //image
        this.commonPackTexture = this.add.image(POSITION_CFG.commonPack.x, POSITION_CFG.commonPack.y + 240, 'common-pack').setOrigin(0.5).setScale(0.5);

        // monsters count text
        const commonPackMonstersCount = this.add.text(
            this.commonPackTexture.x,
            this.commonPackTexture.y + 215,
            `3 monsters`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 40, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }
        ).setOrigin(0.5);

        let heightSoFar = 0;
        const packData = main_config.packData.commonPack.monsterLevelOdds
        for (let index = 0; index < main_config.packData.commonPack.monsterLevelOdds.length; index++) {
            let odd;

            if (index === 0) {
                odd = packData[0]
            } else {
                if (packData[index] === 0) break;
                odd = packData[index] - packData[index - 1]
            }

            let widthSoFar = 0;
            for (let starIndex = 0; starIndex < index + 1; starIndex++) {
                let star = this.add.image(this.commonPackTexture.x - widthSoFar, this.commonPackTexture.y + 275 + heightSoFar, 'star').setOrigin(1, 0.5).setScale(0.3);
                widthSoFar += star.displayWidth;
            }

            // % text
            const percentageText = this.add.text(
                this.commonPackTexture.x,
                this.commonPackTexture.y + 275 + heightSoFar,
                `- ${odd}%`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }
            ).setOrigin(0, 0.5);
            heightSoFar += percentageText.displayHeight;
        }

        const packCost = PACK_COST[0];
        //cost
        const commonPackCost = this.add.text(
            this.commonPackTexture.x,
            this.commonPackTexture.y + 315 + heightSoFar,
            `cost: ${packCost}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }
        ).setOrigin(0.5);

        const freeCommonPacks = LOCAL_STORAGE_MANAGER.get('freeCommonPacks');
        let freeText: any;

        // button
        this.commonPackButton = new Button(this, this.commonPackTexture.x, commonPackCost.y + 120, 'buy', null, () => {

            const _freeCommonPacks = LOCAL_STORAGE_MANAGER.get('freeCommonPacks');
            const canBuy = this.onBuy(packCost, 'commonPack', _freeCommonPacks > 0);

            if (!canBuy) return;

            if (_freeCommonPacks > 0) {
                LOCAL_STORAGE_MANAGER.set('freeCommonPacks', _freeCommonPacks - 1);
                freeText.setText(`free x ${+_freeCommonPacks - 1}`);
            }

            if (_freeCommonPacks - 1 === 0) {
                freeText.visible = false;
            }

        }, false, 1);

        if (freeCommonPacks > 0) {
            //free text
            freeText = this.add.text(
                this.commonPackButton.x,
                this.commonPackButton.y,
                `free x ${freeCommonPacks}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#00ff2aff',
                    stroke: '#000000', strokeThickness: 4, letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5).setAlpha(0).setScale(1.5);
            freeText.angle = -25;
            this.tweens.add({
                targets: freeText,
                alpha: 1,
                scale: 1,
                duration: 300,
                delay: 200
            })
        } else {
            this.checkPackAffordable(packCost) ? this.commonPackButton.setInteractive() : this.commonPackButton.disableInteractive();
        }
    }

    private createSilverPack() {
        // title
        const silverPackTitle = this.add.text(
            POSITION_CFG.silverPack.x, POSITION_CFG.silverPack.y,
            `silver pack`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }
        ).setOrigin(0.5);

        // image
        this.silverPackTexture = this.add.image(POSITION_CFG.silverPack.x, POSITION_CFG.silverPack.y + 240, 'silver-pack').setOrigin(0.5).setScale(0.5);

        // monsters count text
        const silverPackMonstersCount = this.add.text(
            this.silverPackTexture.x,
            this.silverPackTexture.y + 215,
            `3 monsters`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 40, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }
        ).setOrigin(0.5);

        let heightSoFar = 0;
        const packData = main_config.packData.silverPack.monsterLevelOdds
        for (let index = 0; index < packData.length; index++) {
            let odd;

            if (index === 0) {
                odd = packData[0]
            } else {
                if (packData[index] === 0) break;
                odd = packData[index] - packData[index - 1]
            }

            let widthSoFar = 0;
            for (let starIndex = 0; starIndex < index + 1; starIndex++) {
                let star = this.add.image(this.silverPackTexture.x - widthSoFar, this.silverPackTexture.y + 275 + heightSoFar, 'star').setOrigin(1, 0.5).setScale(0.3);
                widthSoFar += star.displayWidth;
            }

            // % text
            const percentageText = this.add.text(
                this.silverPackTexture.x,
                this.silverPackTexture.y + 275 + heightSoFar,
                `- ${odd}%`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }
            ).setOrigin(0, 0.5);
            heightSoFar += percentageText.displayHeight;
        }

        const packCost = PACK_COST[1];
        // cost text
        const silverPackCost = this.add.text(
            this.silverPackTexture.x,
            this.silverPackTexture.y + 315 + heightSoFar,
            `cost: ${packCost}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }
        ).setOrigin(0.5);

        const freeSilverPacks = LOCAL_STORAGE_MANAGER.get('freeSilverPacks');
        let freeText: any;

        // button
        this.silverPackButton = new Button(this, this.silverPackTexture.x, silverPackCost.y + 120, 'buy', null, () => {

            const _freeSilverPacks = LOCAL_STORAGE_MANAGER.get('freeSilverPacks');
            const canBuy = this.onBuy(packCost, 'silverPack', _freeSilverPacks > 0);

            if (!canBuy) return;

            if (_freeSilverPacks > 0) {
                LOCAL_STORAGE_MANAGER.set('freeSilverPacks', +_freeSilverPacks - 1);
                freeText.setText(`free x ${+_freeSilverPacks - 1}`);
            }

            if (_freeSilverPacks - 1 === 0) {
                freeText.visible = false;
            }

        }, false, 1);

        if (freeSilverPacks > 0) {
            //free text
            freeText = this.add.text(
                this.silverPackButton.x,
                this.silverPackButton.y,
                `free x ${freeSilverPacks}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#00ff2aff',
                    stroke: '#000000', strokeThickness: 4, letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5).setAlpha(0).setScale(1.5);
            freeText.angle = -25;
            this.tweens.add({
                targets: freeText,
                alpha: 1,
                scale: 1,
                duration: 300,
                delay: 200
            })
        } else {
            this.checkPackAffordable(packCost) ? this.silverPackButton.setInteractive() : this.silverPackButton.disableInteractive();
        }
    }

    private createGoldenrPack() {
        // title
        const goldenPackTitle = this.add.text(
            POSITION_CFG.goldenPack.x, POSITION_CFG.goldenPack.y,
            `golden pack`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }
        ).setOrigin(0.5);

        // image
        this.goldenPackTexture = this.add.image(POSITION_CFG.goldenPack.x, POSITION_CFG.goldenPack.y + 240, 'gold-pack').setOrigin(0.5).setScale(0.5);

        // monsters count text
        const goldenPackMonstersCount = this.add.text(
            this.goldenPackTexture.x,
            this.goldenPackTexture.y + 215,
            `3 monsters`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 40, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }
        ).setOrigin(0.5);

        let heightSoFar = 0;
        const packData = main_config.packData.goldPack.monsterLevelOdds
        for (let index = 0; index < packData.length; index++) {
            let odd;

            if (index === 0) {
                odd = packData[0]
            } else {
                if (packData[index] === 0) break;
                odd = packData[index] - packData[index - 1]
            }

            let widthSoFar = 0;
            for (let starIndex = 0; starIndex < index + 1; starIndex++) {
                let star = this.add.image(this.goldenPackTexture.x - widthSoFar, this.goldenPackTexture.y + 275 + heightSoFar, 'star').setOrigin(1, 0.5).setScale(0.3);
                widthSoFar += star.displayWidth;
            }

            // % text
            const percentageText = this.add.text(
                this.goldenPackTexture.x,
                this.goldenPackTexture.y + 275 + heightSoFar,
                `- ${odd}%`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }
            ).setOrigin(0, 0.5);
            heightSoFar += percentageText.displayHeight;
        }

        const packCost = PACK_COST[2];
        // cost text
        const goldenPackCost = this.add.text(
            this.goldenPackTexture.x,
            this.goldenPackTexture.y + 315 + heightSoFar,
            `cost: ${packCost}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }
        ).setOrigin(0.5);

        const freeGoldPacks = LOCAL_STORAGE_MANAGER.get('freeGoldPacks');
        let freeText: any;

        // button
        this.goldenPackButton = new Button(this, this.goldenPackTexture.x, goldenPackCost.y + 120, 'buy', null, () => {

            const _freeGoldPacks = LOCAL_STORAGE_MANAGER.get('freeGoldPacks');
            const canBuy = this.onBuy(packCost, 'goldPack', _freeGoldPacks > 0);

            if (!canBuy) return;

            if (_freeGoldPacks > 0) {
                LOCAL_STORAGE_MANAGER.set('freeGoldPacks', +_freeGoldPacks - 1)
                freeText.setText(`free x ${+_freeGoldPacks - 1}`);
            }

            if (_freeGoldPacks - 1 === 0) {
                freeText.visible = false;
            }


        }, false, 1);

        if (freeGoldPacks > 0) {
            //free text
            freeText = this.add.text(
                this.goldenPackButton.x,
                this.goldenPackButton.y,
                `free x ${freeGoldPacks}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#00ff2aff',
                    stroke: '#000000', strokeThickness: 4, letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5).setAlpha(0).setScale(1.5);
            freeText.angle = -25;
            this.tweens.add({
                targets: freeText,
                alpha: 1,
                scale: 1,
                duration: 300,
                delay: 200
            })
        } else {
            this.checkPackAffordable(packCost) ? this.goldenPackButton.setInteractive() : this.goldenPackButton.disableInteractive();
        }

    }

    createBackButton() {
        this.backButton = new Button(this, 100, 950, 'button', 'back', () => {
            this.changeScene('MainMenu');
        });
        // this.add.existing(this.backButton);
    }

    createCoins() {
        this.coins = LOCAL_STORAGE_MANAGER.get('coins');
        this.coinText = this.add.text(
            1900,
            30,
            `${this.coins}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(1, 0.5);
        this.coinTexture = this.add.image(this.coinText.x - this.coinText.displayWidth, 30, 'coin').setScale(0.35).setOrigin(1, 0.5);
        this.gems = LOCAL_STORAGE_MANAGER.get('gems').toString();
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

    private onBuy(cost: number, packName: PackName, isFree: boolean = false) {

        this.overlay = this.add.image(0, 0, 'black-overlay').setScale(192, 108).setOrigin(0).setAlpha(0);
        this.overlay.setInteractive();

        this.overlay.on('pointerdown', function (pointer: any) {
            pointer.event.stopPropagation();
        });
        console.log(LOCAL_STORAGE_MANAGER.get('playerMonstersData'))
        const playerMonstersCount = LOCAL_STORAGE_MANAGER.get('playerMonstersData').length;
        if (playerMonstersCount >= main_config.maxMonstersAllowedInDeck - 2) {

            const msg = this.add.text(
                960,
                540,
                `${main_config.maxMonstersAllowedInDeck} monsters maximum allowed, sell some monsters!`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4, wordWrap: { width: 700 },
                    align: 'center'
                }
            ).setOrigin(0.5).setAlpha(0);

            this.tweens.chain({
                tweens: [
                    {
                        targets: this.overlay,
                        duration: 500,
                        alpha: 0.9
                    },
                    {
                        targets: msg,
                        duration: 350,
                        alpha: 1
                    }
                ]
            })

            this.time.delayedCall(4000, () => {
                this.tweens.chain({
                    tweens: [
                        {
                            targets: msg,
                            duration: 500,
                            alpha: 0
                        },
                        {
                            targets: this.overlay,
                            duration: 350,
                            alpha: 0,
                            onComplete: () => {
                                this.overlay?.destroy(true);
                                msg.destroy(true);
                            }
                        }
                    ]
                })
            })
            return false;
        } else {
            this.createMonsters(packName);
            this.tweens.chain({
                tweens: [
                    {
                        targets: this.overlay,
                        duration: 500,
                        alpha: 0.9
                    },
                    {
                        targets: this.monsters,
                        scale: 1.5,
                        duration: 350,
                        alpha: 1,
                        onComplete: () => {
                            this.addClaimButton();
                        }
                    }
                ]
            })

            if (!isFree) {
                // UPDATE PLAYER COINS(LOCALE STORAGE) 
                const playerCoins = LOCAL_STORAGE_MANAGER.get('coins');
                this.coins = +playerCoins - +cost;
                LOCAL_STORAGE_MANAGER.set('coins', this.coins);
                this.updateCoinsText(`${this.coins}`);
            }

            // // ADDING NEW MONSTER REWARD TO THE PLAYER DESK(LOCALE STORAGE )
            this.addNewMonsters();
            return true;
        }
    }

    private updateCoinsText(value: number | string) {
        this.coinText.setText(`${value}`);
        this.coinTexture.x = this.coinText.x - this.coinText.width;
    }

    private addNewMonsters() {
        const STORAGE_KEY = 'playerMonstersData';
        const storedData = LOCAL_STORAGE_MANAGER.get(STORAGE_KEY);
        const dataArray = storedData ? storedData : [];
        this.monsters.forEach(element => {
            const newObject = { type: +element.unitData.type, stars: +element.unitData.stars, row: NaN, col: 11 };
            dataArray.push(newObject);
        });
        LOCAL_STORAGE_MANAGER.set(STORAGE_KEY, dataArray);
    }

    private addClaimButton() {
        this.claimButton = new Button(this, 960, 900, 'claim', null, () => {
            this.claimButton?.disableInteractive();
            this.hideRewards();
        }, true, 1);
        this.claimButton.setAlpha(0);
        this.tweens.add({
            targets: this.claimButton,
            alpha: 1,
            duration: 750,
            delay: 450,
            onComplete: () => {
                this.claimButton!.setInteractive();
            }
        })
    }

    private hideRewards() {
        LOCAL_STORAGE_MANAGER.get('freeCommonPacks')
        this.checkPackAffordable(PACK_COST[0]) || LOCAL_STORAGE_MANAGER.get('freeCommonPacks') > 0 ? this.commonPackButton.setInteractive() : this.commonPackButton.disableInteractive();
        this.checkPackAffordable(PACK_COST[1]) || LOCAL_STORAGE_MANAGER.get('freeSilverPacks') > 0 ? this.silverPackButton.setInteractive() : this.silverPackButton.disableInteractive();
        this.checkPackAffordable(PACK_COST[2]) || LOCAL_STORAGE_MANAGER.get('freeGoldPacks') > 0 ? this.goldenPackButton.setInteractive() : this.goldenPackButton.disableInteractive();

        this.tweens.chain({
            tweens: [
                {
                    targets: this.monsters,
                    duration: 250,
                    scale: 0
                },
                {
                    targets: this.claimButton,
                    duration: 250,
                    alpha: 0
                },
                {
                    targets: this.overlay,
                    duration: 300,
                    alpha: 0,
                    onComplete: () => {
                        this.monstersContainer.list.forEach(element => {
                            element.destroy(true);
                        });
                        this.monsters = [];
                        this.overlay!.destroy(true);
                        this.overlay = null;
                        this.claimButton!.destroy(true);
                        this.claimButton = null;
                    }
                }
            ]
        })
    }

    private createMonsters(packName: PackName) {
        const monstersCount = 3;
        const rewardsCfg: IOpponentMonstersData[] = this.getRandomMonstersReward(packName, monstersCount);
        for (let index = 0; index < monstersCount; index++) {
            const newMonsterType = rewardsCfg[index].type;
            const newMonsterStars = rewardsCfg[index].stars;
            const config = getMonsterDataConfig(newMonsterType, newMonsterStars - 1);
            const x = [460, 960, 1460];
            const newMonster = new Monster(this, x[index], 540, MONSTER_SIZE, MONSTER_SIZE, config, 0, true).setAlpha(0).setScale(2);
            newMonster.starsContainer.x = MONSTER_SIZE / -4 + 10;
            newMonster.movesLeftContainer.x = MONSTER_SIZE / 2 + 10;
            this.monstersContainer.add(newMonster);
            this.monsters.push(newMonster)
        }
    }

    private getRandomMonstersReward(packName: PackName, monstersCount: number): IOpponentMonstersData[] {

        const _packName: PackName = packName;
        const odds = main_config.packData[_packName].monsterLevelOdds;
        const monsterDataArr = [];

        for (let monsterDataIndex = 0; monsterDataIndex < monstersCount; monsterDataIndex++) {
            const rndMonsterType = getRandomMonsterType();
            let rndMonsterStar = NaN;
            const randomNumber = Phaser.Math.RND.between(1, 100);
            for (let index = 0; index < odds.length; index++) {
                const odd = odds[index];
                if (randomNumber <= odd) {
                    rndMonsterStar = index + 1;
                    break;
                }
            }
            monsterDataArr.push(
                {
                    type: rndMonsterType,
                    stars: rndMonsterStar
                }
            );
        }
        return monsterDataArr;
    }

    private checkPackAffordable(cost: number) {
        return +this.coins >= cost;
    }
}
