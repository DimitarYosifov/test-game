
export class Button extends Phaser.GameObjects.Image {

    private initialScale: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, action: Function, disableInteraction: boolean = false, initialScale: number = 1) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.initialScale = initialScale;
        this.setScale(initialScale);
        this.setOrigin(0.5);
        disableInteraction ? this.disableInteractive() : this.setInteractive();
        this.setAlpha(disableInteraction ? 0.65 : 1);
        this.on('pointerover', () => {
            this.scene.tweens.add({
                targets: this,
                scale: this.initialScale * 1.05,
                duration: 150,
            })
        });
        this.on('pointerout', () => {
            this.scene.tweens.add({
                targets: this,
                scale: this.initialScale,
                duration: 150,
            })
        });
        this.on('pointerdown', () => {
            action();
        });

        this.scene.add.existing(this);
    }

    setInteractive(hitArea?: Phaser.Types.Input.InputConfiguration | any, callback?: Phaser.Types.Input.HitAreaCallback, dropZone?: boolean): this {
        super.setInteractive(hitArea, callback, dropZone);
        this.setAlpha(1);
        return this;
    }

    disableInteractive(resetCursor?: boolean): this {
        super.disableInteractive(resetCursor);
        this.setAlpha(0.65);
        return this;
    }
}