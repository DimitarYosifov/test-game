import { Scene } from 'phaser';

export class Monster extends Phaser.GameObjects.Container {
    private bg: Phaser.GameObjects.Image;
    private damage: Phaser.GameObjects.Image;
    private damage_text: any;
    private health_text: Phaser.GameObjects.Text;
    private health: Phaser.GameObjects.Image;
    private shield: Phaser.GameObjects.Image;
    private shield_text: Phaser.GameObjects.Text;
    private vision_text: Phaser.GameObjects.Text;
    vision: Phaser.GameObjects.Image;

    constructor(scene: Scene, x: number, y: number, displayWidth: number, displayHeight: number) {
        super(scene, x, y);
        //TODO - add type/bg here

        //bg
        this.bg = scene.add.image(0, 0, '8').setOrigin(0.5);
        this.bg.displayWidth = displayWidth;
        this.bg.displayHeight = displayHeight;

        //damage img
        this.damage = scene.add.image(0, 0, 'attack').setScale(0.12).setOrigin(0);
        this.damage.x = this.bg.displayWidth / -2 + this.bg.displayWidth * 0.02;
        this.damage.y = this.bg.displayHeight / -2 + this.bg.displayHeight * 0.02;

        //damage text
        this.damage_text = scene.add.text(
            this.damage.x + this.damage.displayWidth,
            this.damage.y - 2,
            '4',
            {
                fontFamily: 'Arial Black', fontSize: 12, color: '#ffffff',
                stroke: '#000000', strokeThickness: 1,
                align: 'center'
            });
        this.damage_text.setOrigin(0);

        //health text
        this.health_text = scene.add.text(
            this.bg.displayWidth / 2 - this.bg.displayWidth * 0.02,
            this.bg.displayHeight / -2 + this.bg.displayHeight * 0.02 - 2,
            '3',
            {
                fontFamily: 'Arial Black', fontSize: 15, color: '#ffffff',
                stroke: '#000000', strokeThickness: 1,
                align: 'center'
            });
        this.health_text.setOrigin(1, 0);

        // //health img
        this.health = scene.add.image(0, 0, 'health').setScale(0.15).setOrigin(1, 0);
        this.health.x = this.health_text.x - this.health_text.width;
        this.health.y = this.bg.displayHeight / -2 + this.bg.displayHeight * 0.02;

        // shield img
        this.shield = scene.add.image(0, 0, 'shield').setScale(0.15).setOrigin(0, 1);
        this.shield.x = this.bg.displayWidth / -2 + this.bg.displayWidth * 0.02;
        this.shield.y = this.bg.displayHeight / 2 - this.bg.displayHeight * 0.02;

        //shield text
        this.shield_text = scene.add.text(
            this.shield.x + this.shield.displayWidth,
            this.shield.y - 2,
            '1',
            {
                fontFamily: 'Arial Black', fontSize: 15, color: '#ffffff',
                stroke: '#000000', strokeThickness: 1,
                align: 'center'
            });
        this.shield_text.setOrigin(0, 1);

        //vision text
        this.vision_text = scene.add.text(
            this.bg.displayWidth / 2 - this.bg.displayWidth * 0.02,
            this.bg.displayHeight / 2 - this.bg.displayHeight * 0.02 - 2,
            '7',
            {
                fontFamily: 'Arial Black', fontSize: 15, color: '#ffffff',
                stroke: '#000000', strokeThickness: 1,
                align: 'center'
            });
        this.vision_text.setOrigin(1);

        // //health img
        this.vision = scene.add.image(0, 0, 'vision').setScale(0.15).setOrigin(1, 1);
        this.vision.x = this.vision_text.x - this.vision_text.width;
        this.vision.y = this.bg.displayHeight / 2 - this.bg.displayHeight * 0.075;


        this.add([
            this.bg,
            this.damage,
            this.damage_text,
            this.health_text,
            this.health,
            this.shield,
            this.shield_text,
            this.vision_text,
            this.vision
        ])
    }

}
