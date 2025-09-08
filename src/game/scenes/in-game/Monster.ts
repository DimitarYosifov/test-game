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
    outline: Phaser.GameObjects.Graphics;
    outlineColor: number;
    emitter: Phaser.GameObjects.Particles.ParticleEmitter;

    constructor(scene: Scene, x: number, y: number, displayWidth: number, displayHeight: number, unit: IUnitData, index: number, isPlayerMonster: boolean) {
        super(scene, x, y);
        this.scene = scene;
        this.unitData = unit;
        this.unitData.movesLeft = this.unitData.moves;
        this.index = index;

        //bg
        this.bg = scene.add.image(0, 0, unit.type).setOrigin(0.5);
        this.bg.displayWidth = displayWidth;
        this.bg.displayHeight = displayHeight;
        this.add([this.bg]);

        //emitter
        this.addEmitter();

        //outline
        this.outlineColor = isPlayerMonster ? 0x22c422 : 0xff0000;
        this.outline = this.scene.add.graphics();
        this.outline.lineStyle(5, this.outlineColor);
        // this.outline.moveTo(this.bg.displayWidth / -2, this.bg.displayHeight / -2);
        // this.outline.lineTo(this.bg.displayWidth / 2, this.bg.displayHeight / -2);
        // this.outline.lineTo(this.bg.displayWidth / 2, this.bg.displayHeight / 2);
        // this.outline.lineTo(this.bg.displayWidth / -2, this.bg.displayHeight / 2);
        // this.outline.lineTo(this.bg.displayWidth / -2, this.bg.displayHeight / -2);
        // this.outline.strokePath();

        this.outline.strokeRect(
            -this.bg.displayWidth / 2,
            -this.bg.displayHeight / 2,
            this.bg.displayWidth,
            this.bg.displayHeight
        );

        this.outline.setPosition(0, 0);
        this.add(this.outline);

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


    repeatMove(): void {
        console.log('repeatMove');
        // this.pendingAction = true;
        if (this.scene.data.list.isPlayerTurn) {
            this.scene.events.emit('monster-selected', [this, this.unitData, true]);
        } else {
            this.scene.events.emit('repeat-opponent-move');
        }
    }

    private addInteraction(): void {
        this.bg.on('pointerdown', () => {
            this.scene.events.emit('monster-selected', [this, this.unitData, false]);
        });
    }

    setInteraction(interactive: boolean, skipByUser: boolean = false): void {
        // skipByUser is false for the currentlySelectedMonster when skipped
        interactive ? this.bg.setInteractive() : this.bg.disableInteractive();
        if (interactive && !skipByUser) {
            this.setIdlePendingMove();
        } else {
            if (this.idleTween && !skipByUser) {
                this.scale = 1;
                this.idleTween.remove();
                this.idleTween = null;
            }
        }
    }

    addEmitter() {
        this.emitter = this.scene.add.particles(this.bg.x, this.bg.y, 'blood-drop', {
            x: this.bg.x,
            y: this.bg.y,
            speed: { min: 85, max: 180 },
            angle: { min: 0, max: 360 },
            lifespan: 800,
            quantity: 100,
            scale: { start: 0.4, end: 0 },
            alpha: { start: 1, end: 0 },
            blendMode: 'ADD',
            emitting: false
        })
        // this.emitter.startFollow(this.bg);
        this.addAt(this.emitter, 0);
    }

    move(row: number, col: number) {
        this.emitter.emitting = true;

        // return;
        this.pendingAction = false;
        // this.bg.disableInteractive();
        const position = this.scene.data.list.gridPositions[row][col];
        this.unitData.row = row;
        this.unitData.col = col;
        this.scene.tweens.add({
            delay: this.scene.data.list.isPlayerTurn ? 250 : 1000,
            targets: this,
            scale: { value: 1.15, yoyo: true, duration: 250 },
            x: position.x,
            y: position.y,
            duration: 500,
            ease: 'Cubic.easeInOut',
            onStart: () => {
                this.emitter.emitting = false;
                this.setInteraction(false);
            },
            onComplete: () => {
                this.unitData.movesLeft--;
                const hasAnotherMove = this.unitData.movesLeft !== 0;
                this.setInteraction(hasAnotherMove);
                if (hasAnotherMove) {
                    this.repeatMove();
                } else {
                    this.scene.events.emit('check-end-turn');
                }
            }
        })
    }

    skipMove(skipByUser: boolean = false): void {
        this.pendingAction = false;
        this.setInteraction(false, skipByUser);
        this.unitData.movesLeft--;
        this.scene.events.emit('check-end-turn', skipByUser);
    }

    performHit(target: Monster | null, isTargetToTheLeft: boolean, complete: Function): void {

        this.emitter.emitting = true;
        this.pendingAction = false;
        this.setInteraction(false);
        this.unitData.movesLeft--;

        const glbPos = this.bg.getBounds()
        const x = glbPos.x + this.bg.displayWidth / 2;
        const y = glbPos.y + this.bg.displayHeight / 2;
        const targetGlobalPos = target!.bg.getBounds();
        const targetX = targetGlobalPos.x + target!.bg.displayWidth / 2;

        const targetY = targetGlobalPos.y + target!.bg.displayHeight / 2;
        const weaponImg = this.scene.add.image(x, y, 'sword').setScale(this.bg.displayWidth * 0.5 / 100).setOrigin(0.5);
        const startAngle = isTargetToTheLeft ? 45 : -45;
        const endAngle = isTargetToTheLeft ? -45 : 45;
        const isRangedAttack = this.unitData.ranged > 0;

        const emitter: Phaser.GameObjects.Particles.ParticleEmitter = this.scene.add.particles(targetX, targetY, 'blood-drop', {
            lifespan: 1000,
            speed: { random: [75, 150] },
            scale: { start: 0.5, end: 0 },
            gravityY: 100,
            emitting: false
        })

        // S W O R D   A T T A C K
        if (isRangedAttack) {
            weaponImg.setTexture('bow-arrow');
            let angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(target!.x, target!.y, this.x, this.y));
            angle -= 90;
            weaponImg.setScale(this.bg.displayWidth * 1 / 100);
            weaponImg.angle = angle;
            this.scene.tweens.chain({
                targets: weaponImg,
                tweens: [
                    {
                        x: targetX,
                        y: targetY,
                        duration: 300,
                        ease: 'Cubic.easeIn',
                        onStart: () => {
                            this.emitter.emitting = false;
                        },
                        onComplete: () => {
                            complete();
                            this.emitter.emitting = false;
                            emitter.explode(48);
                        }
                    },
                    {
                        alpha: { value: 0, duration: 1000 },
                        delay: 750,
                        onComplete: () => {
                            emitter.destroy(true);
                            weaponImg.destroy(true);
                        }
                    }
                ]
            })
        }
        // A R R O W   A T T A C K
        else {
            this.scene.tweens.chain({
                targets: weaponImg,
                tweens: [
                    {
                        targets: weaponImg,
                        angle: startAngle,
                        duration: 150,
                        delay: this.scene.data.list.isPlayerTurn ? 250 : 1000,
                        onStart: () => {
                            this.emitter.emitting = false;
                        }
                    },
                    {
                        angle: { value: endAngle, duration: 150 },
                        x: targetX,
                        y: targetY,
                        duration: 150,
                        ease: 'Cubic.easeOut',
                        onComplete: () => {
                            complete();
                            this.emitter.emitting = false;
                            emitter.explode(48);
                        }
                    },
                    {
                        alpha: { value: 0, duration: 1000 },
                        delay: 500,
                        onComplete: () => {
                            emitter.destroy(true);
                            weaponImg.destroy(true);
                        }
                    }
                ]
            })
        }
    }

    takeDamege(damage: number): void {

        let dmg = damage - this.unitData.shield;
        if (dmg > this.unitData.health) dmg = this.unitData.health;
        if (dmg < 0) dmg = 0;

        let healthLeft = this.unitData.health - dmg;
        if (healthLeft < 0) healthLeft = 0;

        this.unitData.health = healthLeft;
        this.health_text.setText(healthLeft.toString());


        const glbPos = this.bg.getBounds()
        const x = glbPos.x + this.bg.displayWidth / 2;
        const y = glbPos.y + this.bg.displayHeight / 2;
        const lostHealth = this.scene.add.text(
            x,
            y,
            (dmg * -1).toString(),
            {
                fontFamily: 'Arial Black', fontSize: 40, color: '#ff0000',
                stroke: '#000000', strokeThickness: 2,
                align: 'center'
            });
        lostHealth.setOrigin(0.5);
        // this.add(lostHealth);
        this.scene.tweens.add({
            targets: lostHealth,
            // alpha: { value: 0, delay: 2750 },
            y: y + 75,
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
            scale: 1.05,
            yoyo: true,
            repeat: -1,
            duration: 650,
            // ease: 'Back.easeOut'  
        })


        // const shape = new Phaser.Geom.Rectangle(this.bg.width / -4, this.bg.height / -4, this.bg.width / 2, this.bg.height / 2);
        // const emitter: Phaser.GameObjects.Particles.ParticleEmitter = this.scene.add.particles(0, 0, 'circle', {
        //     // frame: { frames: ['pendinMoveParticle'] }
        //     // blendMode: 'ADD',
        //     lifespan: 500,
        //     scale: { start: 0.3, end: 0.1 }
        // })
        // emitter.addEmitZone({ type: 'edge', source: shape, quantity: 64, total: 64 });
        // this.add(emitter)

        // this.bg.postFX.addGlow(0xffffff, 8, 0, false, 0.1, 16);
    }
}
