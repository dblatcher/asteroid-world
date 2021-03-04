import { Thing, Force } from '../../worlds/src/index'
import { SpaceShip } from './thing-types/SpaceShip'
import { Rock } from './thing-types/Rock'



function makeRock(x: number, y: number, size: number, momentum?: Force): Thing {
    return new Rock({ x, y, size, 
        color: 'grey', 
        elasticity: .5, 
        density: 5, 
        headingFollowsDirection:false 
    }, momentum)
}


function makeShip(x: number, y: number, color: string): SpaceShip {
    return new SpaceShip({
        x, y, color,
        size: 10,
        density: 1,
        elasticity: .7,
        maxThrust: 1500,
    })
}

export { makeRock, makeShip }
