import { ExplorerGame } from './ExplorerGame'
import { gameWorld, levels } from './worldSetup'

export function addHtmlTemplate() {

    document.querySelector<HTMLDivElement>('#app')!.innerHTML = ` 
    
      <main id="gameContainer" class="hidden">
    <div class="frame">
      <canvas id="gameCanvas"></canvas>
      <canvas id="miniMap" style="margin-left: 1rem;"></canvas>
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
    </div>
  </main>
    `
}

export function init() {
    const game = new ExplorerGame(
        gameWorld,
        levels, 50,
        document.querySelector('#gameCanvas')!,
        document.querySelector('#miniMap')!,
        {
            main: document.getElementById('gameContainer')!,
            score: document.getElementById('score')!,
            lives: document.getElementById('lives')!,
            level: document.getElementById('level')!,
        });
    (window as any).game = game;
}
