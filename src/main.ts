import StartGame from './game/main';

if (JSON.parse(localStorage.getItem('gameOpen') || 'null') === false || JSON.parse(localStorage.getItem('gameOpen') || 'null') === null) {
    document.addEventListener('DOMContentLoaded', () => {
        console.log(JSON.parse(localStorage.getItem('gameOpen') || 'null'));
        StartGame('game-container');
        localStorage.setItem('gameOpen', 'true');
    });
    window.addEventListener("pagehide", () => {
        localStorage.setItem('gameOpen', 'false');
    });
}
