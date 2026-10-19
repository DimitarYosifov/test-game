import { Game, GAME_SCENE_SCENE_EVENTS } from '../../Game';
import { BaseState } from './BaseState';
import { PlayerMonsterSelectedState } from './PlayerMonsterSelectedState';
import { ApplyPoisonState } from './ApplyPoisonState';
import { Monster } from '../Monster';

export class PlayerSkipMoveState extends BaseState {

    private onSkipComplete: () => void;

    enter(context: Game): void {
        this.active = true;
        console.log('[PlayerSkipMoveState] enter');

        const monster = context.currentlySelectedMonster;
        if (!monster) return;

        context.skipButton.disableInteractive();
        context.movementArrowsContainer.removeArrows();

        // dim the monster to show it used its move
        monster.setAlpha(0.7);

        // skipMove: sets pendingAction=false, decreaseMoves(), emits CHECK_END_TURN
        // we listen once for CHECK_END_TURN to decide next state
        this.onSkipComplete = () => {
            if (!this.active) return;
            this.onAfterSkip(context, monster);
        };
        context.events.once(GAME_SCENE_SCENE_EVENTS.CHECK_END_TURN, this.onSkipComplete);

        monster.skipMove(true);
    }

    exit(context: Game): void {
        this.active = false;
        console.log('[PlayerSkipMoveState] exit');
        context.events.off(GAME_SCENE_SCENE_EVENTS.CHECK_END_TURN, this.onSkipComplete);
    }

    // ── private ──────────────────────────────────────────────────────────────

    private onAfterSkip(context: Game, monster: Monster): void {
        if (!this.active) return;

        // case 1: same monster still has moves left
        if (monster.unitData.movesLeft > 0) {
            monster.setAlpha(1);
            context.stateMachine.setState(new PlayerMonsterSelectedState(monster));
            return;
        }

        // case 2: another player monster has moves
        const nextMonster: Monster = context.data.list.playerMonsters.find(
            (m: Monster) => m && m !== monster && m.pendingAction && m.frozenForDuration === 0
        );
        if (nextMonster) {
            context.stateMachine.setState(new PlayerMonsterSelectedState(nextMonster));
            return;
        }

        // case 3: all player monsters have no moves
        context.stateMachine.setState(new ApplyPoisonState());
    }
}
