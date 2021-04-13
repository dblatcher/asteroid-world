import { AsteroidsGame } from './AsteroidsGame'
import { gameWorld, levels } from './worldSetup'

import '../style.css';


const game = new AsteroidsGame(
    gameWorld, 
    levels, 
    50, 
    document.querySelector('#gameCanvas'),
    {
        main: document.getElementById('gameContainer'),
        score: document.getElementById('score'),
        lives: document.getElementById('lives'),
        level: document.getElementById('level'),
    });
(window as any).game = game;