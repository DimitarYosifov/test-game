import { Game } from '../../Game';
import { BaseState } from './BaseState';
import { PlayerTurnStartState } from './PlayerTurnStartState';
import { main_config, GAME_OBJECT_DEPTHS } from '../../../configs/main_config';

export class LevelIntroState extends BaseState {

    private pendingParachutes: number = 0;

    enter(context: Game): void {
        this.active = true;
        console.log('[LevelIntroState] enter');

        context.updatePlayerSpellButtonsInteraction(true);

        context.questionMarkContainer = context.add.container().setDepth(GAME_OBJECT_DEPTHS.gameSceneQuestionMarkContainer);
        context.addQuestionMarks();

        const totalBuffsCount = Phaser.Math.Between(
            main_config.buffs.quantityAtLevelStart.min,
            main_config.buffs.quantityAtLevelStart.max
        );

        this.pendingParachutes = 0;

        for (let index = 0; index < totalBuffsCount; index++) {
            const row = Phaser.Math.Between(0, main_config.gridSizeVertical - 1);
            const col = Phaser.Math.Between(
                main_config.buffs.buffsStartLevelColumn.min,
                main_config.buffs.buffsStartLevelColumn.max
            );

            if (
                context.data.list.gridPositions[row][col].occupiedBy?.length ||
                context.data.list.gridPositions[row][col].buff
            ) {
                // position occupied or already has a buff - skip
                continue;
            }

            // mark position so no two parachutes target the same spot
            context.data.list.gridPositions[row][col].buff = true;
            this.pendingParachutes++;

            context.addParachute(() => {
                if (!this.active) return;

                context.addBuff(row, col, false);
                this.pendingParachutes--;

                if (this.pendingParachutes <= 0) {
                    this.onAllParachutesLanded(context);
                }
            });
        }

        // if no parachutes were spawned (all positions occupied), transition immediately
        if (this.pendingParachutes === 0) {
            this.onAllParachutesLanded(context);
        }
    }

    exit(context: Game): void {
        this.active = false;
        console.log('[LevelIntroState] exit');
        context.removeQuestionMarks();
    }

    private onAllParachutesLanded(context: Game): void {
        if (!this.active) return;
        console.log('[LevelIntroState] all parachutes landed -> PlayerTurnStartState');
        context.stateMachine.setState(new PlayerTurnStartState());
    }
}
