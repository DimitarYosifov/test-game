import { LOCAL_STORAGE_MANAGER } from './game/LOCAL_STORAGE_MANAGER';
import StartGame from './game/main';

const gameOpen = localStorage.getItem('gameOpen');
if (gameOpen === 'false' || gameOpen === null) {
    document.addEventListener('DOMContentLoaded', () => {
        LOCAL_STORAGE_MANAGER.ensureData();

        console.log(`gameOpen => ${gameOpen}`);
        StartGame('game-container');
        localStorage.setItem('gameOpen', 'true');
    });
    window.addEventListener("pagehide", () => {
        localStorage.setItem('gameOpen', 'false');
    });
}
