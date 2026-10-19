import { Game, GAME_SCENE_SCENE_EVENTS } from '../../Game';
import { BaseState } from './BaseState';
import { PlayerMonsterSelectedState } from './PlayerMonsterSelectedState';
import { Monster } from '../Monster';

export class PlayerMovingState extends BaseState {

    readonly newRow: number;
    readonly newCol: number;

    private onMoveComplete: () => void;

    constructor(newRow: number, newCol: number) {
        super();
        this.newRow = newRow;
        this.newCol = newCol;
    }

    enter(context: Game): void {
        this.active = true;
        console.log('[PlayerMovingState] enter - row:', this.newRow, 'col:', this.newCol);

        const monster = context.currentlySelectedMonster;

        // ── update grid positions before the move tween starts ──────────────
        const currentData = monster.unitData;

        // clear old position
        context.data.list.gridPositions[currentData.row][currentData.col].isEmpty = true;
        delete context.data.list.gridPositions[currentData.row][currentData.col].occupiedBy;
        delete context.data.list.gridPositions[currentData.row][currentData.col].giantData;

        if (monster.isGiant) {
            delete context.data.list.gridPositions[currentData.row][currentData.col + 1].occupiedBy;
            delete context.data.list.gridPositions[currentData.row + 1][currentData.col].occupiedBy;
            delete context.data.list.gridPositions[currentData.row + 1][currentData.col + 1].occupiedBy;
            context.data.list.gridPositions[currentData.row][currentData.col + 1].isEmpty = true;
            context.data.list.gridPositions[currentData.row + 1][currentData.col].isEmpty = true;
            context.data.list.gridPositions[currentData.row + 1][currentData.col + 1].isEmpty = true;
            delete context.data.list.gridPositions[currentData.row][currentData.col + 1].giantData;
            delete context.data.list.gridPositions[currentData.row + 1][currentData.col].giantData;
            delete context.data.list.gridPositions[currentData.row + 1][currentData.col + 1].giantData;
        }

        // mark new position
        context.data.list.gridPositions[this.newRow][this.newCol].isEmpty = false;
        context.data.list.gridPositions[this.newRow][this.newCol].occupiedBy = 'player';

        if (monster.isGiant) {
            context.data.list.gridPositions[this.newRow][this.newCol + 1].occupiedBy = 'opponent';
            context.data.list.gridPositions[this.newRow + 1][this.newCol].occupiedBy = 'opponent';
            context.data.list.gridPositions[this.newRow + 1][this.newCol + 1].occupiedBy = 'opponent';
            context.data.list.gridPositions[this.newRow][this.newCol + 1].isEmpty = false;
            context.data.list.gridPositions[this.newRow + 1][this.newCol].isEmpty = false;
            context.data.list.gridPositions[this.newRow + 1][this.newCol + 1].isEmpty = false;
            context.data.list.gridPositions[this.newRow][this.newCol].giantData = { row: this.newRow, col: this.newCol };
            context.data.list.gridPositions[this.newRow][this.newCol + 1].giantData = { row: this.newRow, col: this.newCol };
            context.data.list.gridPositions[this.newRow + 1][this.newCol].giantData = { row: this.newRow, col: this.newCol };
            context.data.list.gridPositions[this.newRow + 1][this.newCol + 1].giantData = { row: this.newRow, col: this.newCol };
        }

        // update fog of war
        context.checkMapVisibility(false);

        // disable spell buttons while moving (spells disabled mid-move)
        context.updatePlayerSpellButtonsInteraction(true);

        // ── start the move tween via Monster.move() ──────────────────────────
        // Monster.move() tweens the monster, calls decreaseMoves() on complete,
        // then emits CHECK_END_TURN. We listen once for that event to determine
        // which state to transition to.
        this.onMoveComplete = () => {
            if (!this.active) return;
            this.onAfterMove(context, monster);
        };

        context.events.once(GAME_SCENE_SCENE_EVENTS.CHECK_END_TURN, this.onMoveComplete);

        monster.move(this.newRow, this.newCol);
    }

    exit(context: Game): void {
        this.active = false;
        console.log('[PlayerMovingState] exit');
        // safety: remove listener if state is exited before tween completes
        context.events.off(GAME_SCENE_SCENE_EVENTS.CHECK_END_TURN, this.onMoveComplete);
    }

    // ── private ──────────────────────────────────────────────────────────────

    private onAfterMove(context: Game, monster: Monster): void {
        if (!this.active) return;

        // case 1: same monster still has moves left → back to selected with same monster
        if (monster.unitData.movesLeft > 0 && monster.pendingAction) {
            context.stateMachine.setState(new PlayerMonsterSelectedState(monster));
            return;
        }

        // case 2: another player monster has moves → select that one
        const nextMonster: Monster = context.data.list.playerMonsters.find(
            (m: Monster) => m && m !== monster && m.pendingAction && m.frozenForDuration === 0
        );

        if (nextMonster) {
            context.stateMachine.setState(new PlayerMonsterSelectedState(nextMonster));
            return;
        }

        // case 3: all player monsters have no moves → TODO (APPLY_POISON_STATE)
        alert('PlayerMovingState - all monsters done - APPLY_POISON_STATE not implemented yet');
    }
}
