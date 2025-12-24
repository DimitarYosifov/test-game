import { Scene } from "phaser";
import { Button } from "./Button";
import { LOCAL_STORAGE_MANAGER } from "../../LOCAL_STORAGE_MANAGER";

export class StartOverConfirm extends Phaser.GameObjects.Container {

    private backButton: Button;
    okButton: Button;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);
        this.scene = scene;
        this.scene.add.existing(this);

        this.createBGOverlay();
        this.createMsg();
        this.createOkButton();
        this.createBackButton();
    }

    private createBGOverlay() {
        let overlay = this.scene.add.graphics();
        overlay.fillStyle(0x000000, 0.95);
        overlay.fillRect(-960, -540, 1920, 1080);
        overlay.setInteractive();
        this.add(overlay);
        overlay.setInteractive();
        overlay.on('pointerdown', function (pointer: any) {
            pointer.event.stopPropagation();
        });
    }

    private createMsg() {
        const levelHeader: Phaser.GameObjects.Text = this.scene.add.text(
            0,
            -50,
            `your progress will be lost forever!\nare you sure?`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 70, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0.5);
        this.add(levelHeader);
    }

    private createOkButton() {
        this.okButton = new Button(this.scene, 150, 250, 'button', 'yes', () => {
            LOCAL_STORAGE_MANAGER.clear();
            location.reload();
        });
        this.add(this.okButton);
    }

    private createBackButton() {
        this.backButton = new Button(this.scene, -150, 250, 'button', 'no', () => this.emit('start-again-declined'));
        this.add(this.backButton);
    }
}
