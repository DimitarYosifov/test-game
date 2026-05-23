import { main_config } from './game/configs/main_config';
import { createDebugPanel } from './game/debug-panel';
import { LOCAL_STORAGE_MANAGER } from './game/LOCAL_STORAGE_MANAGER';
import StartGame from './game/main';

const channel = new BroadcastChannel('my_game');
let hasOtherTab = false;

channel.onmessage = (event) => {

    if (event.data === 'GAME_OPEN') {
        hasOtherTab = true;
    }

    if (event.data === 'PING') {
        channel.postMessage('GAME_OPEN');
    }
};

channel.postMessage('PING');

setTimeout(() => {

    if (hasOtherTab) {

        document.body.innerHTML = `
            <h1>Game already open</h1>
        `;

    } else {

        StartGame('game-container');
        LOCAL_STORAGE_MANAGER.ensureData();
       
        if (main_config.allowDebugPanel) {
            createDebugPanel();
        }

        window.addEventListener('beforeunload', () => {
            channel.close();
        });
    }

}, 300);