import { Scene } from "phaser";

export class DirectionArrow extends Phaser.GameObjects.Image {

    private row: number;
    private col: number;
    isTarget: boolean;
    isRanged: boolean | undefined;

    constructor(scene: Scene, x: number, y: number, angle: number, row: number, col: number, img: string, isTarget: boolean, isRanged: boolean | undefined) {
        super(scene, x, y, img);
        this.scene = scene;
        this.setScale(0.4);
        if (img === 'bow') {
            this.setScale(0.6);
        }
        if (!isNaN(angle)) {
            this.setAngle(angle);
        }
        this.row = row;
        this.col = col;
        this.isTarget = isTarget;
        this.isRanged = isRanged;
        this.addInteracion();
    }

    private addInteracion(): void {
        this.setInteractive();
        this.on('pointerdown', () => {
            if (this.isTarget) {
                this.scene.events.emit('target-selected', [this.row, this.col, this.isRanged]);
            } else {
                this.scene.events.emit('direction-selected', [this.row, this.col, this.isRanged]);
            }
        });
    }
}
