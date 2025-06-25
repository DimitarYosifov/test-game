import { Scene } from 'phaser';
import { IUnitData } from '../Game';

export class Monster extends Phaser.GameObjects.Container {
    private bg: Phaser.GameObjects.Image;
    private melee: Phaser.GameObjects.Image;
    private melee_text: Phaser.GameObjects.Text;
    private health_text: Phaser.GameObjects.Text;
    private health: Phaser.GameObjects.Image;
    private shield: Phaser.GameObjects.Image;
    private shield_text: Phaser.GameObjects.Text;
    private vision_text: Phaser.GameObjects.Text;
    private vision: Phaser.GameObjects.Image;
    unitData: IUnitData;
    idleTween: Phaser.Tweens.Tween | null;
    index: number;
    pendingAction: boolean;
    ranged_text: Phaser.GameObjects.Text;
    ranged: Phaser.GameObjects.Image;

    constructor(scene: Scene, x: number, y: number, displayWidth: number, displayHeight: number, unit: IUnitData, index: number) {
        super(scene, x, y);
        this.scene = scene;
        this.unitData = unit;
        this.index = index;


        //bg
        this.bg = scene.add.image(0, 0, unit.type).setOrigin(0.5);
        this.bg.displayWidth = displayWidth;
        this.bg.displayHeight = displayHeight;
        this.add([this.bg]);

        if (unit.melee > 0) {
            //melee img
            this.melee = scene.add.image(0, 0, 'attack').setScale(displayWidth * 0.15 / 100).setOrigin(0);
            this.melee.x = this.bg.displayWidth / -2 + this.bg.displayWidth * 0.02;
            this.melee.y = this.bg.displayHeight / -2 + this.bg.displayHeight * 0.02;

            //melee text
            this.melee_text = scene.add.text(
                this.melee.x + this.melee.displayWidth,
                this.melee.y - 2,
                unit.melee.toString(),
                {
                    fontFamily: 'Arial Black', fontSize: displayWidth * 15 / 100, color: '#ffffff',
                    stroke: '#000000', strokeThickness: 2,
                    align: 'center'
                });
            this.melee_text.setOrigin(0);
            this.add([this.melee, this.melee_text]);
        }

        if (unit.ranged > 0) {
            //ranged img
            this.ranged = scene.add.image(0, 0, 'bow').setScale(displayWidth * 0.15 / 100).setOrigin(0);
            this.ranged.x = this.bg.displayWidth / -2 + this.bg.displayWidth * 0.02;
            this.ranged.y = this.bg.displayHeight / -2 + this.bg.displayHeight * 0.02;

            //ranged text
            this.ranged_text = scene.add.text(
                this.ranged.x + this.ranged.displayWidth,
                this.ranged.y - 2,
                unit.ranged.toString(),
                {
                    fontFamily: 'Arial Black', fontSize: displayWidth * 15 / 100, color: '#ffffff',
                    stroke: '#000000', strokeThickness: 2,
                    align: 'center'
                });
            this.ranged_text.setOrigin(0);
            this.add([this.ranged, this.ranged_text]);
        }

        //health text
        this.health_text = scene.add.text(
            this.bg.displayWidth / 2 - this.bg.displayWidth * 0.02,
            this.bg.displayHeight / -2 + this.bg.displayHeight * 0.02 - 2,
            unit.health.toString(),
            {
                fontFamily: 'Arial Black', fontSize: displayWidth * 15 / 100, color: '#ffffff',
                stroke: '#000000', strokeThickness: 2,
                align: 'center'
            });
        this.health_text.setOrigin(1, 0);

        // //health img
        this.health = scene.add.image(0, 0, 'health').setScale(displayWidth * 0.15 / 100).setOrigin(1, 0);
        this.health.x = this.health_text.x - this.health_text.width;
        this.health.y = this.bg.displayHeight / -2 + this.bg.displayHeight * 0.02;
        this.add([this.health_text, this.health]);

        // shield img
        this.shield = scene.add.image(0, 0, 'shield').setScale(displayWidth * 0.15 / 100).setOrigin(0, 1);
        this.shield.x = this.bg.displayWidth / -2 + this.bg.displayWidth * 0.02;
        this.shield.y = this.bg.displayHeight / 2 - this.bg.displayHeight * 0.02;

        //shield text
        this.shield_text = scene.add.text(
            this.shield.x + this.shield.displayWidth,
            this.shield.y - 2,
            unit.shield.toString(),
            {
                fontFamily: 'Arial Black', fontSize: displayWidth * 15 / 100, color: '#ffffff',
                stroke: '#000000', strokeThickness: 2,
                align: 'center'
            });
        this.shield_text.setOrigin(0, 1);
        this.add([this.shield, this.shield_text]);

        //vision text
        this.vision_text = scene.add.text(
            this.bg.displayWidth / 2 - this.bg.displayWidth * 0.02,
            this.bg.displayHeight / 2 - this.bg.displayHeight * 0.02 - 2,
            unit.vision.toString(),
            {
                fontFamily: 'Arial Black', fontSize: displayWidth * 15 / 100, color: '#ffffff',
                stroke: '#000000', strokeThickness: 2,
                align: 'center'
            });
        this.vision_text.setOrigin(1);

        // //vision img
        this.vision = scene.add.image(0, 0, 'vision').setScale(displayWidth * 0.15 / 100).setOrigin(1, 1);
        this.vision.x = this.vision_text.x - this.vision_text.width;
        this.vision.y = this.bg.displayHeight / 2 - this.bg.displayHeight * 0.075;
        this.add([this.vision_text, this.vision]);

        //stars
        const starsContainer = scene.add.container(0, 0);
        for (let index = 0; index < unit.stars; index++) {
            const star = scene.add.image(0, 0, 'star').setScale(displayWidth * 0.15 / 100).setOrigin(0, 0.5);
            starsContainer.add(star);
        }

        Phaser.Actions.GridAlign(starsContainer.list, {
            width: 0,
            height: starsContainer.list.length,
            cellWidth: 0,
            cellHeight: 13, // spacing between items vertically
            position: Phaser.Display.Align.CENTER
        });
        starsContainer.y = starsContainer.getBounds().height / -2;
        starsContainer.x = -5;
        this.add([starsContainer])

        this.addInteraction();
    }

    private addInteraction(): void {
        this.bg.on('pointerdown', () => {
            this.emit('monster-selected', this.unitData);
        });
    }

    setInteraction(interactive: boolean): void {
        interactive ? this.bg.setInteractive() : this.bg.disableInteractive();
        if (interactive) {
            this.setIdlePendingMove();
        } else {
            if (this.idleTween) {
                this.scale = 1;
                this.idleTween.remove();
                this.idleTween = null;
            }
        }
    }

    move(row: number, col: number) {
        this.pendingAction = false;
        // this.bg.disableInteractive();
        const position = this.scene.data.list.gridPositions[row][col];
        this.unitData.row = row;
        this.unitData.col = col;
        this.scene.tweens.add({
            targets: this,
            x: position.x,
            y: position.y,
            duration: 450,
            ease: 'Back.easeOut',
            onStart: () => {
                this.setInteraction(false);
            },
            onComplete: () => {
                //TODO - check if it has more moves \

                const hasAnotherMove = false;
                this.setInteraction(hasAnotherMove);
                this.scene.events.emit('check-end-turn');
            }
        })
    }

    skipMove(): void {
        this.pendingAction = false;
        this.setInteraction(false);
        this.scene.events.emit('check-end-turn');
    }

    performHit(row: number, col: number): void {
        //TODO - implement hit
        this.pendingAction = false;
        this.setInteraction(false);
    }

    takeDamege(damage: number): void {

        let dmg = damage - this.unitData.shield;
        if (dmg > this.unitData.health) dmg = this.unitData.health;
        if (dmg < 0) dmg = 0;

        let healthLeft = this.unitData.health - dmg;
        if (healthLeft < 0) healthLeft = 0;

        this.unitData.health = healthLeft;
        this.health_text.setText(healthLeft.toString());

        const lostHealth = this.scene.add.text(
            0,
            0,
            (dmg * -1).toString(),
            {
                fontFamily: 'Arial Black', fontSize: 40, color: '#ff0000',
                stroke: '#000000', strokeThickness: 2,
                align: 'center'
            });
        lostHealth.setOrigin(0.5);
        this.add(lostHealth);
        this.scene.tweens.add({
            targets: lostHealth,
            // alpha: { value: 0, delay: 2750 },
            y: 75,
            duration: 1500,
            onComplete: () => {
                if (healthLeft === 0) {
                    this.die();
                } else {
                    this.scene.events.emit('check-end-turn');
                }
                lostHealth.destroy(true);
            }
        })
    }

    die() {
        // this.alpha = 0.5;
        this.emit('monster-died', this.unitData);
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                this.scene.events.emit('check-end-turn');
            }
        })
    }

    setIdlePendingMove(): void {
        const initialScale = this.scale;
        this.idleTween = this.scene.tweens.add({
            targets: this,
            scale: 1.03,
            yoyo: true,
            repeat: -1,
            duration: 650,
            // ease: 'Back.easeOut'
        })
    }
}
