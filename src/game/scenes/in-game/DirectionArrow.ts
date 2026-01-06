import { Scene } from "phaser";
import { GAME_SCENE_SCENE_EVENTS } from "../Game";
import { main_config } from "../../configs/main_config";

export class DirectionArrow extends Phaser.GameObjects.Image {

    private row: number;
    private col: number;
    isTarget: boolean;
    isRanged: boolean | undefined;
    private interactionZone?: Phaser.GameObjects.Zone;
    private onPointerDown?: () => void;
    private onPointerMove?: (pointer: Phaser.Input.Pointer) => void;

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

        const scene = this.scene;

        this.interactionZone = scene.add.zone(
            x + parent.x,
            y + parent.y,
            main_config.cellSize,
            main_config.cellSize
        ).setInteractive();

        this.onPointerDown = () => {
            this.emitSelection(scene);
            this.cleanupInteraction();
        };

        this.onPointerMove = (pointer: Phaser.Input.Pointer) => {
            if (
                scene.data.list.selectedMonsterDragged &&
                this.getBounds().contains(pointer.x, pointer.y)
            ) {
                console.log(pointer);
                scene.data.list.selectedMonsterDragged = false;
                this.emitSelection(scene);
                this.cleanupInteraction();
            }
        };

        scene.input.on('pointermove', this.onPointerMove);
        this.interactionZone.once('pointerdown', this.onPointerDown);
    }

    private emitSelection(scene: Phaser.Scene): void {
        if (this.isTarget) {
            scene.events.emit(
                GAME_SCENE_SCENE_EVENTS.TARGET_SELECTED,
                [this.row, this.col, this.isRanged]
            );
        } else {
            scene.events.emit(
                GAME_SCENE_SCENE_EVENTS.DIRECTION_SELECTED,
                [this.row, this.col, this.isRanged]
            );
        }
    }

    private cleanupInteraction(): void {
        if (this.interactionZone) {
            this.interactionZone.off('pointerdown', this.onPointerDown!);
            this.interactionZone.disableInteractive();
        }

        if (this.onPointerMove) {
            this.scene.input.off('pointermove', this.onPointerMove);
        }

        this.onPointerDown = undefined;
        this.onPointerMove = undefined;
    }

    destroy(fromScene?: boolean): void {
        this.cleanupInteraction();
        this.interactionZone?.destroy();
        this.interactionZone = undefined;

        super.destroy(fromScene);
    }
}
