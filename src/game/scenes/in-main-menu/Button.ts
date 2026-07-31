
const FONT_SIZE = 50;
const MAX_WIDTH = 95;

export class Button extends Phaser.GameObjects.Container {

    private initialScale: number;
    bg: Phaser.GameObjects.Image;
    text: Phaser.GameObjects.Text;
    revealOverlay: Phaser.GameObjects.Graphics;
    spellFilledTween: Phaser.Tweens.Tween;
    readyForUse: boolean = false;
    cooldownText: Phaser.GameObjects.Text;
    usedCurrentRound:boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, text: string | null, action: Function, disableInteraction: boolean = false, initialScale: number = 1) {
        super(scene, x, y);
        this.scene = scene;
        this.initialScale = initialScale;
        this.bg = this.scene.add.image(0, 0, texture);
        this.add(this.bg);
        this.bg.setOrigin(0.5);
        disableInteraction ? this.bg.disableInteractive() : this.bg.setInteractive();
        this.setAlpha(disableInteraction ? 0.65 : 1);
        this.bg.on('pointerover', () => {
            this.scene.tweens.add({
                targets: this,
                scale: this.initialScale * 1.025,
                duration: 150,
            })
        });
        this.bg.on('pointerout', () => {
            this.scene.tweens.add({
                targets: this,
                scale: this.initialScale,
                duration: 150,
            })
        });
        this.bg.on('pointerdown', () => {
            this.disableInteractive();
            this.setScale(initialScale);
            action();
        });

        this.setScale(initialScale);
        this.scene.add.existing(this);

        if (text) {
            this.text = this.scene.add.text(
                0,
                0,
                `${text}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: FONT_SIZE, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5);
            this.add(this.text);

            if (this.text.width > MAX_WIDTH) {
                this.text.setScale(MAX_WIDTH / this.text.displayWidth)
            }
        }
    }

    setInteractive(): this {
        this.bg.setInteractive();
        this.setAlpha(1);
        return this;
    }

    disableInteractive(): this {
        this.bg.disableInteractive();
        this.setAlpha(0.45);
        return this;
    }

    addRevealOverlay() {
        this.revealOverlay = this.scene.add.graphics();
        this.add(this.revealOverlay);
        this.setAlpha(1);
        this.addCooldownText();
    }

    addCooldownText() {
        this.cooldownText = this.scene.add.text(
            this.x,
            this.y,
            ``,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: FONT_SIZE, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4, strokeThickness:4,
                align: 'center'
            }).setOrigin(0.5);
    }

    onSpellUse() {
        this.updateCooldownText('x');
        this.usedCurrentRound = true;
    }

    updateCooldownText(text: string) {
        if (text <= '0') text = '';
        this.cooldownText.setText(text);
    }

    updateCooldown(turnsCompleted: number, totalTurns: number) {

        const radius = this.bg.width / 2;

        this.revealOverlay.clear();

        // Spell ready
        if (turnsCompleted >= totalTurns) {
            return;
        }

        const progress = turnsCompleted / totalTurns;

        const topAngle = -Math.PI / 2;

        const revealAngle = topAngle + progress * Math.PI * 2;

        this.revealOverlay.fillStyle(0x000000, 0.65);

        this.revealOverlay.beginPath();

        this.revealOverlay.moveTo(0, 0);

        // Draw ONLY the remaining cooldown area
        this.revealOverlay.arc(
            0,
            0,
            radius,
            revealAngle,
            topAngle + Math.PI * 2,
            false
        );

        this.revealOverlay.closePath();
        this.revealOverlay.fillPath();
        this.setAlpha(1);
    }

    tweenUpdateCooldown(turnsCompleted: number, totalTurns: number) {
        this.updateCooldownText(`${totalTurns - turnsCompleted}`);
        this.scene.tweens.addCounter({
            from: turnsCompleted - 1,
            to: turnsCompleted,
            duration: 500,
            onUpdate: tween => {
                this.updateCooldown(
                    tween.getValue(),
                    totalTurns
                );
            }
        });
    }

    startSpellFilledTween(setInteractive: boolean) {
        this.setAlpha(1);
        if (setInteractive) {
            this.setInteractive();
        } else {
            this.disableInteractive();
        }
        this.spellFilledTween = this.scene.tweens.add({
            targets: this,
            scale: this.initialScale * 1.05,
            duration: 450,
            yoyo: true,
            repeat: -1
        })
        this.revealOverlay.clear();
    }

    removeSpellFilledTween() {
        this.setAlpha(1);
        this.disableInteractive();
        if (this.spellFilledTween) {
            this.spellFilledTween.remove();
            this.spellFilledTween = null;
            this.setScale(this.initialScale);
        }
        this.revealOverlay.clear();
    }

    animateSpellTrigger(onComplete: () => void) {
        this.setScale(this.initialScale);
        this.scene.tweens.chain({
            targets: this,
            tweens: [
                {
                    scale: this.initialScale * 0.9,
                    yoyo: true,
                    duration: 150,
                    ease: 'Cubic.easeOut'
                },
                {
                    scale: this.initialScale * 1.1,
                    yoyo: true,
                    duration: 150,
                    ease: 'Cubic.easeOut'
                },
                {
                    scale: this.initialScale * 1.2,
                    yoyo: true,
                    duration: 150,
                    ease: 'Cubic.easeOut'
                },
                {
                    scale: this.initialScale * 1.3,
                    yoyo: true,
                    duration: 150,
                    ease: 'Cubic.easeOut'
                },
                {
                    scale: this.initialScale * 1.4,
                    yoyo: true,
                    duration: 150,
                    onComplete: () => {
                        this.setScale(this.initialScale);
                        onComplete();
                    },
                    ease: 'Cubic.easeOut'
                }
            ]
        })
    }
}
