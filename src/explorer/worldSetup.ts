import { World, Force, StarField, Thing } from '../../../worlds/src/index'
import { ExplorerShip } from '../thing-types/ExplorerShip';
import { Planet } from '../thing-types/Planet';


const worldHeight = 8000
const worldWidth = 8000

const gameWorld = new World([
], {
    gravitationalConstant: .1,
    width: worldWidth,
    height: worldHeight,
    thingsExertGravity: true,
    hasHardEdges: true,
    name: "gameWorld",
    airDensity:1,
    backGrounds: [
        new StarField({ width: worldWidth, height: worldHeight, numberOfStars: 1000, depth: 5 }),
        new StarField({ width: worldWidth, height: worldHeight, numberOfStars: 1500, depth: 10 }),
    ]
});


const levels = [
    [
        new ExplorerShip({x:100,y:1500,size:10, maxThrust:15000, density:5, color:'purple', elasticity:0.1}),
        new Planet({name:"earth", immobile: true, size: 250, x: 1000, y: worldHeight - 500, color: 'skyblue', fillColor: 'blue', density: .1, elasticity: 0.1 })
    ]
]


export { gameWorld, levels }