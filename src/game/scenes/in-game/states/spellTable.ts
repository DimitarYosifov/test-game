import { Game } from '../../Game';
import { Monster } from '../Monster';
import { Button } from '../../in-main-menu/Button';
import { ISpellsData } from '../../../configs/level_config';
import { MagicBallSpell } from '../spells/MagicBallSpell';
import { PoisonSpell } from '../spells/PoisonSpell';
import { RainOfArrowsSpell } from '../spells/RainOfArrowsSpell';
import { FreezeSpell } from '../spells/FreezeSpell';
import { HealSpell } from '../spells/HealSpell';

export type SpellKey = keyof ISpellsData;

/**
 * Everything that differs between the 5 spells, so the states that cast them
 * (PLAYER_SPELL_CASTING_STATE, OPPONENT_SPELL_CAST_STATE) don't need one copy of the logic per spell
 * (this replaces the five newXSpell methods of Game-old.ts).
 */
export interface ISpellDefinition {
    key: SpellKey;
    /** heal targets the caster's own monsters, every other spell targets the enemy's */
    targetsOwnSide: boolean;
    getPlayerButton: (context: Game) => Button;
    getOpponentButton: (context: Game) => Button;
    /** Spell classes do all their work in the constructor; they emit CHECK_END_TURN when the last target is done. */
    cast: (context: Game, targets: Monster[], spellData: any) => void;
}

/** Order matters: it is the priority in which the opponent casts spells that are ready. */
export const SPELLS: ISpellDefinition[] = [
    {
        key: 'magicBall', targetsOwnSide: false,
        getPlayerButton: c => c.playerMagicBallButton,
        getOpponentButton: c => c.opponentMagicBallButton,
        cast: (c, targets, data) => { new MagicBallSpell(c, c.mainGridContainer, targets, data); }
    },
    {
        key: 'poison', targetsOwnSide: false,
        getPlayerButton: c => c.playerPoisonButton,
        getOpponentButton: c => c.opponentPoisonButton,
        cast: (c, targets, data) => { new PoisonSpell(c, c.mainGridContainer, targets, data); }
    },
    {
        key: 'rainOfArrows', targetsOwnSide: false,
        getPlayerButton: c => c.playerRainOfArrowsButton,
        getOpponentButton: c => c.opponentRainOfArrowsButton,
        cast: (c, targets, data) => { new RainOfArrowsSpell(c, c.mainGridContainer, targets, data); }
    },
    {
        key: 'freeze', targetsOwnSide: false,
        getPlayerButton: c => c.playerFreezeButton,
        getOpponentButton: c => c.opponentFreezeButton,
        cast: (c, targets, data) => { new FreezeSpell(c, c.mainGridContainer, targets, data); }
    },
    {
        key: 'heal', targetsOwnSide: true,
        getPlayerButton: c => c.playerHealButton,
        getOpponentButton: c => c.opponentHealButton,
        cast: (c, targets, data) => { new HealSpell(c, c.mainGridContainer, targets, data); }
    }
];

export function getSpell(key: SpellKey): ISpellDefinition {
    return SPELLS.find(s => s.key === key)!;
}
