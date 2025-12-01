import { MainMenuLevelConfirm } from './in-main-menu/MainMenuLevelConfirm';
import { ILevelConfig, level_config, survivalLevelsWorld1, survivalLevelsWorld2 } from '../configs/level_config';
import { Button } from './in-main-menu/Button';
import { AbstractScene } from './AbstractScene';
import { world1points } from './in-map/world_1_points';
import { world2points } from './in-map/world_2_points';
import { SpriteAnimation } from './SpriteAnimation';

export class Map extends AbstractScene {
    confirmPopupOpen: boolean;
    coinTexture: Phaser.GameObjects.Image;
    coinText: Phaser.GameObjects.Text;
    coins: string | null;
    backButton: Button;
    levelConfirm: MainMenuLevelConfirm;
    spots: { x: number, y: number }[];
    survival1Spots: { x: number, y: number }[];
    dots: Phaser.GameObjects.Graphics[];
    survivalLeveldots: Phaser.GameObjects.Graphics[];
    player: Phaser.GameObjects.Image;
    levelContentContainer: Phaser.GameObjects.Container;
    playerDotSpot: number;
    // survivalLevel1CountDownText: Phaser.GameObjects.Text;
    // unlockSurvivalLevel1Time: number;
    survivalLevels: any;
    survivalLevelsData: any;
    world: number;
    gems: string;
    gemsText: Phaser.GameObjects.Text;
    gemsTexture: Phaser.GameObjects.Image;


    constructor() {
        super('Map');
    }

    create() {
        super.create();

        this.add.image(0, 0, 'bg-achievments').setOrigin(0);
        this.addParticles();
        this.createFireAnimation();

        this.survivalLevels = [];
        this.spots = [];
        this.survival1Spots = [];
        this.dots = [];
        this.survivalLeveldots = [];
        this.levelContentContainer = new Phaser.GameObjects.Container(this, 0, 0).setDepth(101);
        this.add.existing(this.levelContentContainer);

        //TODO check world, it could be 3,4.....
        this.world = JSON.parse(localStorage.getItem('currentWorld') ?? 'null');
        const points = this.world === 1 ? world1points : world2points;

        for (let index = 0; index < points.length; index++) {
            const spot = points[index];
            const graphics = this.add.graphics();
            graphics.lineStyle(3, 0xffffff);
            graphics.strokeCircle(spot.x, spot.y, 8);
            this.dots.push(graphics);
            this.levelContentContainer.add(graphics)
            this.spots.push(spot);
        }

        //========================SURVIVAL LEVELS==========================================================
        if (this.world === 1) {
            this.survivalLevelsData = survivalLevelsWorld1.slice();
        } else {
            this.survivalLevelsData = survivalLevelsWorld2.slice();
        }

        this.survivalLevelsData.forEach((lvl: any) => {
            lvl.survivalLeveldots = [],
                lvl.survivalSpots = []
            const survival_level_points = lvl.mapPosition;
            for (let index = 0; index < survival_level_points.length; index++) {
                const spot = survival_level_points[index];
                const graphics = this.add.graphics().setAlpha(0);
                graphics.lineStyle(3, 0xFFD700);
                graphics.strokeCircle(spot.x, spot.y, 8);
                lvl.survivalLeveldots.push(graphics);
                this.levelContentContainer.add(graphics)
                lvl.survivalSpots.push(spot);
            }
            this.survivalLevels.push(lvl);
        });
        //===================================================================================================

        this.createPlayer();// this should be exactly here, between the 2  phases of creating survival levels! - TODO - check to fix it

        //========================SURVIVAL LEVEL==========================================================
        const currentLevel = JSON.parse(localStorage.getItem('currentLevel') ?? "null") || '0';
        const mapLevel = JSON.parse(localStorage.getItem('mapLevel') ?? "null") || '0';

        this.survivalLevels.forEach((lvl: any) => {
            const introduceToSurvivalLevel = currentLevel === lvl.revealedByLevel && mapLevel === lvl.revealedByLevel + 1
            if (!introduceToSurvivalLevel && mapLevel > lvl.revealedByLevel) {
                lvl.survivalLeveldots.forEach((element: Phaser.GameObjects.Graphics) => {
                    element.setAlpha(1);
                });
            }

            if (mapLevel > lvl.revealedByLevel) {
                this.createSurvivalLevel(introduceToSurvivalLevel, lvl);
            }
        });
        //===================================================================================================

        this.createBackButton();
        this.createLevels();
        this.createCoins();
    }

    private createFireAnimation() {
        const fireAnimation = new SpriteAnimation(this, 0, 1350, 'bg-fire', 'bg-fire', 'bgfirefx_', true, 60, 6.5, 5, 5);
        fireAnimation.animation.setOrigin(0, 1);
        fireAnimation.animation.setDepth(1).setAlpha(1);
        // const fireAnimation2 = new SpriteAnimation(this, fireAnimation.animation.x + fireAnimation.animation.displayWidth, 1080, 'bg-fire', 'bg-fire', 'bgfirefx_', true, 60, 3.5, 3, 5);
        // fireAnimation2.animation.setOrigin(0, 1);
        // fireAnimation2.animation.setDepth(1).setAlpha(1);

    }

    private addLight(texture: Phaser.GameObjects.Image) {
        let light = this.lights.addPointLight(texture.x, texture.y, 0xffffff, 100, 4, 0.05).setAlpha(0.06).setDepth(this.levelContentContainer.depth + 0.1);
        this.tweens.add({
            targets: light,
            alpha: 0.12,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            // ease: 'Sine.easeOut',
        })
        this.levelContentContainer.add(light);
    }

    private addParticles() {
        let emitter = this.add.particles(0, 0, 'flare', {
            x: { random: [0, 1920] },
            y: { random: [340, 880] },
            lifespan: { random: [3000, 7000] },
            scale: { min: 0.05, max: 0.2 },
            gravityY: -55,
            blendMode: 'ADD',
            frequency: 150,
            quantity: 1,
            maxAliveParticles: 175,
            advance: 20000

        }).setDepth(15 + 0.1)
    }

    private createPlayer() {
        this.player = this.add.image(0, 0, 'location').setScale(1).setOrigin(0.5, 1).setAlpha(0).setDepth(99);
    }

    createBackButton() {
        this.backButton = new Button(this, 100, 950, 'button', 'back', () => {
            this.confirmPopupOpen = false;
            this.changeScene('MainMenu');
        });
        this.add.existing(this.backButton);
        this.backButton.setDepth(15);
    }

    private createSurvivalLevel(introduceToSurvivalLevel: boolean, lvl: any) {

        const levelTexture = this.add.image(lvl.survivalSpots[3].x, lvl.survivalSpots[3].y, 'survival1')
            .setScale(0.4)
            .setOrigin(0.5)
            .setDepth(88)
            .setAlpha(+!introduceToSurvivalLevel);

        const leveltext: Phaser.GameObjects.Text = this.add.text(
            lvl.survivalSpots[3].x,
            lvl.survivalSpots[3].y,
            ``,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 33, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4, strokeThickness: 3,
                align: 'center'
            })
            .setOrigin(0.5)
            .setDepth(88)
            .setAlpha(+!introduceToSurvivalLevel);

        this.levelContentContainer.add([levelTexture, leveltext]);
        this.addLight(levelTexture);
        // levelTexture.setInteractive();
        levelTexture.on('pointerdown', () => {
            if (this.confirmPopupOpen) {
                return;
            }
            this.confirmPopupOpen = true;
            const onMoveComplete = () => {

                this.levelConfirm = new MainMenuLevelConfirm(this, 0, 0, (lvl as ILevelConfig), true);
                this.levelContentContainer.add([this.levelConfirm]);

                this.levelConfirm.once('level-selected', (level: number) => {
                    localStorage.setItem('currentLevel', JSON.stringify(lvl.revealedByLevel));
                    this.confirmPopupOpen = false;
                    this.levelConfirm.removeAllListeners();
                    this.levelConfirm.destroy(true);
                    localStorage.setItem('survivalLevelData', JSON.stringify(lvl));
                    this.changeScene('Game', true);
                }, this);

                this.levelConfirm.once('level-unselected', () => {
                    this.player.setPosition(this.spots[this.playerDotSpot].x, this.spots[this.playerDotSpot].y);
                    this.levelConfirm.removeAllListeners();
                    this.levelConfirm.destroy(true);
                    this.confirmPopupOpen = false;
                }, this);
            }
            let targetLvl = lvl.revealedByLevel - 1;// first we move the player to the level that revealed the survival level
            if (this.world === 2) targetLvl -= 34; // TODO - 34 is world1Levels.length - 1 -------- fix this
            this.movePlayerToLevel(targetLvl * 6, () => {
                this.movePlayerToLevel(3, () => {
                    onMoveComplete();
                }, lvl.survivalSpots, true, 0);
            });
        })

        //  tween alpha of new revielled survival level
        if (introduceToSurvivalLevel) {
            this.confirmPopupOpen = true;
            lvl.survivalLeveldots.forEach((element: Phaser.GameObjects.Graphics, index: number) => {
                const target = index === 3 ? levelTexture : element;
                this.tweens.add({
                    targets: target,
                    alpha: 1,
                    delay: index * 400,
                    duration: 350,
                    onComplete: () => {
                        if (index === 3) {
                            this.confirmPopupOpen = false;
                        }
                    }
                });
            });
        }

        // count down text
        let survivalLevelCountDownText = this.add.text(
            levelTexture.x + 50,
            levelTexture.y,
            ``,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 25, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4, strokeThickness: 3,
                align: 'center'
            })
            .setOrigin(0, 0.5)
            .setDepth(88);
        let unlockSurvivalLevel1Time = parseInt(localStorage.getItem(`${lvl.levelName}`) ?? "null") || 0;
        // this.resetSurvivalLevel1();//test
        this.updateSurvivalLevel(levelTexture, unlockSurvivalLevel1Time, survivalLevelCountDownText, lvl.levelName);

    }

    private resetSurvivalLevel() {
        // const hoursToReset = survivalLevels[0].hoursToReset
        // let unlockSurvivalLevelTime = Date.now() + hoursToReset * 60 * 60 * 1000;
        // // this.unlockSurvivalLevel1Time = Date.now() + 1 * 60 * 1000; // 1 minute for testing
        // localStorage.setItem('SurvivalLevel1', unlockSurvivalLevelTime.toString());
    }

    private updateSurvivalLevel(levelTexture: Phaser.GameObjects.Image, unlockSurvivalLevelTime: number, survivalLevelCountDownText: Phaser.GameObjects.Text, levelName: string) {
        const now = Date.now();

        if (!unlockSurvivalLevelTime || now >= unlockSurvivalLevelTime) {
            // level is unlocked!
            console.log(`SurvivalLevel ${levelName} is unlocked...`)
            levelTexture.setInteractive();
            survivalLevelCountDownText.setText('');
            localStorage.removeItem(`${levelName}`);
        } else {
            const remaining = unlockSurvivalLevelTime - now;
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

            const formatted = `${hours.toString().padStart(2, '0')}:${minutes
                .toString()
                .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            survivalLevelCountDownText.setText(`${formatted}`);
            levelTexture.disableInteractive();

            this.time.delayedCall(1000, () => {
                this.updateSurvivalLevel(levelTexture, unlockSurvivalLevelTime, survivalLevelCountDownText, levelName);
            })
        }
    }

    private createLevels(): void {

        const mapLevel = localStorage.getItem('mapLevel') || 1;
        let currentLevel = localStorage.getItem('currentLevel') || 0;

        //test!
        // level_config.length = 10

        //TODO - FIX THIS HARDCODED 36
        const config = this.world === 1 ? level_config.slice(0, 36) : level_config.slice(36);
        config.forEach((levelData: ILevelConfig, index: number) => {

            const textureName = levelData.isTransition ? 'world-arrow' : 'lvl-plate';
            const levelTexture = this.add.image(this.spots[index * 6].x, this.spots[index * 6].y, textureName).setScale(levelData.isTransition ? 0.3 : 0.5).setOrigin(0.5).setDepth(88);
            if (levelData.isFlipped) {
                levelTexture.flipX = true;
            }
            levelTexture
            this.levelContentContainer.add([levelTexture]);

            let mapDot = this.spots[index * 6];

            this.dots[index * 6].setVisible(false);

            let leveltext = null;
            if (!levelData.isTransition) {
                const leveltext: Phaser.GameObjects.Text = this.add.text(
                    mapDot.x,
                    mapDot.y,
                    `${levelData.levelName}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 33, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4, strokeThickness: 3,
                        align: 'center'
                    }).setOrigin(0.5).setDepth(88);
                this.levelContentContainer.add(leveltext);
            }

            // TODO - fix hardcoded 35 as last level for the world
            if ((+levelData.levelName! <= +mapLevel) || levelData.isTransition) {

                if (+mapLevel < 36 && levelData.isTransition) {
                    //fuck off
                } else {
                    levelTexture.setInteractive();
                }
            } else {
                levelTexture.disableInteractive();
                levelTexture.setAlpha(0.65);
                if (leveltext) {
                    (leveltext as Phaser.GameObjects.Text).setAlpha(0.65);
                }
            }


            if (levelData.levelName === +currentLevel) {
                //PLAYER IS HERE
                this.player.setAlpha(1).setPosition(mapDot.x, mapDot.y);
                this.playerDotSpot = index * 6;
                // this.levelContentContainer.add(this.player);
            }


            levelTexture.on('pointerdown', () => {
                if (this.confirmPopupOpen) {
                    return;
                }

                if (levelData.isFlipped) {// arrow to world 1 is clicked
                    localStorage.setItem('currentLevel', '35');
                    currentLevel = localStorage.getItem('currentLevel') || 0;
                    localStorage.setItem('currentWorld', '1');
                    this.world = JSON.parse(localStorage.getItem('currentWorld') ?? 'null');
                }

                this.confirmPopupOpen = true;

                const onMoveComplete = () => {
                    if (levelData.isFlipped) {// move to world 1
                        this.changeScene('Map');
                    } else if (levelData.isTransition) { // MOVE TO NEXT WORLD
                        // if (+JSON.parse(localStorage.getItem('mapLevel') ?? "0") === 35) {
                        localStorage.setItem('currentLevel', JSON.stringify(36));
                        // }
                        // if (+JSON.parse(localStorage.getItem('mapLevel') ?? "0") === 35) {
                        //     localStorage.setItem('mapLevel', JSON.stringify(36));
                        // }
                        // if (+JSON.parse(localStorage.getItem('currentLevel') ?? "0") === 35) {
                        //     localStorage.setItem('currentLevel', JSON.stringify(36));
                        // }

                        // TODO - change this hardcoded  2 as next world. it could be 3,4...
                        localStorage.setItem('currentWorld', JSON.stringify(2));
                        this.changeScene('Map');
                    } else {
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
                }

                // if (currentLevel === 0 || +currentLevel === 36) {
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
                    this.movePlayerToLevel(index * 6, () => {
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

    private movePlayerToLevel(newSpotIndex: number, onLevelReached: Function, spots: { x: number, y: number }[] = this.spots, isSurvivalLevel: boolean = false, playerDotSpot: number = this.playerDotSpot) {
        console.log(`new level is ${newSpotIndex}`)
        console.log(`playerDotSpot is ${this.playerDotSpot}`);

        let currentSpot = playerDotSpot;
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
                x: spots[currentSpot].x,
                y: spots[currentSpot].y,
                onComplete: () => {
                    if (!isSurvivalLevel) {
                        this.playerDotSpot = currentSpot;
                        console.log(`playerDotSpot is ${this.playerDotSpot}`);
                    }
                    if (currentSpot === targetSpot) {
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

    createCoins() {
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

    changeScene(nextScene: string, isSurvivalLevel: boolean = false): void {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.confirmPopupOpen = false;
            this.scene.start(nextScene, { isSurvivalLevel });
        });
    }
}
