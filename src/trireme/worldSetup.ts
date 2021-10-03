import { World, Force, StarField, BackGround } from '../../../worlds/src/index'
import { Ocean } from './Ocean';
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
    airDensity:.5,
    backGrounds: [
        new Ocean({color:'blue'})
    ]
});


const levels = [
    [
        makeRock(100, 100, 5),
        makeShip(250, 250, 'brown')
    ],
    [

        makeShip(250, 250, 'brown')
    ],
    [

        makeShip(250, 250, 'brown')
    ],
]


export { gameWorld, levels }