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


    constructor() {
        super('Map');
    }

    create() {
        super.create();
        this.createBackButton();
        this.createLevels();
        this.createCoins();
    }

    private createBackButton() {
        this.backButton = new Button(this, 100, 950, 'back-btn', () => {
            this.confirmPopupOpen = false;
            // this.levelConfirm.removeAllListeners();
            // this.levelConfirm.destroy(true);

            this.changeScene('MainMenu');
            // this.levelConfirm.removeAllListeners();
            // this.levelConfirm.destroy(true);
            // this.confirmPopupOpen = false;
        });
        this.add.existing(this.backButton);
    }

    private createLevels(): void {

        const levelContentContainer = new Phaser.GameObjects.Container(this, 0, 0);
        this.add.existing(levelContentContainer);

        level_config.forEach((levelData: ILevelConfig, index: number) => {
            const leveltext: Phaser.GameObjects.Text = this.add.text(
                200,
                800 - index * 50,
                `Level ${levelData.levelName}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 33, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                });
            levelContentContainer.add(leveltext);
            leveltext.setInteractive();
            leveltext.on('pointerdown', () => {
                if (this.confirmPopupOpen) {
                    return;
                }
                this.confirmPopupOpen = true;
                this.levelConfirm = new MainMenuLevelConfirm(this, 0, 0, levelData);
                levelContentContainer.add([this.levelConfirm]);

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
            });
        });
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
