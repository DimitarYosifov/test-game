import { Scene } from "phaser";
import { getRandomNonNullIndex } from "../../../configs/main_config";
import { Monster } from "../Monster";
import { IHeal } from "../../../configs/level_config";
import { BUFF_TYPES } from "../../Game";

export class HealSpell {

    private scene: Phaser.Scene;
    private mainGridContainer: Phaser.GameObjects.Container;

    constructor(scene: Scene, mainGridContainer: Phaser.GameObjects.Container, targetMonsters: any, healData: IHeal) {

        this.scene = scene;
        this.mainGridContainer = mainGridContainer;

        let targetsCount = healData.targets;
        const healAmount = healData.amount;

        const proceed = () => {
            targetsCount--;
            const targetMonstеrIndex = getRandomNonNullIndex(targetMonsters);
            const targetMonster: Monster = targetMonsters[targetMonstеrIndex];
            const emitCheckEndTurnOnComplete = targetsCount === 0; // IMPORTANT - true if it last heal!!!!!!!!!!!

            targetMonster.addHealth(true, healAmount);
            targetMonster.addBUffCollected(targetMonster.unitData.row, targetMonster.unitData.col, healAmount, BUFF_TYPES.HEALTH, emitCheckEndTurnOnComplete);

            if (targetsCount > 0) {
                this.scene.time.delayedCall(300, () => {
                    proceed();
                })
            }
        }

        proceed();
    }
}
