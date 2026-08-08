import { Scene } from "phaser";
import { GAME_OBJECT_DEPTHS, getRandomNonNullIndex } from "../../../configs/main_config";
import { SpriteAnimation } from "../../SpriteAnimation";
import { Monster } from "../Monster";
import { IFreeze, IPoison } from "../../../configs/level_config";
import { GAME_SCENE_SCENE_EVENTS } from "../../Game";

export class FreezeSpell {

    private scene: Phaser.Scene;
    private mainGridContainer: Phaser.GameObjects.Container;

    constructor(scene: Scene, mainGridContainer: Phaser.GameObjects.Container, targetMonsters: any, freezeData: IFreeze) {

        this.scene = scene;
        this.mainGridContainer = mainGridContainer;

        let targetsCount = freezeData.targets;
        const duration = freezeData.duration;

        const proceed = () => {
            targetsCount--;

            // notice here already frozen enemy CAN be targeted, which will affect only the freeze duration!!!
            const targetMonsterIndex = getRandomNonNullIndex(targetMonsters);
            const targetMonster: Monster = targetMonsters[targetMonsterIndex];
            const emitCheckEndTurnOnComplete = targetsCount === 0;

            if (targetMonster.immuneTo.includes('freeze')) {
                targetMonster.showImmuneText();
                if (emitCheckEndTurnOnComplete) {
                    this.scene.events.emit(GAME_SCENE_SCENE_EVENTS.CHECK_END_TURN);
                }
            } else {
                targetMonster.setFrozen(duration, () => {
                    if (emitCheckEndTurnOnComplete) {
                        this.scene.events.emit(GAME_SCENE_SCENE_EVENTS.CHECK_END_TURN);
                    }
                });
            }

            if (targetsCount > 0) {
                this.scene.time.delayedCall(200, () => {
                    proceed();
                })
            }
        }

        proceed();
    }
}
