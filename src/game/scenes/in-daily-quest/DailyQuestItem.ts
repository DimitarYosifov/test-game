import { Scene } from 'phaser';

export class DailyQuestItem extends Phaser.GameObjects.Container {

    private hasImage: boolean;
    private bgImage: Phaser.GameObjects.Image;
    private description: Phaser.GameObjects.Text;
    private progessText: Phaser.GameObjects.Text;
    private completedImage: Phaser.GameObjects.Image;

    constructor(scene: Scene, x: number, y: number, hasImage: boolean, image: string, description: string, progress: string, isUpgrade: boolean = false) {
        super(scene, x, y);
        this.scene = scene;
        this.scene.add.existing(this);
        this.hasImage = hasImage;

        if (this.hasImage) {
            this.bgImage = this.scene.add.image(0, 0, image);
            this.add(this.bgImage);
        }

        this.description = this.scene.add.text(
            0,
            (this.bgImage?.height / 2) || 0,
            `${description}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 40, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4, strokeThickness: 4, wordWrap: { width: 300 },
                align: 'center'
            }).setOrigin(0.5, 0)
        this.add(this.description);

        const progressTextPadding = 60;
        this.progessText = this.scene.add.text(
            0,
            this.description.y + progressTextPadding + this.description.height / 2 || progressTextPadding,
            `${progress}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4, strokeThickness: 4, wordWrap: { width: 300 },
                align: 'center'
            }).setOrigin(0.5, 0)
        this.add(this.progessText);

        // is quest completed
        if (progress.split('/')[0] === progress.split('/')[1]) {
            this.completedImage = this.scene.add.image(0, 0, 'checked');
            this.add(this.completedImage);
        }
    }
}
