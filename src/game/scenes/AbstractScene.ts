import { Scene } from 'phaser';
import { IOpponentMonstersData } from '../configs/level_config';

export abstract class AbstractScene extends Scene implements IAbstractScene {

    camera: Phaser.Cameras.Scene2D.Camera;

    constructor(sceneName: string) {
        super(sceneName);
    }

    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.cameras.main.once('camerafadeincomplete', () => { });
    }

    abstract changeScene(nextScene: string, isSurvivalLevel: boolean): void;
    abstract createCoins(): void;
    abstract createBackButton(): void;
}

interface IAbstractScene {
    changeScene(nextScene: string, isSurvivalLevel: boolean): void;
    createCoins(): void;
    createBackButton(): void;
}
