import { Game } from '../../Game';
import { BaseState } from './BaseState';

export class GameStateMachine {
    private currentState: BaseState | null = null;
    private context: Game;

    constructor(context: Game) {
        this.context = context;
    }

    setState(newState: BaseState): void {
        if (this.currentState) {
            this.currentState.exit(this.context);
        }
        this.currentState = newState;
        this.currentState.enter(this.context);
    }

    getCurrentState(): BaseState | null {
        return this.currentState;
    }
}
