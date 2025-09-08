import { Scene } from "phaser";

export class Cloud extends Phaser.GameObjects.Image {

    alphaTween: Phaser.Tweens.Tween | null;

    constructor(scene: Scene, x: number, y: number, row: number, col: number) {
        super(scene, x, y, 'cloud');
        this.scene = scene;
        this.setScale(0.5);
    }

    toggleVisibility(alpha: number): void {
        console.log(`toggleVisibility => ${alpha}`)
        if (this.alphaTween) {
            this.alphaTween.destroy();
            this.alphaTween = null;
        }
        this.alphaTween = this.scene.tweens.add({
            targets: this,
            alpha,

            duration: 500,
            onComplete: () => {
                this.alphaTween!.destroy();
                this.alphaTween = null;
            }
        })
    }
}
