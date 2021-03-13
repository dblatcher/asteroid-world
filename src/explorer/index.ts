import { ExplorerGame } from './ExplorerGame'
import { gameWorld, levels } from './worldSetup'

import '../style.css';


const game = new ExplorerGame(gameWorld, levels, 50, document.querySelector('#gameCanvas'),document.querySelector('#miniMap') );
(window as any).game = game;