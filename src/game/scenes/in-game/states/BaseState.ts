import { Game } from '../../Game';

export abstract class BaseState {
    protected active: boolean = false;

    abstract enter(context: Game): void;
    abstract exit(context: Game): void;
}
