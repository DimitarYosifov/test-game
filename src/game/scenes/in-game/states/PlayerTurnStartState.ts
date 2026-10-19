import { Game } from '../../Game';
import { BaseState } from './BaseState';
import { PlayerMonsterSelectedState } from './PlayerMonsterSelectedState';
import { Monster } from '../Monster';

export class PlayerTurnStartState extends BaseState {

    enter(context: Game): void {
        this.active = true;
        console.log('[PlayerTurnStartState] enter');

        context.removeQuestionMarks();

        // reset moves for all player monsters
        context.data.list.playerMonsters.forEach((monster: Monster) => {
            if (monster) {
                monster.resetMoves();
            }
        });

        // set pendingAction for all non-frozen player monsters
        context.data.list.playerMonsters.forEach((monster: Monster) => {
            if (monster) {
                monster.setAlpha(1);
                monster.setInteraction(true);
                monster.pendingAction = monster.frozenForDuration === 0;
            }
        });

        // opponent monsters stay non-interactive
        context.data.list.opponentMonsters.forEach((monster: Monster) => {
            if (monster) {
                monster.setAlpha(1);
                monster.setInteraction(false);
                if (monster.unitData.movesLeft === 0) {
                    monster.pendingAction = false;
                }
            }
        });

        context.endTurnButton.setInteractive();
        context.updatePlayerSpellButtonsInteraction();

        // auto-select the first available player monster
        const firstAvailable: Monster = context.data.list.playerMonsters.find(
            (m: Monster) => m !== null && m.pendingAction
        );

        if (firstAvailable) {
            if (!this.active) return;
            context.stateMachine.setState(
                new PlayerMonsterSelectedState(firstAvailable)
            );
        } else {
            // all player monsters are frozen - let player use spells / end turn manually
            console.warn('[PlayerTurnStartState] no available monsters - all frozen?');
            context.endTurnButton.setInteractive();
        }
    }

    exit(_context: Game): void {
        this.active = false;
        console.log('[PlayerTurnStartState] exit');
    }
}
