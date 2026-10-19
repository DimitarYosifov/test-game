import { Game } from '../../Game';
import { BaseState } from './BaseState';

export class ApplyPoisonState extends BaseState {

    enter(_context: Game): void {
        this.active = true;
        console.log('[ApplyPoisonState] enter');
        alert('ApplyPoisonState - TODO: applyPendingResurrections, then checkOpponentForSpellCast');
    }

    exit(_context: Game): void {
        this.active = false;
        console.log('[ApplyPoisonState] exit');
    }
}
