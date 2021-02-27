import { World, Force } from './_fake-module'
import { makeRock, makeShip } from './thingFactories'

const worldHeight = 500
const worldWidth = 500

const gameWorld = new World([

], {
    gravitationalConstant: 2,
    width: worldWidth,
    height: worldHeight,
    thingsExertGravity: false,
    hasHardEdges: true,
    name: "gameWorld",
});

const rocks = [
    makeRock(100, 100, 20),
    makeRock(160, 400, 30, new Force(1, 3.2)),
    makeRock(160, 100, 40, new Force(1, 3.2)),
    makeRock(10, 100, 40, new Force(1, 4.2)),
    makeRock(100, 150, 15, new Force(1, 1)),
]

rocks.forEach(rock => {
    rock.enterWorld(gameWorld)
})

const myShip = makeShip(250, 250, 'red')
myShip.enterWorld(gameWorld)

export { gameWorld, myShip }