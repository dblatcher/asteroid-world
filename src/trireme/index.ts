import { SoundPlayer } from "physics-worlds"
import { TriremeGame } from './TriremeGame'

import { gameWorld, levels } from './worldSetup'

const sounds = {
    "rockThud":<string>require ('../../audio/leisure_video_game_retro_8bit_explosion_001.mp3'),
    "rockDisintergrating":<string>require ('../../audio/leisure_video_game_retro_8bit_explosion_002.mp3'),
    "shipExploding":<string>require ('../../audio/leisure_video_game_retro_8bit_explosion_004.mp3'),
    "laser":<string>require ('../../audio/leisure_video_game_retro_laser_gun_fire_001.mp3'),
}

 

function init() {

    const soundPlayer = new SoundPlayer(sounds, {
        toggleButton: document.getElementById('soundToggle'),
    })

    const game = new TriremeGame(
        gameWorld,
        levels,
        50,
        document.querySelector('#gameCanvas'),
        {
            main: document.getElementById('gameContainer'),
            score: document.getElementById('score'),
            lives: document.getElementById('lives'),
            level: document.getElementById('level'),
        },soundPlayer);
    (window as any).game = game;
    (window as any).soundPlayer = soundPlayer;
}

window.addEventListener('load', init, { once: true });