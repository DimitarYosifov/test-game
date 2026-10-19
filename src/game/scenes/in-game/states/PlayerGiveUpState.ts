import { Game } from '../../Game';
import { BaseState } from './BaseState';

export class PlayerGiveUpState extends BaseState {

    enter(_context: Game): void {
        this.active = true;
        console.log('[PlayerGiveUpState] enter');
        alert('PlayerGiveUpState - no exits defined yet');
    }

    exit(_context: Game): void {
        this.active = false;
        console.log('[PlayerGiveUpState] exit');
    }
}
