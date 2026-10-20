import { Game } from '../../Game';
import { BaseState } from './BaseState';
import { MonsterMoveState } from './MonsterMoveState';
import { MonsterAttackState } from './MonsterAttackState';
import { ApplyPoisonState } from './ApplyPoisonState';
import { exitAfterMonsterAction } from './exitAfterMonsterAction';
import { finishOpponentTurn } from './finishOpponentTurn';
import {
    findClosestPlayerMonster,
    getAttackableTargets,
    getCellsVisibleToOpponent,
    getMoveTowards,
    getRandomMove,
    hasPossibleMove,
    pickTarget
} from './opponentAI';
import { Monster } from '../Monster';

/**
 * The opponent AI (getRandomOpponentMonster in Game-old.ts). Picks the monster that acts - the one
 * it is given (the monster that still has moves, or its teammate, see exitAfterMonsterAction) or,
 * when entered without one, a random opponent monster that still has moves - decides what that
 * monster does and exits:
 *
 *  1. an enemy is in range         => MONSTER_ATTACK_STATE (kills if it can, otherwise a random target)
 *  2. no enemy in range            => MONSTER_MOVE_STATE (towards the closest visible player monster,
 *                                     otherwise to a random free position)
 *
 * Two edge cases of the old code that have no choice to make:
 *  - the monster is boxed in (nothing to attack, nowhere to go): it burns one move and
 *    exitAfterMonsterAction picks what happens next (same monster again / a teammate / turn over)
 *  - no opponent monster can act at all (all frozen, ...): the opponent's turn is over => APPLY_POISON_STATE
 */
export class OpponentMonsterSelectedState extends BaseState {

    readonly monster: Monster | null;

    constructor(monster: Monster | null = null) {
        super();
        this.monster = monster;
    }

    enter(context: Game): void {
        this.active = true;
        console.log('[OpponentMonsterSelectedState] enter', this.monster);

        const monster = this.monster ?? this.pickRandomMonster(context);

        if (!monster) {
            // nobody can act - the opponent's turn is over
            finishOpponentTurn(context);
            context.stateMachine.setState(new ApplyPoisonState());
            return;
        }

        // Game.monsterDieHandler (N6 bonus) and the other kill-time rules read the acting monster from here
        context.currentlySelectedMonster = monster;
        context.mainGridContainer.bringToTop(monster);

        const visibleToOpponent = getCellsVisibleToOpponent(context);

        // ── 1. ATTACK ────────────────────────────────────────────────────────
        const targets = getAttackableTargets(context, monster, visibleToOpponent);
        if (targets.length > 0) {
            const target = pickTarget(context, monster, targets);
            context.stateMachine.setState(new MonsterAttackState(monster, target.row, target.col));
            return;
        }

        // boxed in: the old code skipped the monster's move
        if (!hasPossibleMove(context, monster)) {
            monster.pendingAction = false;
            monster.decreaseMoves();
            exitAfterMonsterAction(context, monster);
            return;
        }

        // ── 2. MOVE ──────────────────────────────────────────────────────────
        const closestPlayerMonster = findClosestPlayerMonster(context, monster, visibleToOpponent);
        const newPosition = closestPlayerMonster
            ? getMoveTowards(context, monster, closestPlayerMonster.unitData)  // towards the closest visible player monster
            : getRandomMove(context, monster);                                   // nobody visible - wander
        context.stateMachine.setState(new MonsterMoveState(monster, newPosition.row, newPosition.col));
    }

    exit(_context: Game): void {
        this.active = false;
        console.log('[OpponentMonsterSelectedState] exit');
    }

    // ── private ──────────────────────────────────────────────────────────────

    private pickRandomMonster(context: Game): Monster | undefined {
        const candidates: Monster[] = context.data.list.opponentMonsters.filter(
            (m: Monster | null) => m !== null && m.pendingAction
        );
        if (candidates.length === 0) return undefined;
        return candidates[Phaser.Math.RND.between(0, candidates.length - 1)];
    }
}
