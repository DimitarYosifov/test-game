
export class SpriteAnimation {

    animation: Phaser.GameObjects.Sprite;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        frame: string | number,
        prefix: string,
        loop: boolean = true,
        totalFrames: number = 30,
        scaleX: number = 1,
        scaleY: number = 1,
        zeroPad: number = 5
    ) {
        scene.anims.create({
            key: texture,
            frames: scene.anims.generateFrameNames(texture, {
                prefix,
                start: 0,
                end: totalFrames - 1,
                zeroPad,
                suffix: '.png'
            }),
            frameRate: 30,
            repeat: loop ? -1 : 0
        });

        this.animation = scene.add.sprite(x, y, texture)
            .setName('sprite-animation')
            .setDepth(22)
            .setOrigin(0.5)
            .setScale(scaleX, scaleY)
            .play(texture);
    }

    pause(): SpriteAnimation {
        this.animation.anims.pause();
        return this;
    }

    resume(): SpriteAnimation {
        this.animation.anims.resume();
        return this;

    }

    hide(): SpriteAnimation {
        this.animation.setAlpha(0);
        return this;

    }

    show(): SpriteAnimation {
        this.animation.setAlpha(1);
        return this;

    }

    moveTo(x: number, y: number): SpriteAnimation {
        this.animation.setPosition(x, y);
        return this;

    }
}