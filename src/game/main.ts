import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { MainMenu } from './scenes/MainMenu';
import { CardSelection } from './scenes/CardSelection';
import { Map } from './scenes/Map';
import { BuyPacks } from './scenes/BuyPacks';
import { DailyQuests } from './scenes/DailyQuests';
import { Achievements } from './scenes/Achievements';
import { MonstersInfo } from './scenes/MonstersInfo';

// import main_confi from '../sconfig/main_config.json';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,

    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        CardSelection,
        MainGame,
        Map,
        BuyPacks,
        DailyQuests,
        Achievements,
        MonstersInfo,
        GameOver
    ]
};

const StartGame = (parent: string) => {
    const game = new Game({ ...config, parent });
    (globalThis as any).__PHASER_GAME__ = game;
    return game;
}

export default StartGame;
