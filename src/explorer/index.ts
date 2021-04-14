import { ExplorerGame } from './ExplorerGame'
import { gameWorld, levels } from './worldSetup'

function init() {
    const game = new ExplorerGame(
        gameWorld,
        levels, 50,
        document.querySelector('#gameCanvas'),
        document.querySelector('#miniMap'),
        {
            main: document.getElementById('gameContainer'),
            score: document.getElementById('score'),
            lives: document.getElementById('lives'),
            level: document.getElementById('level'),
        });
    (window as any).game = game;
}

window.addEventListener('load', init, { once: true });