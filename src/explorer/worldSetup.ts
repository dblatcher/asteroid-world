import { World, Force, StarField, Thing } from '../../../worlds/src/index'
import { ExplorerShip } from '../thing-types/ExplorerShip';
import { Planet } from '../thing-types/Planet';
import { redSwirl, blueGreenBall } from './gradients';


const worldHeight = 20000
const worldWidth = 20000

const gameWorld = new World([
], {
    gravitationalConstant: .1,
    width: worldWidth,
    height: worldHeight,
    thingsExertGravity: true,
    hasHardEdges: true,
    name: "gameWorld",
    airDensity: 0,
    backGrounds: [
        new StarField({ width: worldWidth, height: worldHeight, numberOfStars: 2000, depth: 5 }),
        new StarField({ width: worldWidth, height: worldHeight, numberOfStars: 5000, depth: 10 }),
    ]
});


const levels = [
    [
        new ExplorerShip({ x: 100, y: 1500, size: 10, maxThrust: 30000, density: 5, color: 'purple', elasticity: 0.1 }),
        new Planet({ name: "Earth", immobile: true, size: 500, x: 9000, y: 15000, color: 'skyblue', fillColor: blueGreenBall, density: .1, elasticity: 0.1 }),
        new Planet({ name: "Mars", immobile: true, size: 400, x: 7000, y: 7000, color: 'red', fillColor: redSwirl, density: .05, elasticity: 0.1 })
    ]
]


export { gameWorld, levels }