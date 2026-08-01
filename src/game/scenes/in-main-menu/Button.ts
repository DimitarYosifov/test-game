import { GAME_OBJECT_DEPTHS } from "../../configs/main_config";

const FONT_SIZE = 50;
const MAX_WIDTH = 95;
const SHOW_POPUP_WHEN_HOVERED_FOR = 1000;

export class Button extends Phaser.GameObjects.Container {

    private initialScale: number;
    bg: Phaser.GameObjects.Image;
    text: Phaser.GameObjects.Text;
    revealOverlay: Phaser.GameObjects.Graphics;
    spellFilledTween: Phaser.Tweens.Tween;
    readyForUse: boolean = false;
    cooldownText: Phaser.GameObjects.Text;
    usedCurrentRound: boolean = false;
    infoPopup: Phaser.GameObjects.Image;
    infoPopupText: Phaser.GameObjects.Text;
    currentPopupTween: Phaser.Tweens.Tween;
    delayedShowPopupEvent: Phaser.Time.TimerEvent;
    enabled: boolean = false;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        text: string | null,
        action: Function,
        disableInteraction: boolean = false,
        initialScale: number = 1,
        addInfoPopup: boolean = false,
        infoPopupDescription: string = '',
        infoPopupFlippedX: boolean = false
    ) {
        super(scene, x, y);
        this.scene = scene;
        this.initialScale = initialScale;
        this.bg = this.scene.add.image(0, 0, texture).setInteractive();
        this.add(this.bg);
        this.bg.setOrigin(0.5);
        disableInteraction ? this.disableInteractive() : this.setInteractive();
        this.setAlpha(disableInteraction ? 0.65 : 1);

        if (addInfoPopup) {
            this.createInfoPopup(x, y, infoPopupDescription, infoPopupFlippedX);
        }

        this.bg.on('pointerover', () => {
            if (addInfoPopup) {
                this.delayedShowPopupEvent = this.scene.time.delayedCall(SHOW_POPUP_WHEN_HOVERED_FOR, () => {
                    this.tweenPopupVisibility(true);
                    this.delayedShowPopupEvent = null;
                })
            }

            if (!this.enabled) {
                return;
            }

            this.scene.tweens.add({
                targets: this,
                scale: this.initialScale * 1.025,
                duration: 150,
            })
        });
        this.bg.on('pointerout', () => {
            if (addInfoPopup) {
                if (this.delayedShowPopupEvent) {
                    this.delayedShowPopupEvent.remove();
                }
                this.tweenPopupVisibility(false);
            }

            if (!this.enabled) {
                return;
            }

            this.scene.tweens.add({
                targets: this,
                scale: this.initialScale,
                duration: 150,
            })
        });
        this.bg.on('pointerdown', () => {

            if (!this.enabled) {
                return;
            }

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

    tweenPopupVisibility(show: boolean) {
        this.currentPopupTween = this.scene.tweens.add({
            targets: [this.infoPopup, this.infoPopupText],
            alpha: +show,
            duration: 200
        })
    }

    createInfoPopup(x: number, y: number, infoPopupDescription: string, infoPopupFlippedX: boolean) {
        this.infoPopup = this.scene.add.image(infoPopupFlippedX ? x + 350 : x - 350, y + 100, 'info-popup')
            .setOrigin(0.5)
            .setScale(2)
            .setAlpha(0)
            .setDepth(GAME_OBJECT_DEPTHS.buttonDescriptionPopup);


        this.infoPopup.flipX = infoPopupFlippedX;

        this.infoPopupText = this.scene.add.text(
            infoPopupFlippedX ? this.infoPopup.x + 20 : this.infoPopup.x,
            this.infoPopup.y,
            `${infoPopupDescription}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 44, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4, wordWrap: { width: 500 },
                align: 'center'
            })
            .setOrigin(0.5)
            .setAlpha(0)
            .setDepth(GAME_OBJECT_DEPTHS.buttonDescriptionPopup);
    }

    setInteractive(): this {
        this.enabled = true;
        this.setAlpha(1);
        return this;
    }

    disableInteractive(): this {
        this.enabled = false;
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
                stroke: '#000000', letterSpacing: 4, strokeThickness: 4,
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
