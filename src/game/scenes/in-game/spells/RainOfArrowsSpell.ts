import { Scene } from "phaser";
import { GAME_OBJECT_DEPTHS, getRandomNonNullIndex } from "../../../configs/main_config";
import { SpriteAnimation } from "../../SpriteAnimation";
import { Monster } from "../Monster";
import { IMagicBall } from "../../../configs/level_config";

export class RainOfArrowsSpell {


    private scene: Phaser.Scene;
    private mainGridContainer: Phaser.GameObjects.Container;

    constructor(scene: Scene, mainGridContainer: Phaser.GameObjects.Container, targetMonsters: any, rainOfArrowsData: IMagicBall) {

        this.scene = scene;
        this.mainGridContainer = mainGridContainer;

        let targetsCount = rainOfArrowsData.targets;
        const damage = rainOfArrowsData.damage;

        const proceed = () => {
            targetsCount--;
            const targetMonstеrIndex = getRandomNonNullIndex(targetMonsters);
            const targetMonster: Monster = targetMonsters[targetMonstеrIndex];
            const targetX = targetMonster.x + this.mainGridContainer.x;
            const targetY = targetMonster.y + this.mainGridContainer.y;
            const emitCheckEndTurnOnComplete = targetsCount === 0; // IMPORTANT - true if it last magic ball!!!!!!!!!!!

            let arrow = this.scene.add.image(targetX, 0, 'bow-arrow')
                .setScale(1.15)
                .setOrigin(0.5, 0)
                .setAngle(180)
                .setDepth(GAME_OBJECT_DEPTHS.spell);

            this.scene.tweens.add({
                targets: arrow,
                duration: 100 + (targetMonster.unitData.row * 50),
                y: targetY,
                onComplete: () => {
                    this.scene.tweens.add({
                        targets: arrow,
                        duration: 1000,
                        alpha: 0,
                        onComplete: () => {
                            arrow.destroy(true);
                        }
                    })
                    // let magicAnimation = new SpriteAnimation(this.scene, targetX, targetY, 'magic-animation', 'magic-animation', 'spinrevelfx_', false, 16, 1, 1, 5)
                    // magicAnimation.animation!.once('animationcomplete', () => {
                    //     magicAnimation.animation?.destroy(true);
                    //     this.scene.time.delayedCall(2000, () => {
                    //         emitter.destroy(true);
                    //     })
                    // });
                    const finalDamage = damage - targetMonster.unitData.shield;
                    targetMonster.takeDamege(finalDamage, true, true, emitCheckEndTurnOnComplete, 0, true);

                    const emitter: Phaser.GameObjects.Particles.ParticleEmitter = this.scene.add.particles(targetX, targetY, 'blood-drop', {
                        lifespan: 1400,
                        speed: { random: [75, 150] },
                        scale: { start: 0.75, end: 0.2 },
                        gravityY: 125,
                        emitting: false
                    }).setDepth(GAME_OBJECT_DEPTHS.monsterHitEmitter)
                    emitter.emitting = false;
                    emitter.explode(48);

                    this.scene.time.delayedCall(300, () => {
                        emitter.emitting = false;
                    })

                    this.scene.time.delayedCall(2000, () => {
                        emitter.destroy(true);
                    })
                }
            })

            if (targetsCount > 0) {
                this.scene.time.delayedCall(300, () => {
                    proceed();
                })
            }
        }

        proceed();
    }
}
