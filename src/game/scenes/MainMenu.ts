import { Scene } from 'phaser';
import { MainMenuLevelConfirm } from './in-main-menu/MainMenuLevelConfirm';
import { ILevelConfig, level_config } from '../configs/level_config';
import { Button } from './in-main-menu/Button';

export class MainMenu extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameover_text: Phaser.GameObjects.Text;
    deckButton: Phaser.GameObjects.Image;
    confirmPopupOpen: boolean;
    coinTexture: Phaser.GameObjects.Image;
    coinText: Phaser.GameObjects.Text;
    coins: string | null;


    constructor() {
        super('MainMenu');
    }

    create() {
        this.createDeckbutton();
        this.createLevels();
        this.createCoins();
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
                    fontFamily: 'main-font', padding: { left: 0, right: 4, top: 0, bottom: 0 }, fontSize: 33, color: '#ffffff',
                    stroke: '#000000', letterSpacing:4,
                    align: 'center'
                });
            levelContentContainer.add(leveltext);
            leveltext.setInteractive();
            leveltext.on('pointerdown', () => {
                if (this.confirmPopupOpen) {
                    return;
                }
                this.confirmPopupOpen = true;
                this.deckButton.disableInteractive();
                const levelConfirm = new MainMenuLevelConfirm(this, 0, 0, levelData);
                levelContentContainer.add([levelConfirm]);

                levelConfirm.once('level-selected', (level: number) => {
                    localStorage.setItem('currentLevel', JSON.stringify(level));
                    this.confirmPopupOpen = false;
                    this.scene.start('Game');
                }, this);

                levelConfirm.once('level-unselected', () => {
                    levelConfirm.removeAllListeners();
                    levelConfirm.destroy(true);
                    this.deckButton.setInteractive();
                    this.confirmPopupOpen = false;
                }, this);
            });
        });
    }

    private createDeckbutton(): void {
        const deckButtonClick = () => {
            this.deckButton.disableInteractive();
            this.scene.start('CardSelection');
        }
        this.deckButton = new Button(this, 1700, 850, 'deck', deckButtonClick.bind(this), false, 0.5);
    }

    private createCoins() {
        this.coins = localStorage.getItem('coins') || '0';
        this.coinText = this.add.text(
            1900,
            30,
            `${this.coins}`,
            {
                fontFamily: 'main-font', padding: { left: 0, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                stroke: '#000000', letterSpacing:4,
                align: 'center'
            }).setOrigin(1, 0.5);
        this.coinTexture = this.add.image(this.coinText.x - this.coinText.displayWidth, 30, 'coin').setScale(0.35).setOrigin(1, 0.5);
    }
}
