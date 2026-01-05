import { Scene } from "phaser";
import { GAME_SCENE_SCENE_EVENTS } from "../Game";
import { main_config } from "../../configs/main_config";

export class DirectionArrow extends Phaser.GameObjects.Image {

    private row: number;
    private col: number;
    isTarget: boolean;
    isRanged: boolean | undefined;

    constructor(scene: Scene, x: number, y: number, angle: number, row: number, col: number, img: string, isTarget: boolean, isRanged: boolean | undefined, parent: Phaser.GameObjects.Container) {
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
        this.addInteracion(x, y, parent);
    }

    private addInteracion(x: number, y: number, parent: Phaser.GameObjects.Container): void {
        const zone = this.scene.add.zone(x + parent.x, y + parent.y, main_config.cellSize, main_config.cellSize)
            .setInteractive();

        zone.once('pointerdown', () => {
            if (this.isTarget) {
                this.scene.events.emit(GAME_SCENE_SCENE_EVENTS.TARGET_SELECTED, [this.row, this.col, this.isRanged]);
            } else {
                this.scene.events.emit(GAME_SCENE_SCENE_EVENTS.DIRECTION_SELECTED, [this.row, this.col, this.isRanged]);
            }
        });
    }
}
