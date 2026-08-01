import { Scene } from "phaser";
import { GAME_OBJECT_DEPTHS, getRandomNonNullIndex } from "../../../configs/main_config";
import { SpriteAnimation } from "../../SpriteAnimation";
import { Monster } from "../Monster";
import { IMagicBall } from "../../../configs/level_config";
import { GAME_SCENE_SCENE_EVENTS } from "../../Game";

export class MagicBallSpell {

    private scene: Phaser.Scene;
    private mainGridContainer: Phaser.GameObjects.Container;

    constructor(scene: Scene, mainGridContainer: Phaser.GameObjects.Container, targetMonsters: any, magicBallData: IMagicBall) {

        this.scene = scene;
        this.mainGridContainer = mainGridContainer;

        let targetsCount = magicBallData.targets;
        const damage = magicBallData.damage;

        const proceed = () => {
            targetsCount--;
            const targetMonstеrIndex = getRandomNonNullIndex(targetMonsters);
            const targetMonster: Monster = targetMonsters[targetMonstеrIndex];
            const targetX = targetMonster.x + this.mainGridContainer.x;
            const targetY = targetMonster.y + this.mainGridContainer.y;
            const emitCheckEndTurnOnComplete = targetsCount === 0; // IMPORTANT - true if it last magic ball!!!!!!!!!!!

            let magicBall = this.scene.add.image(targetX, 0, 'ball')
                .setScale(0.75)
                .setOrigin(0.5)
                .setDepth(GAME_OBJECT_DEPTHS.spell);

            this.scene.tweens.add({
                targets: magicBall,
                duration: 100 + (targetMonster.unitData.row * 50),
                y: targetY,
                onComplete: () => {
                    let emitter: null | Phaser.GameObjects.Particles.ParticleEmitter = null;
                    magicBall.destroy(true);
                    let magicAnimation = new SpriteAnimation(this.scene, targetX, targetY, 'magic-animation', 'magic-animation', 'spinrevelfx_', false, 16, 1, 1, 5)
                    magicAnimation.animation!.once('animationcomplete', () => {
                        magicAnimation.animation?.destroy(true);
                        this.scene.time.delayedCall(2000, () => {
                            if (emitter) {
                                (emitter as Phaser.GameObjects.Particles.ParticleEmitter).destroy(true);
                            }
                        })
                    });

                    if (targetMonster.immuneTo.includes('magic-ball')) {
                        targetMonster.showImmuneText();
                        if (emitCheckEndTurnOnComplete) {
                            this.scene.events.emit(GAME_SCENE_SCENE_EVENTS.CHECK_END_TURN);
                        }
                        return;
                    } else {
                        targetMonster.takeDamege(damage, true, true, emitCheckEndTurnOnComplete, 0, true);
                    }

                    emitter = this.scene.add.particles(targetX, targetY, 'blood-drop', {
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
