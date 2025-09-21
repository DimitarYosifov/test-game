import { Scene } from 'phaser';

export abstract class AbstractScene extends Scene implements ITest {

    camera: Phaser.Cameras.Scene2D.Camera;

    constructor(sceneName: string) {
        super(sceneName);
    }

    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.cameras.main.once('camerafadeincomplete', () => {

        });
    }

    abstract changeScene(nextScene: string): void;
}

interface ITest {
    changeScene(nextScene: string): void;
}
