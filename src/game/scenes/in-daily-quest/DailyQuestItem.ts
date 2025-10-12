import { Scene } from 'phaser';

export class DailyQuestItem extends Phaser.GameObjects.Container {

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);
        this.scene = scene;
    }
}
