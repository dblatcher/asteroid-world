import { AsteroidsGame } from './AsteroidsGame'
import { gameWorld, levels } from './worldSetup'

import '../style.css';


const game = new AsteroidsGame(gameWorld, levels, 50, document.querySelector('#gameCanvas'),document.querySelector('#miniMap') );
(window as any).game = game;