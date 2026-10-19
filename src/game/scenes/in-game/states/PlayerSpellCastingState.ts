import { Game } from '../../Game';
import { BaseState } from './BaseState';
import { Button } from '../../in-main-menu/Button';

export class PlayerSpellCastingState extends BaseState {

    // stored for when exits are implemented
    readonly spellButton: Button;

    constructor(spellButton: Button) {
        super();
        this.spellButton = spellButton;
    }

    enter(_context: Game): void {
        this.active = true;
        console.log('[PlayerSpellCastingState] enter - spell:', this.spellButton);
        alert('PlayerSpellCastingState - no exits defined yet');
    }

    exit(_context: Game): void {
        this.active = false;
        console.log('[PlayerSpellCastingState] exit');
    }
}
