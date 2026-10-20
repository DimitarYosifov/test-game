import { Game } from '../../Game';
import { BaseState } from './BaseState';
import { ApplyPendingResurrectionsState } from './ApplyPendingResurrectionsState';
import { Monster } from '../Monster';

/**
 * Poison ticks for the side whose turn is starting (logic of applyPoison in Game-old.ts).
 * Exit: APPLY_PENDING_RESSURECTIONS_STATE (always).
 */
export class ApplyPoisonState extends BaseState {

    // Monster.takeDamege tween is 1500ms (+ the death fade); the old code waited a fixed 2s
    private static readonly POISON_DAMAGE_WAIT = 2000;

    enter(context: Game): void {
        this.active = true;
        console.log('[ApplyPoisonState] enter');

        const monsters: Monster[] = context.data.list.isPlayerTurn
            ? context.data.list.playerMonsters
            : context.data.list.opponentMonsters;
        const poisonedMonsters = monsters.filter((m: Monster | null) => m && m.poisonedForDuration > 0);

        if (poisonedMonsters.length === 0) {
            this.exitState(context);
            return;
        }

        poisonedMonsters.forEach((monster: Monster) => {
            monster.takePoisonDamege(false);
        });

        context.time.delayedCall(ApplyPoisonState.POISON_DAMAGE_WAIT, () => this.exitState(context));
    }

    exit(_context: Game): void {
        this.active = false;
        console.log('[ApplyPoisonState] exit');
    }

    private exitState(context: Game): void {
        if (!this.active) return;
        context.stateMachine.setState(new ApplyPendingResurrectionsState());
    }
}
