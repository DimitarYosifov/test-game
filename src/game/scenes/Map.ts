import { Scene } from 'phaser';
import { MainMenuLevelConfirm } from './in-main-menu/MainMenuLevelConfirm';
import { ILevelConfig, level_config } from '../configs/level_config';
import { Button } from './in-main-menu/Button';
import { AbstractScene } from './AbstractScene';

export class Map extends AbstractScene {
    confirmPopupOpen: boolean;
    coinTexture: Phaser.GameObjects.Image;
    coinText: Phaser.GameObjects.Text;
    coins: string | null;
    backButton: Button;
    levelConfirm: MainMenuLevelConfirm;
    spots: { x: number, y: number }[];
    dots: Phaser.GameObjects.Graphics[];
    player: Phaser.GameObjects.Image;
    levelContentContainer: Phaser.GameObjects.Container;
    playerDotSpot: number;


    constructor() {
        super('Map');
    }

    create() {
        super.create();

        this.spots = [];
        this.dots = [];
        this.levelContentContainer = new Phaser.GameObjects.Container(this, 0, 0).setDepth(101);
        this.add.existing(this.levelContentContainer);


        const points = [
            { x: 100, y: 750 },
            { x: 120, y: 675 },
            { x: 140, y: 600 },
            { x: 120, y: 525 },

            { x: 100, y: 450 },
            { x: 100, y: 375 },
            { x: 120, y: 300 },
            { x: 140, y: 225 },

            { x: 160, y: 150 },
            { x: 180, y: 75 },
            { x: 260, y: 50 },
            { x: 340, y: 75 },

            { x: 360, y: 150 },
            { x: 420, y: 205 },
            { x: 495, y: 240 },
            { x: 570, y: 205 },

            { x: 620, y: 145 },
            { x: 700, y: 125 },
            { x: 750, y: 190 },
            { x: 695, y: 250 },

            { x: 645, y: 310 },
            { x: 655, y: 390 },
            { x: 645, y: 470 },
            { x: 625, y: 550 },

            { x: 535, y: 560 },
            { x: 470, y: 500 },
            { x: 470, y: 410 },
            { x: 410, y: 340 },

            { x: 320, y: 320 },
            { x: 245, y: 375 },
            { x: 255, y: 460 },
            { x: 280, y: 545 },

            { x: 295, y: 630 },
            { x: 280, y: 715 },
            { x: 265, y: 800 },
            { x: 280, y: 875 },

            { x: 350, y: 890 },


        ];

        for (let index = 0; index < points.length; index++) {
            const spot = points[index];
            const graphics = this.add.graphics();
            graphics.lineStyle(3, 0xffffff);
            graphics.strokeCircle(spot.x, spot.y, 8);
            this.dots.push(graphics);
            this.levelContentContainer.add(graphics)
            this.spots.push(spot);
        }

        this.createPlayer();
        this.createBackButton();
        this.createLevels();
        this.createCoins();
    }

    private createPlayer() {
        this.player = this.add.image(0, 0, 'location').setScale(1).setOrigin(0.5, 1).setAlpha(0).setDepth(99);
    }

    private createBackButton() {
        this.backButton = new Button(this, 100, 950, 'back-btn', () => {
            this.confirmPopupOpen = false;
            this.changeScene('MainMenu');
        });
        this.add.existing(this.backButton);
    }

    private createLevels(): void {

        const mapLevel = localStorage.getItem('mapLevel') || 1;
        const currentLevel = localStorage.getItem('currentLevel') || 0;

        level_config.forEach((levelData: ILevelConfig, index: number) => {

            const levelTexture = this.add.image(this.spots[index * 4].x, this.spots[index * 4].y, 'lvl-plate').setScale(0.5).setOrigin(0.5).setDepth(this.player.depth - 1);

            const mapDot = this.spots[index * 4];
            this.dots[index * 4].setVisible(false);
            const leveltext: Phaser.GameObjects.Text = this.add.text(
                mapDot.x,
                mapDot.y,
                `${levelData.levelName}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 33, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4, strokeThickness: 3,
                    align: 'center'
                }).setOrigin(0.5).setDepth(this.player.depth - 1);

            this.levelContentContainer.add([levelTexture, leveltext]);
            if (levelData.levelName <= +mapLevel) {
                levelTexture.setInteractive();
            } else {
                levelTexture.disableInteractive();
                levelTexture.setAlpha(0.65);
                leveltext.setAlpha(0.65);
            }


            if (levelData.levelName === +currentLevel) {
                //PLAYER IS HERE
                this.player.setAlpha(1).setPosition(mapDot.x, mapDot.y);
                this.playerDotSpot = index * 4;
                // this.levelContentContainer.add(this.player);
            }


            levelTexture.on('pointerdown', () => {
                if (this.confirmPopupOpen) {
                    return;
                }

                this.confirmPopupOpen = true;

                const onMoveComplete = () => {
                    this.levelConfirm = new MainMenuLevelConfirm(this, 0, 0, levelData);
                    this.levelContentContainer.add([this.levelConfirm]);

                    this.levelConfirm.once('level-selected', (level: number) => {
                        localStorage.setItem('currentLevel', JSON.stringify(level));
                        this.confirmPopupOpen = false;
                        this.levelConfirm.removeAllListeners();
                        this.levelConfirm.destroy(true);
                        this.changeScene('Game');
                    }, this);

                    this.levelConfirm.once('level-unselected', () => {
                        this.levelConfirm.removeAllListeners();
                        this.levelConfirm.destroy(true);
                        this.confirmPopupOpen = false;
                    }, this);
                }

                if (currentLevel === 0) {
                    if (this.player.alpha !== 0) {
                        onMoveComplete();
                        return;
                    }
                    const initialScale = this.player.scale;
                    this.player.scale = initialScale * 2;
                    this.player.setPosition(this.spots[0].x, this.spots[0].y);
                    this.tweens.add({
                        targets: this.player,
                        alpha: 1,
                        scale: initialScale,
                        duration: 350,
                        onComplete: () => {
                            this.time.delayedCall(750, () => {
                                onMoveComplete();
                            })
                        }
                    });

                } else {
                    this.movePlayerToLevel(index * 4, () => {
                        onMoveComplete();
                    });
                }
            });
        });

        this.levelContentContainer.add(this.player);
        if (currentLevel === 0) {
            this.player.setAlpha(0);
        }
    }

    private movePlayerToLevel(newSpotIndex: number, onLevelReached: Function) {
        console.log(`new level is ${newSpotIndex}`)
        console.log(`playerDotSpot is ${this.playerDotSpot}`);

        let currentSpot = this.playerDotSpot;
        const targetSpot = newSpotIndex;
        if (currentSpot === targetSpot) {
            onLevelReached();
            return;
        }

        const increase = newSpotIndex > currentSpot;
        const duration = 300;
        const moveToNext = () => {
            increase ? currentSpot++ : currentSpot--;
            const initialScale = this.player.scale;
            this.tweens.add({
                targets: this.player,
                scale: {
                    value: initialScale * 1.1,
                    yoyo: true,
                    duration: duration / 2
                },
                duration,
                x: this.spots[currentSpot].x,
                y: this.spots[currentSpot].y,
                onComplete: () => {
                    if (currentSpot === targetSpot) {
                        this.playerDotSpot = currentSpot;
                        onLevelReached();
                    }
                    else {
                        moveToNext();
                    }
                }
            })
        }
        moveToNext();
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

    changeScene(nextScene: string): void {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(nextScene);
        });
    }

}
