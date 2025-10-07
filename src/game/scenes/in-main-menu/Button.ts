
const FONT_SIZE = 50;
const MAX_WIDTH = 95;

export class Button extends Phaser.GameObjects.Container {

    private initialScale: number;
    private bg: Phaser.GameObjects.Image;
    text: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, text: string | null, action: Function, disableInteraction: boolean = false, initialScale: number = 1) {
        super(scene, x, y);
        this.scene = scene;
        this.initialScale = initialScale;
        this.bg = this.scene.add.image(0, 0, texture);
        this.add(this.bg);
        this.bg.setOrigin(0.5);
        disableInteraction ? this.bg.disableInteractive() : this.bg.setInteractive();
        this.bg.setAlpha(disableInteraction ? 0.65 : 1);
        this.bg.on('pointerover', () => {
            this.scene.tweens.add({
                targets: this,
                scale: this.initialScale * 1.05,
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
        this.bg.setAlpha(1);
        return this;
    }

    disableInteractive(): this {
        this.bg.disableInteractive();
        this.bg.setAlpha(0.65);
        return this;
    }
}