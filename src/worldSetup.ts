import {World} from '../../worlds/src/index'


const worldHeight = 500
const worldWidth = 500

const gameWorld = new World([

], {
    gravitationalConstant: 2,
    width: worldWidth,
    height: worldHeight,
    thingsExertGravity: false,
    hasHardEdges: true,
    name: "Galaxy",
});

export {gameWorld}