import { Scene } from 'phaser';

export abstract class AbstractScene extends Scene implements IAbstractScene {

    camera: Phaser.Cameras.Scene2D.Camera;

    coins: string;
    gems: string;
    keys: string;
    token5: string;
    token4: string;
    token3: string;
    token2: string;
    token1: string;

    coinText: Phaser.GameObjects.Text;
    gemsText: Phaser.GameObjects.Text;
    keysText: Phaser.GameObjects.Text;
    token5Text: Phaser.GameObjects.Text;
    token4Text: Phaser.GameObjects.Text;
    token3Text: Phaser.GameObjects.Text;
    token2Text: Phaser.GameObjects.Text;
    token1Text: Phaser.GameObjects.Text;

    coinTexture: Phaser.GameObjects.Image;
    gemsTexture: Phaser.GameObjects.Image;
    keysTexture: Phaser.GameObjects.Image;
    token5Texture: Phaser.GameObjects.Image;
    token4Texture: Phaser.GameObjects.Image;
    token3Texture: Phaser.GameObjects.Image;
    token2Texture: Phaser.GameObjects.Image;
    token1Texture: Phaser.GameObjects.Image;

    constructor(sceneName: string) {
        super(sceneName);
    }

    create(d?: any) {
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.cameras.main.once('camerafadeincomplete', () => { });
    }

    shutdown() {
        this.time.removeAllEvents();
        this.tweens.killAll();
    }

    destroy() {
        this.input.removeAllListeners();
        this.anims.removeAllListeners();
    }

    abstract changeScene(nextScene: string, isSurvivalLevel: boolean): void;
    // abstract createCoins(): void;
    abstract createBackButton(): void;
}

interface IAbstractScene {
    changeScene(nextScene: string, isSurvivalLevel: boolean): void;
    createBackButton(): void;
}
