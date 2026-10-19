import { Game } from '../../Game';
import { BaseState } from './BaseState';

export class PlayerAttackingState extends BaseState {

    // stored for when exits are implemented
    readonly targetRow: number;
    readonly targetCol: number;
    readonly isRanged: boolean;

    constructor(targetRow: number, targetCol: number, isRanged: boolean) {
        super();
        this.targetRow = targetRow;
        this.targetCol = targetCol;
        this.isRanged = isRanged;
    }

    enter(_context: Game): void {
        this.active = true;
        console.log('[PlayerAttackingState] enter - target:', this.targetRow, this.targetCol, 'ranged:', this.isRanged);
        alert('PlayerAttackingState - no exits defined yet');
    }

    exit(_context: Game): void {
        this.active = false;
        console.log('[PlayerAttackingState] exit');
    }
}
