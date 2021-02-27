import { gameWorld } from './worldSetup'
import { makeRock, makeShip } from './thingFactories'
import { Force } from '../../worlds/src/Force';

import KeyWatcher from './KeyWatcher'

import './style.css';

const rocks = [
    makeRock(100, 100, 20),
    makeRock(160, 400, 30, new Force(1, 3.2)),
    makeRock(100, 150, 15, new Force(1, 1)),
]

rocks.forEach(rock => {
    rock.enterWorld(gameWorld)
})

const myShip = makeShip(250, 250, 'red')
myShip.enterWorld(gameWorld)

const gameCanvas = document.querySelector('canvas')

gameWorld.setCanvas(gameCanvas)
gameWorld.ticksPerSecond = 50

const keyWatcher = new KeyWatcher(document.body)

keyWatcher.on('keydown', (event: KeyboardEvent) => {
    const { code } = event
    console.log(code)

    if (gameWorld.ticksPerSecond) {
        if (code == 'ArrowLeft') { myShip.data.heading += .2 }
        if (code == 'ArrowRight') { myShip.data.heading -= .2 }
        if (code == 'ArrowUp') { myShip.changeThrottle(20) }
        if (code == 'ArrowDown') { myShip.changeThrottle(-20) }
    }

    if (code == 'KeyP') {
        gameWorld.ticksPerSecond = gameWorld.ticksPerSecond ? 0 : 50
    }
})