import './style.css'
import {init} from './asteroids'

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

window.addEventListener('load', init, { once: true });
