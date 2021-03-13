import { World, Force, StarField, Thing } from '../../../worlds/src/index'
import { ExplorerShip } from '../thing-types/ExplorerShip';


const worldHeight = 5000
const worldWidth = 5000

const gameWorld = new World([
], {
    gravitationalConstant: .1,
    width: worldWidth,
    height: worldHeight,
    thingsExertGravity: true,
    hasHardEdges: true,
    name: "gameWorld",
    backGrounds: [
        new StarField({ width: worldWidth, height: worldHeight, numberOfStars: 500, depth: 5 }),
        new StarField({ width: worldWidth, height: worldHeight, numberOfStars: 1000, depth: 10 }),
    ]
});


const levels = [
    [
        new ExplorerShip({x:100,y:100,size:10, maxThrust:15000, density:5, color:'purple'}),
        new Thing({ immobile: true, size: 250, x: 1000, y: worldHeight - 500, color: 'skyblue', fillColor: 'blue', density: .1, elasticity: 0 })
    ]
]


export { gameWorld, levels }