import { SoundPlayer } from 'physics-worlds'
import { AsteroidsGame } from './AsteroidsGame'
import rockThud from '../audio/leisure_video_game_retro_8bit_explosion_001.mp3'
import shipExploding from '../audio/leisure_video_game_retro_8bit_explosion_004.mp3'
import rockDisintergrating from '../audio/leisure_video_game_retro_8bit_explosion_002.mp3'
import laser from '../audio/leisure_video_game_retro_laser_gun_fire_001.mp3'

import { gameWorld, levels } from './worldSetup'

const sounds = {
    rockThud,
    rockDisintergrating,
    shipExploding,
    laser
}



export function init() {

    const soundPlayer = new SoundPlayer(sounds, {
        toggleButton: document.getElementById('soundToggle')!,
    })

    const game = new AsteroidsGame(
        gameWorld,
        levels,
        50,
        document.querySelector('#gameCanvas')!,
        {
            main: document.getElementById('gameContainer')!,
            score: document.getElementById('score')!,
            lives: document.getElementById('lives')!,
            level: document.getElementById('level')!,
        }, soundPlayer);
    (window as any).game = game;
    (window as any).soundPlayer = soundPlayer;
}

