import { SoundPlayer } from 'physics-worlds'
import { AsteroidsGame } from './AsteroidsGame'
import { gameWorld, levels } from './worldSetup'
import { sounds } from '../audio'


export function addHtmlTemplate() {

    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<main id="gameContainer" class="hidden">
  <div class="frame">
    <canvas id="gameCanvas"></canvas>
  </div>

  <div class="info">
    <table>
      <tbody>
        <tr>
          <th>level</th><td><span id="level"></td>
        </tr>
        <tr>
          <th>score</th><td><span id="score"></td>
        </tr>
        <tr>
          <th>lives</th><td><span id="lives"></td>
        </tr>
      </tbody>
    </table>
    <p id="soundToggle">toggle sound</p>  
  </div>
  
</main>
`
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

