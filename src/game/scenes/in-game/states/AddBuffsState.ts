import { Game } from '../../Game';
import { BaseState } from './BaseState';
import { PlayerMonsterSelectedState } from './PlayerMonsterSelectedState';
import { PlayerTurnIdleState } from './PlayerTurnIdleState';
import { preparePlayerTurn } from './PlayerTurnStartState';
import { main_config, GAME_OBJECT_DEPTHS } from '../../../configs/main_config';

/**
 * The player's turn starts (after poison and resurrections): decides whether a buff drops from
 * the sky this round (checkShouldAddBuffs + addBuffs(1) in Game-old.ts) and, if so, lets it land.
 * Then hands control to the player: resets the player's monsters (old addInteraction) and exits
 * to PLAYER_MONSTER_SELECTED_STATE, or to PLAYER_TURN_IDLE_STATE when every player monster is frozen.
 */
export class AddBuffsState extends BaseState {

    enter(context: Game): void {
        this.active = true;
        console.log('[AddBuffsState] enter');

        // spells stay locked while the buff is falling
        context.updatePlayerSpellButtonsInteraction(true);

        // not every round brings a buff
        if (Phaser.Math.RND.between(0, 100) > main_config.buffs.chanceForBuffAfterRound) {
            this.exitState(context);
            return;
        }

        const row = Phaser.Math.Between(0, main_config.gridSizeVertical - 1);
        const col = Phaser.Math.Between(
            main_config.buffs.buffsStartLevelColumn.min,
            main_config.buffs.buffsStartLevelColumn.max
        );

        if (
            context.data.list.gridPositions[row][col].occupiedBy?.length ||
            context.data.list.gridPositions[row][col].buff
        ) {
            // no luck - the position is occupied by a monster or already has a buff
            this.exitState(context);
            return;
        }

        // reserve the position, show the question marks and let the parachute drop
        context.data.list.gridPositions[row][col].buff = true;
        context.questionMarkContainer = context.add.container().setDepth(GAME_OBJECT_DEPTHS.gameSceneQuestionMarkContainer);
        context.addQuestionMarks();

        context.addParachute(() => {
            if (!this.active) return;
            context.addBuff(row, col, false);
            this.exitState(context);
        });
    }

    exit(_context: Game): void {
        this.active = false;
        console.log('[AddBuffsState] exit');
    }

    // ── private ──────────────────────────────────────────────────────────────

    private exitState(context: Game): void {
        if (!this.active) return;

        // question marks are removed by preparePlayerTurn
        const firstAvailable = preparePlayerTurn(context);

        if (firstAvailable) {
            context.stateMachine.setState(new PlayerMonsterSelectedState(firstAvailable));
        } else {
            // all player monsters are frozen - the player can still use spells and end the turn manually
            context.stateMachine.setState(new PlayerTurnIdleState());
        }
    }
}
