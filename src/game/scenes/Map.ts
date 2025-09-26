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
            { x: 120, y: 685 },
            { x: 140, y: 637 },
            { x: 140, y: 585 },
            { x: 95, y: 560 },
            { x: 85, y: 505 },

            { x: 100, y: 450 },
            { x: 100, y: 388 },
            { x: 98, y: 339 },
            { x: 133, y: 300 },
            { x: 161, y: 253 },
            { x: 152, y: 205 },

            { x: 160, y: 150 },
            { x: 180, y: 95 },
            { x: 220, y: 62 },
            { x: 272, y: 50 },
            { x: 325, y: 60 },
            { x: 360, y: 95 },

            { x: 360, y: 150 },
            { x: 379, y: 205 },
            { x: 432, y: 222 },
            { x: 491, y: 222 },
            { x: 534, y: 189 },
            { x: 565, y: 144 },//ок

            { x: 620, y: 145 },
            { x: 675, y: 130 },
            { x: 719, y: 151 },
            { x: 740, y: 194 },
            { x: 726, y: 240 },
            { x: 686, y: 268 },//ок

            { x: 645, y: 310 },
            { x: 605, y: 353 },
            { x: 553, y: 367 },
            { x: 521, y: 410 },
            { x: 528, y: 459 },
            { x: 544, y: 504 },// ок

            { x: 535, y: 560 },
            { x: 477, y: 555 },
            { x: 447, y: 512 },
            { x: 440, y: 456 },
            { x: 415, y: 409 },
            { x: 372, y: 372 },//ок

            { x: 315, y: 359 },
            { x: 259, y: 370 },
            { x: 240, y: 422 },
            { x: 240, y: 478 },
            { x: 250, y: 530 },
            { x: 280, y: 575 },//ок

            { x: 295, y: 630 },
            { x: 302, y: 685 },
            { x: 273, y: 729 },
            { x: 260, y: 780 },
            { x: 257, y: 834 },
            { x: 297, y: 872 },

            { x: 350, y: 890 },
            { x: 401, y: 864 },
            { x: 441, y: 827 },
            { x: 413, y: 781 },
            { x: 399, y: 728 },
            { x: 426, y: 678 },

            { x: 483, y: 660 },
            { x: 540, y: 660 },
            { x: 565, y: 702 },
            { x: 583, y: 753 },
            { x: 563, y: 804 },
            { x: 573, y: 858 },

            { x: 612, y: 900 },
            { x: 661, y: 920 },
            { x: 709, y: 929 },
            { x: 755, y: 955 },
            { x: 806, y: 963 },
            { x: 857, y: 965 },

            { x: 912, y: 965 },
            { x: 965, y: 965 },
            { x: 1012, y: 977 },
            { x: 1060, y: 1000 },
            { x: 1114, y: 987 },
            { x: 1162, y: 958 },

            { x: 1182, y: 900 },
            { x: 1235, y: 888 },
            { x: 1285, y: 892 },
            { x: 1329, y: 917 },
            { x: 1366, y: 953 },
            { x: 1415, y: 976 },

            { x: 1469, y: 988 },
            { x: 1522, y: 988 },
            { x: 1572, y: 979 },
            { x: 1618, y: 952 },
            { x: 1645, y: 908 },
            { x: 1676, y: 864 },

            { x: 1686, y: 812 },
            { x: 1731, y: 784 },
            { x: 1774, y: 758 },
            { x: 1795, y: 712 },
            { x: 1791, y: 660 },
            { x: 1756, y: 621 },

            { x: 1700, y: 606 },
            { x: 1644, y: 606 },
            { x: 1602, y: 631 },
            { x: 1586, y: 678 },
            { x: 1550, y: 711 },
            { x: 1499, y: 735 },

            { x: 1445, y: 735 },
            { x: 1394, y: 752 },
            { x: 1341, y: 755 },
            { x: 1303, y: 795 },
            { x: 1246, y: 802 },
            { x: 1193, y: 782 },

            { x: 1138, y: 777 },
            { x: 1097, y: 812 },
            { x: 1058, y: 837 },
            { x: 1013, y: 857 },
            { x: 966, y: 865 },
            { x: 915, y: 861 },

            //lvl 21
            { x: 863, y: 861 },
            { x: 812, y: 861 },
            { x: 761, y: 852 },
            { x: 713, y: 823 },
            { x: 700, y: 767 },
            { x: 709, y: 713 },

            { x: 709, y: 658 },
            { x: 709, y: 603 },
            { x: 689, y: 556 },
            { x: 709, y: 508 },
            { x: 695, y: 452 },
            { x: 720, y: 403 },

            { x: 765, y: 369 },
            { x: 813, y: 343 },
            { x: 839, y: 297 },
            { x: 838, y: 241 },
            { x: 870, y: 196 },
            { x: 863, y: 143 },

            { x: 885, y: 93 },
            { x: 937, y: 75 },
            { x: 987, y: 70 },
            { x: 1033, y: 95 },
            { x: 1043, y: 144 },
            { x: 1019, y: 188 },

            { x: 1005, y: 243 },
            { x: 1005, y: 296 },
            { x: 1045, y: 328 },
            { x: 1097, y: 343 },
            { x: 1133, y: 383 },
            { x: 1138, y: 433 },

            { x: 1138, y: 488 },
            { x: 1103, y: 530 },
            { x: 1055, y: 547 },
            { x: 1007, y: 516 },
            { x: 998, y: 469 },
            { x: 950, y: 445 },

            { x: 894, y: 445 },
            { x: 867, y: 490 },
            { x: 864, y: 536 },
            { x: 894, y: 577 },
            { x: 884, y: 627 },
            { x: 914, y: 670 },

            { x: 965, y: 694 },
            { x: 1020, y: 694 },
            { x: 1069, y: 697 },
            { x: 1118, y: 682 },
            { x: 1155, y: 646 },
            { x: 1204, y: 627 },

            { x: 1259, y: 627 },
            { x: 1313, y: 627 },
            { x: 1362, y: 610 },
            { x: 1394, y: 567 },
            { x: 1448, y: 547 },
            { x: 1506, y: 531 },

            { x: 1560, y: 531 },
            { x: 1614, y: 521 },
            { x: 1660, y: 505 },
            { x: 1696, y: 465 },
            { x: 1706, y: 417 },
            { x: 1690, y: 366 },

            //lvl 30
            { x: 1630, y: 336 },
            { x: 1575, y: 336 },
            { x: 1546, y: 378 },
            { x: 1501, y: 412 },
            { x: 1440, y: 422 },
            { x: 1379, y: 407 },

            { x: 1339, y: 370 },
            { x: 1284, y: 365 },
            { x: 1239, y: 326 },
            { x: 1203, y: 284 },
            { x: 1196, y: 235 },
            { x: 1207, y: 188 },

            { x: 1227, y: 138 },
            { x: 1277, y: 117 },
            { x: 1327, y: 101 },
            { x: 1383, y: 103 },
            { x: 1433, y: 134 },
            { x: 1449, y: 184 },

            { x: 1429, y: 234 },
            { x: 1447, y: 285 },
            { x: 1498, y: 295 },
            { x: 1544, y: 269 },
            { x: 1556, y: 221 },
            { x: 1548, y: 172 },

            { x: 1572, y: 124 },
            { x: 1619, y: 101 },
            { x: 1667, y: 104 },
            { x: 1700, y: 138 },
            { x: 1694, y: 184 },
            { x: 1717, y: 231 },

            { x: 1767, y: 251 },// lvl 35
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

        //test!
        // level_config.length = 10
        level_config.forEach((levelData: ILevelConfig, index: number) => {

            const levelTexture = this.add.image(this.spots[index * 6].x, this.spots[index * 6].y, 'lvl-plate').setScale(0.5).setOrigin(0.5).setDepth(this.player.depth - 1);

            const mapDot = this.spots[index * 6];
            this.dots[index * 6].setVisible(false);
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
                this.playerDotSpot = index * 6;
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
