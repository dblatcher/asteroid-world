import { gameWorld, resetGameWorld } from './worldSetup'
import KeyWatcher from './KeyWatcher'
import './style.css';


const gameCanvas = document.querySelector('canvas')
const gameSpeed = 50

gameWorld.setCanvas(gameCanvas)
gameWorld.ticksPerSecond = gameSpeed

let myShip = resetGameWorld()

function reset() {
    myShip = resetGameWorld()
}



const keyWatcher = new KeyWatcher(document.body)

keyWatcher.startReportTimer(1000 / gameSpeed)
keyWatcher.on('report', (keyCodes: string[]) => {
    if (gameWorld.ticksPerSecond) {
        if (keyCodes.includes('ArrowLeft')) { myShip.data.heading += .1 }
        if (keyCodes.includes('ArrowRight')) { myShip.data.heading -= .1 }
        if (keyCodes.includes('ArrowUp')) { myShip.changeThrottle(5) }
        if (keyCodes.includes('ArrowDown')) { myShip.changeThrottle(-5) }
    }
})

keyWatcher.on('keydown', (event: KeyboardEvent) => {
    const { code } = event
    if (gameWorld.ticksPerSecond) {
        if (code == 'Space') { myShip.shoot() }
    }
    if (code == 'KeyP') {
        gameWorld.ticksPerSecond = gameWorld.ticksPerSecond ? 0 : gameSpeed
    }
    if (code == 'KeyR') {
        reset()
    }
})