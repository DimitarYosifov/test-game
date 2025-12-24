import { LOCAL_STORAGE_MANAGER } from './game/LOCAL_STORAGE_MANAGER';
import StartGame from './game/main';

const gameOpen = LOCAL_STORAGE_MANAGER.get('gameOpen');
if (gameOpen === false || gameOpen === null) {
    document.addEventListener('DOMContentLoaded', () => {
        console.log(`gameOpen => ${gameOpen}`);
        StartGame('game-container');
        LOCAL_STORAGE_MANAGER.set('gameOpen', true);
    });
    window.addEventListener("pagehide", () => {
        LOCAL_STORAGE_MANAGER.set('gameOpen', false);
    });
}
