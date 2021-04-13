import { World, Force, StarField, Body, Area } from '../../../worlds/src/index'
import { ExplorerShip } from '../thing-types/ExplorerShip';
import { Planet } from '../thing-types/Planet';
import { redSwirl, blueGreenBall } from './gradients';


const worldHeight = 20000
const worldWidth = 20000

const gameWorld = new World([
], {
    gravitationalConstant: .15,
    width: worldWidth,
    height: worldHeight,
    bodiesExertGravity: true,
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
        new ExplorerShip({ x: 4000, y: 15000, size: 10, maxThrust: 40000, density: 5, color: 'purple', elasticity: 0.1 }),
        new Planet({ name: "Earth", immobile: true, size: 500, x: 9000, y: 15000, color: 'skyblue', fillColor: blueGreenBall, density: .1, elasticity: 0.1 }),
        new Area({
            x: 9000, y: 15000,
            density: 12,
            size: 1000,
            fillColor: 'rgba(50,70,250,0.5)',
        }),

        new Planet({ name: "Mars", immobile: true, size: 400, x: 7000, y: 7000, color: 'red', fillColor: redSwirl, density: .1, elasticity: 0.1 }),
        new Area({
            x: 7000, y: 7000,
            density: 5,
            size: 800,
            fillColor: 'rgba(200,50,50,0.5)',
        })
    ]
]


export { gameWorld, levels }