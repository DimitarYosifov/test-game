import { Game, GAME_SCENE_SCENE_EVENTS } from '../../Game';

/**
 * Shared "the opponent's turn is over" bookkeeping - the mirror of finishPlayerTurn(), taken from
 * the opponent->player flip of the old checkNextTurn: announces the end of the round (spell
 * cooldown buttons listen to ROUND_END), disables player input, flips the turn flag and does the
 * flip-time bookkeeping.
 * The caller is responsible for transitioning to the next state afterwards.
 */
export function finishOpponentTurn(context: Game): void {
    // both turns are done - the round ends (emitted BEFORE the flip, like the old code)
    context.events.emit(GAME_SCENE_SCENE_EVENTS.ROUND_END);

    context.endTurnButton.disableInteractive();
    context.skipButton.disableInteractive();
    context.giveUpButton.disableInteractive();

    // flip turn flag (player's turn starts)
    context.activeExplodePositions = 0;
    context.data.list.isPlayerTurn = true;
    context.updateFrozenMonsters();
    context.removeMonstersInvincibilty();

    // player's turn start (old "player turn starts" branch): spell cooldowns tick once per round,
    // spells stay locked until the player gets control back
    context.updateSpellLevelsOnTurnEnd();
    context.updatePlayerSpellButtonsInteraction(true);
}
