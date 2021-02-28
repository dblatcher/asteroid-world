import { AsteroidsGame } from './AsteroidsGame'
import { gameWorld, levels } from './worldSetup'

import './style.css';


const game = new AsteroidsGame(gameWorld, levels, document.querySelector('canvas'), 50)

