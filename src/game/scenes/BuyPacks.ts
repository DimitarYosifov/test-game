import { monsters_power_config } from '../configs/monsters_power_config';
import { AbstractScene } from './AbstractScene';
import { Monster } from './in-game/Monster';
import { Button } from './in-main-menu/Button';

const MONSTER_SIZE = 200;
const POSITION_CFG = {
    commonPack: {
        x: 400,
        y: 175
    },
    silverPack: {
        x: 960,
        y: 175
    },
    goldenPack: {
        x: 1520,
        y: 175
    }
}

export class BuyPacks extends AbstractScene {
    commonPackButton: Button;
    commonPackTexture: Phaser.GameObjects.Image;
    silverPackTexture: Phaser.GameObjects.Image;
    silverPackButton: Button;
    goldenPackTexture: Phaser.GameObjects.Image;
    goldenPackButton: Button;
    backButton: Button;
    coins: string;
    coinText: Phaser.GameObjects.Text;
    coinTexture: Phaser.GameObjects.Image;
    monstersContainer: Phaser.GameObjects.Container;
    monsters: Monster[];
    overlay: Phaser.GameObjects.Image | null;
    claimButton: Button | null;

    constructor() {
        super('BuyPacks');
    }

    create() {
        super.create();
        this.monstersContainer = this.add.container(0, 0).setDepth(100).setAlpha(1);
        this.monsters = [];
        this.createCommonPack();
        this.createSilverPack();
        this.createGoldenrPack();
        this.createBackButton();
        this.createCoins();

        //TODO - check if pack is affordable on create and AFTER purchase!

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


        const packCost = 45;
        //cost
        const commonPackCost = this.add.text(
            this.commonPackTexture.x,
            this.commonPackTexture.y + 245,
            `cost: ${packCost}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }
        ).setOrigin(0.5);

        // button
        this.commonPackButton = new Button(this, this.commonPackTexture.x, this.commonPackTexture.y + 390, 'buy', () => {
            this.onBuy(packCost);
        }, false, 1);
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

        const packCost = 85;
        // cost text
        const silverPackCost = this.add.text(
            this.silverPackTexture.x,
            this.silverPackTexture.y + 245,
            `cost: ${packCost}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }
        ).setOrigin(0.5);

        // button
        this.silverPackButton = new Button(this, this.silverPackTexture.x, this.silverPackTexture.y + 390, 'buy', () => {
            this.onBuy(packCost);
        }, false, 1);
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

        const packCost = 125;
        // cost text
        const goldenPackCost = this.add.text(
            this.goldenPackTexture.x,
            this.goldenPackTexture.y + 245,
            `cost: ${packCost}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }
        ).setOrigin(0.5);

        // button
        this.goldenPackButton = new Button(this, this.goldenPackTexture.x, this.goldenPackTexture.y + 390, 'buy', () => {
            this.onBuy(packCost);
        }, false, 1);
    }

    private createBackButton() {
        this.backButton = new Button(this, 100, 950, 'back-btn', () => {
            this.changeScene('MainMenu');
        });
        // this.add.existing(this.backButton);
    }

    private createCoins() {
        this.coins = localStorage.getItem('coins') || '0';
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
    }

    private onBuy(cost: number) {
        this.overlay = this.add.image(0, 0, 'black-overlay').setScale(192, 108).setOrigin(0).setAlpha(0);
        this.overlay.setInteractive();
        this.createMonsters();
        this.overlay.on('pointerdown', function (pointer: any) {
            pointer.event.stopPropagation();
        });

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

        // alert('TODO')
        // UPDATE PLAYER COINS(LOCALE STORAGE) 
        const playerCoins = localStorage.getItem('coins') || '0';
        const coinAfterPurchase = +playerCoins - +cost;
        localStorage.setItem('coins', JSON.stringify(coinAfterPurchase));
        this.coinText.setText(`${coinAfterPurchase}`);

        // // ADDING NEW MONSTER REWARD TO THE PLAYER DESK(LOCALE STORAGE )
        this.addNewMonsters();
    }

    private addNewMonsters() {
        const STORAGE_KEY = 'playerMonstersData';
        const storedData = localStorage.getItem(STORAGE_KEY);
        const dataArray = storedData ? JSON.parse(storedData) : [];
        this.monsters.forEach(element => {
            const newObject = { type: element.unitData.type, stars: element.unitData.stars, row: NaN, col: 11 };
            dataArray.push(newObject);
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataArray));
    }

    private addClaimButton() {
        this.claimButton = new Button(this, 960, 900, 'claim', () => {
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

    private createMonsters(): any {
        const rewardsCfg = [
            {
                type: 9, stars: 1
            },
            {
                type: 8, stars: 1
            },
            {
                type: 2, stars: 2
            },
        ]

        const monstersCount = 3;

        for (let index = 0; index < monstersCount; index++) {
            const newMonsterType = rewardsCfg[index].type;
            const newMonsterStars = rewardsCfg[index].stars;
            const config = { ...(monsters_power_config as any)[newMonsterType][newMonsterStars - 1] };
            const x = [460, 960, 1460];
            const newMonster = new Monster(this, x[index], 540, MONSTER_SIZE, MONSTER_SIZE, config, 0, true).setAlpha(0).setScale(2);
            newMonster.starsContainer.x = MONSTER_SIZE / -4 + 10;
            newMonster.movesLeftContainer.x = MONSTER_SIZE / 2 + 10;
            this.monstersContainer.add(newMonster);
            this.monsters.push(newMonster)
        }
    }
}
