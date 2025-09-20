import { Scene } from 'phaser';
import { MainMenuLevelConfirm } from './in-main-menu/MainMenuLevelConfirm';
import { ILevelConfig, level_config } from '../configs/level_config';

export class MainMenu extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameover_text: Phaser.GameObjects.Text;
    deckButton: Phaser.GameObjects.Image;
    confirmPopupOpen: boolean;

    constructor() {
        super('MainMenu');
    }

    create() {

        this.createDeckbutton();
        this.createLevels();

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
                    fontFamily: 'Arial Black', fontSize: 33, color: '#ffffff',
                    stroke: '#000000', strokeThickness: 2,
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
        this.deckButton = this.add.image(1700, 850, 'deck').setScale(0.5).setOrigin(0.5).setInteractive();
        this.deckButton.on('pointerover', () => {
            this.tweens.add({
                targets: this.deckButton,
                scale: 0.55,
                duration: 150,
            })
        });
        this.deckButton.on('pointerout', () => {
            this.tweens.add({
                targets: this.deckButton,
                scale: 0.5,
                duration: 150,
            })
        });
        this.deckButton.on('pointerdown', () => {
            this.deckButton.disableInteractive();
            this.scene.start('CardSelection');
        });
    }
}
