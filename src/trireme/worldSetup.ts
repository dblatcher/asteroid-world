import { World, Force, StarField, BackGround } from '../../../worlds/src/index'
import { makeRock, makeShip } from './thingFactories'


const worldHeight = 750
const worldWidth = 750

const gameWorld = new World([
], {
    gravitationalConstant: 0,
    width: worldWidth,
    height: worldHeight,
    bodiesExertGravity: false,
    hasWrappingEdges: true,
    name: "gameWorld",
    airDensity:1,
    backGrounds: [
    ]
});


const levels = [
    [
        makeRock(100, 100, 5),
        makeShip(250, 250, 'blue')
    ],
    [

        makeShip(250, 250, 'blue')
    ],
    [

        makeShip(250, 250, 'red')
    ],
]


export { gameWorld, levels }