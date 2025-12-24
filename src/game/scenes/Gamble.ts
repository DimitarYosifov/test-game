import { getAllMonsterTypes, getMonsterDataConfig, main_config } from '../configs/main_config';
import { LOCAL_STORAGE_MANAGER } from '../LOCAL_STORAGE_MANAGER';
import { AbstractScene } from './AbstractScene';
import { Monster } from './in-game/Monster';
import { Button } from './in-main-menu/Button';

const SPIN_SPEED = 25
const REWARDS = [...getAllMonsterTypes(), 'gem', 'coin']
const MONSTER_SIZE = 200;

export class Gamble extends AbstractScene {
    private shouldSpin: boolean;
    private spinSpeed: { speed: number } = { speed: 0 };
    private spinFinished: boolean;
    private winningSymbols: string[];
    private reel1: Phaser.GameObjects.Container;
    private reel2: Phaser.GameObjects.Container;
    private reel3: Phaser.GameObjects.Container;
    private reels: { monster1: Phaser.GameObjects.Image; monster2: Phaser.GameObjects.Image; }[];
    private isWinningSpin: boolean;
    private gemsToBeWonText: Phaser.GameObjects.Text;
    private coinsToBeWonText: Phaser.GameObjects.Text;
    private stars: Phaser.GameObjects.Image[];
    private updateRewardsEvent: Phaser.Time.TimerEvent | null;
    private coinsToBeWon: number;
    private gemsToBeWon: number;
    private monsterStarsToBeWon: number;
    private backButton: Button;
    private spinButton: Button;
    private coinText: Phaser.GameObjects.Text;
    private coinTexture: Phaser.GameObjects.Image;
    private gemsText: Phaser.GameObjects.Text;
    private gems: string;
    private gemsTexture: Phaser.GameObjects.Image;
    private slowDownEvent: Phaser.Time.TimerEvent | null;
    private slowDownTween: Phaser.Tweens.Tween | null;
    private autoButton: Phaser.GameObjects.Image;
    private autoText: Phaser.GameObjects.Text;
    private isInAutoMode: boolean = false;
    private playerCoins: number;

    constructor() {
        super('Gamble');
    }

    create() {

        this.add.image(0, 0, 'bg-casino').setOrigin(0);

        this.reel1 = this.add.container(600, 540);
        this.reel2 = this.add.container(960, 540);
        this.reel3 = this.add.container(1320, 540);
        this.createHeader();
        this.createReels();
        this.createGemsSection();
        this.createCoinsSection();
        this.createStarsSection();
        this.createBackButton();
        this.createSpinButton();
        this.createAutoButton();
        this.createCoins();
        this.checkSpinAffordable();
        this.shouldSpin = false;
        this.spinFinished = true;

        // this.spin();
    }

    private checkSpinAffordable() {
        this.playerCoins = LOCAL_STORAGE_MANAGER.get('coins');
        if (this.playerCoins < main_config.slotSpinCost) {
            this.spinButton.disableInteractive();
            this.isInAutoMode = false;
            return false;
        }
        return true;
    }

    private createHeader() {
        const header = this.add.text(
            960,
            130,
            `test your luck only for ${main_config.slotSpinCost}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 90, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4, strokeThickness: 4,
                align: 'center'
            }).setOrigin(0.5, 0.5).setName('header');
        const coins = this.add.image(header.x + header.displayWidth / 2, header.y + 10, 'coin').setScale(0.5).setOrigin(0, 0.5);

    }

    private createReels() {
        this.reels = [
            {
                monster1: this.add.image(0, -250, Phaser.Math.RND.pick(getAllMonsterTypes())).setOrigin(0.5),
                monster2: this.add.image(0, 0, Phaser.Math.RND.pick(getAllMonsterTypes())).setOrigin(0.5)
            },
            {
                monster1: this.add.image(0, -250, Phaser.Math.RND.pick(getAllMonsterTypes())).setOrigin(0.5),
                monster2: this.add.image(0, 0, Phaser.Math.RND.pick(getAllMonsterTypes())).setOrigin(0.5)
            },
            {
                monster1: this.add.image(0, -250, Phaser.Math.RND.pick(getAllMonsterTypes())).setOrigin(0.5),
                monster2: this.add.image(0, 0, Phaser.Math.RND.pick(getAllMonsterTypes())).setOrigin(0.5)
            }
        ]

        this.reel1.add([
            this.reels[0].monster1,
            this.reels[0].monster2,
            this.add.image(0, 0, 'slot-circle').setOrigin(0.5).setScale(0.95),
        ]);
        const shape1 = this.make.graphics();
        shape1.fillStyle(0xffffff);
        shape1.fillCircle(this.reel1.x, this.reel1.y, 150);
        const mask1 = shape1.createGeometryMask();
        this.reel1.setMask(mask1);

        this.reel2.add([
            this.reels[1].monster1,
            this.reels[1].monster2,
            this.add.image(0, 0, 'slot-circle').setOrigin(0.5).setScale(0.95),
        ]);
        const shape2 = this.make.graphics();
        shape2.fillStyle(0xffffff);
        shape2.fillCircle(this.reel2.x, this.reel2.y, 150);
        const mask2 = shape2.createGeometryMask();
        this.reel2.setMask(mask2);

        this.reel3.add([
            this.reels[2].monster1,
            this.reels[2].monster2,
            this.add.image(0, 0, 'slot-circle').setOrigin(0.5).setScale(0.95),
        ]);
        const shape3 = this.make.graphics();
        shape3.fillStyle(0xffffff);
        shape3.fillCircle(this.reel3.x, this.reel3.y, 150);
        const mask3 = shape3.createGeometryMask();
        this.reel3.setMask(mask3);
    }

    private createGemsSection() {
        const gem = this.add.image(700, 300, 'gem').setScale(0.2).setOrigin(0.5);
        this.gemsToBeWonText = this.add.text(
            gem.x + gem.displayWidth / 2,
            gem.y,
            `10`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 60, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4, strokeThickness: 4,
                align: 'center'
            }).setOrigin(0, 0.5).setName('gemsText');
    }

    private createCoinsSection() {
        const coins = this.add.image(1100, 300, 'coin').setScale(0.5).setOrigin(0.5);
        this.coinsToBeWonText = this.add.text(
            coins.x + coins.displayWidth / 2,
            coins.y,
            `500`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 60, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4, strokeThickness: 4,
                align: 'center'
            }).setOrigin(0, 0.5).setName('coinsToBeWonText');
    }

    private createStarsSection() {
        this.stars = [
            this.add.image(900, 750, 'star').setScale(0.5).setOrigin(0.5),
            this.add.image(960, 750, 'star').setScale(0.5).setOrigin(0.5),
            this.add.image(1020, 750, 'star').setScale(0.5).setOrigin(0.5)
        ]
    }

    private spin() {
        this.spinSpeed.speed = SPIN_SPEED;
        this.updateCoinsText();
        this.winningSymbols = [Phaser.Math.RND.pick(REWARDS), Phaser.Math.RND.pick(REWARDS), Phaser.Math.RND.pick(REWARDS)];
        // this.winningSymbols = ['gem', 'gem', 'gem']; //// test
        this.isWinningSpin = this.winningSymbols[0] === this.winningSymbols[1] && this.winningSymbols[0] === this.winningSymbols[2];
        this.shouldSpin = true;
        this.spinFinished = false;

        if (this.isInAutoMode) {
            this.backButton.disableInteractive();
            this.spinButton.disableInteractive();
            this.time.delayedCall(250, () => {
                this.updateRewards();
                this.shouldSpin = false;
                this.skip();
                this.spinButton.disableInteractive();
            })
            return;
        }

        this.slowDownEvent = this.time.delayedCall(2500, () => {
            this.slowDownEvent?.destroy();
            this.slowDownEvent = null;
            this.slowDown();
        })

        this.updateRewardsEvent = this.time.addEvent({
            delay: 100,
            loop: true,
            callback: () => {
                this.updateRewards();
            }
        });
        this.enableStop();
    }

    private updateRewards() {
        this.coinsToBeWon = Phaser.Math.RND.between(main_config.slotCoins.min, main_config.slotCoins.max);
        this.gemsToBeWon = Phaser.Math.RND.between(main_config.slotGems.min, main_config.slotGems.max);
        this.monsterStarsToBeWon = Phaser.Math.RND.between(main_config.slotMonsterStars.min, main_config.slotMonsterStars.max);

        this.coinsToBeWonText.setText(`${this.coinsToBeWon}`);
        this.gemsToBeWonText.setText(`${this.gemsToBeWon}`);
        this.stars[0].alpha = 1;
        this.stars[1].alpha = this.monsterStarsToBeWon > 1 ? 1 : 0.45;
        this.stars[2].alpha = this.monsterStarsToBeWon > 2 ? 1 : 0.45;
    }

    skip() {
        if (this.slowDownEvent) {
            this.slowDownEvent.remove();
            this.slowDownEvent = null;
        }

        if (this.slowDownTween) {
            this.slowDownTween.destroy();
            this.slowDownTween = null;
        }

        this.spinSpeed.speed = 100;
        this.shouldSpin = false;
    }

    private spinComplete() {
        if (this.updateRewardsEvent) {
            this.updateRewardsEvent.destroy();
            this.updateRewardsEvent = null;
        };
        if (this.isWinningSpin) {
            this.isInAutoMode = false;
            this.autoButton.setTexture('off');
            if (this.winningSymbols[0] === 'coin') {
                this.onCoinsWin();
            } else if (this.winningSymbols[0] === 'gem') {
                this.onGemsWin();
            } else {
                this.onMonsterWin();
            }
        } else {
            if (this.isInAutoMode && this.checkSpinAffordable()) {
                this.time.delayedCall(250, () => {
                    this.spin();
                })
            } else {
                this.reset();
            }
        }
    }

    private onCoinsWin() {
        let emitted = 0;
        let coins = LOCAL_STORAGE_MANAGER.get('coins');
        const finalCoinsAmount = +coins + this.coinsToBeWon;
        LOCAL_STORAGE_MANAGER.set('coins', finalCoinsAmount);

        let emitter = this.add.particles(0, 0, 'coin', {
            x: { start: this.coinsToBeWonText.x - 30, end: this.coinText.x, ease: 'sine.in' },
            y: { start: this.coinsToBeWonText.y, end: this.coinText.y },
            frequency: 50,
            lifespan: 1000,
            maxParticles: this.coinsToBeWon,
            quantity: 10,
            scale: { start: 0.5, end: 0.25 },
            emitCallback: () => {
                emitted++;
                if (emitted >= this.coinsToBeWon) {
                    emitter.stop();

                    this.time.delayedCall(1250, () => {
                        this.coinText.setText(`${finalCoinsAmount}`);
                        emitter.destroy(true);
                        this.reset();
                    })
                }
            },
            deathCallback: () => {

            },
            emitCallbackScope: this
        })
    }

    private onGemsWin() {
        let emitted = 0;
        let emitter = this.add.particles(0, 0, 'gem', {
            x: { start: this.gemsToBeWonText.x - 75, end: this.gemsText.x, ease: 'sine.in' },
            y: { start: this.gemsToBeWonText.y, end: this.gemsText.y },
            frequency: 250,
            lifespan: 1000,
            maxParticles: this.gemsToBeWon,
            quantity: 1,
            scale: { start: 0.2, end: 0.1 },
            emitCallback: () => {
                emitted++;
                if (emitted >= this.gemsToBeWon) {
                    emitter.stop();
                    this.time.delayedCall(1000, () => {
                        emitter.destroy(true);
                        this.reset();
                    })
                }
            },
            deathCallback: () => {
                LOCAL_STORAGE_MANAGER.set('gems', +this.gems + 1);
                this.gems = LOCAL_STORAGE_MANAGER.get('gems').toString();
                this.gemsText.setText(`${this.gems}`);
            },
            emitCallbackScope: this
        })
    }

    private onMonsterWin() {
        const newMonsterType = this.winningSymbols[0];
        const newMonsterStars = this.monsterStarsToBeWon;

        // create new card
        let overlay = this.add.image(0, 0, 'black-overlay').setScale(192, 108).setOrigin(0).setAlpha(0);
        overlay.setInteractive();
        overlay.on('pointerdown', function (pointer: any) {
            pointer.event.stopPropagation();
        });
        const config = getMonsterDataConfig(+newMonsterType, newMonsterStars - 1);
        const newMonster = new Monster(this, 960, 540, MONSTER_SIZE, MONSTER_SIZE, config, 0, true).setAlpha(0).setDepth(100);
        this.add.existing(newMonster);
        newMonster.starsContainer.x = MONSTER_SIZE / -4 + 10;
        newMonster.movesLeftContainer.x = MONSTER_SIZE / 2 + 10;

        const addMonster = (type: number, stars: number) => {
            const STORAGE_KEY = 'playerMonstersData';
            const storedData = LOCAL_STORAGE_MANAGER.get(STORAGE_KEY);
            const dataArray = storedData ? storedData : [];
            const newObject = { type, stars, row: NaN, col: 11 };
            dataArray.push(newObject);
            LOCAL_STORAGE_MANAGER.set(STORAGE_KEY, dataArray);
        }

        addMonster(+newMonsterType, newMonsterStars);

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
                        newMonster.setScale(3);
                    }
                },
                {
                    targets: [overlay, newMonster],
                    duration: 200,
                    alpha: 0,
                    delay: 2750,
                    onComplete: () => {
                        overlay.destroy(true);
                        newMonster.destroy(true);
                        this.reset();
                    }
                },
            ]
        })
    }

    private reset() {
        this.backButton.setInteractive();
        this.spinButton.setInteractive();
        this.spinButton.text.setText('spin');
        this.checkSpinAffordable();
    }

    private enableStop() {
        this.backButton.disableInteractive();
        this.spinButton.text.setText('stop');
        this.spinButton.setInteractive();
    }

    private disableStop() {
        this.backButton.disableInteractive();
        this.spinButton.disableInteractive();
    }

    private slowDown() {
        this.slowDownTween = this.tweens.add({
            targets: this.spinSpeed,
            speed: 5,
            duration: 3500,
            onComplete: () => {
                this.shouldSpin = false;
            }
        })
    }

    update(time: number, delta: number): void {
        if (this.spinFinished) {
            return;
        }

        this.reels.forEach((element, index) => {
            const monster1 = element.monster1;
            const monster2 = element.monster2;
            monster1.y += this.spinSpeed.speed;
            if (monster1.y >= 250) {
                monster1.y = (250 - (monster1.y - 250)) * -1;
                const randomMonster = Phaser.Math.RND.pick(REWARDS);
                monster1.setTexture(randomMonster);
                if (randomMonster === 'coin') {
                    monster1.setScale(1.7);
                } else if (randomMonster === 'gem') {
                    monster1.setScale(0.4);
                } else {
                    monster1.setScale(1);
                }
                if (!this.shouldSpin) {
                    this.spinFinished = true;
                    monster1.y = -250;
                    monster2.y = 0;
                    monster2.setTexture(this.winningSymbols[index]); //??????
                    if (monster2.texture.key === 'coin') {
                        monster2.setScale(1.7);
                    } else if (monster2.texture.key === 'gem') {
                        monster2.setScale(0.4);
                    } else {
                        monster2.setScale(1);
                    }
                    if (index === 2) {
                        this.spinComplete();
                    }
                    return;
                }
            }

            monster2.y += this.spinSpeed.speed;
            if (monster2.y >= 250) {
                monster2.y = (250 - (monster2.y - 250)) * -1;
                if (!this.shouldSpin) {
                    monster2.setTexture(this.winningSymbols[index]);
                } else {
                    const randomMonster = Phaser.Math.RND.pick(REWARDS);
                    monster2.setTexture(randomMonster);
                }
                if (monster2.texture.key === 'coin') {
                    monster2.setScale(1.7);
                } else if (monster2.texture.key === 'gem') {
                    monster2.setScale(0.4);
                } else {
                    monster2.setScale(1);
                }
            }
        });
    }

    changeScene(nextScene: string): void {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(nextScene);
        });
    }

    private createSpinButton(): void {
        this.spinButton = new Button(this, 1800, 970, 'button', 'spin', () => {
            if (this.spinFinished) {
                this.spin();
            } else {
                this.skip();
                this.spinButton.disableInteractive();
            }
        });
    }


    private toggleAutoMode() {
        this.isInAutoMode = !this.isInAutoMode;
        const texture = this.isInAutoMode ? 'on' : 'off';
        this.autoButton.setTexture(texture);
    }

    private createAutoButton(): void {
        this.autoButton = this.add.image(1800, 830, 'off').setScale(0.35).setOrigin(0.5);
        this.autoButton.setInteractive();
        this.autoButton.on('pointerdown', () => {
            this.toggleAutoMode();
        });
        this.autoText = this.add.text(
            1740,
            825,
            `auto`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(1, 0.5);
    }

    createBackButton(): void {
        this.backButton = new Button(this, 100, 950, 'button', 'back', () => {
            this.changeScene('MainMenu');
        });
    }

    createCoins(): void {
        const coins = LOCAL_STORAGE_MANAGER.get('coins');
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

    private updateCoinsText() {
        this.playerCoins = +(LOCAL_STORAGE_MANAGER.get('coins'));
        this.playerCoins -= main_config.slotSpinCost;
        LOCAL_STORAGE_MANAGER.set('coins', this.playerCoins);
        this.coinText.setText(`${this.playerCoins}`);
        this.coinTexture.x = this.coinText.x - this.coinText.width;
        this.gemsText.x = this.coinTexture.x - this.coinTexture.displayWidth - 20;
        this.gemsTexture.x = this.gemsText.x - this.gemsText.displayWidth;
    }
}
