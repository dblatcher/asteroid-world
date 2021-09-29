import { Body, Force } from '../../../worlds/src/index'
import { Rock } from '../thing-types/Rock'
import { Galley } from './Galley'


const rockColors = ['gainsboro', 'darksalmon', 'dimgray', 'darkgray', 'azure', 'cornsilk',]

function makeRock(x: number, y: number, size: number, momentum?: Force): Body {
    const fillColor = rockColors[Math.floor(Math.random() * rockColors.length)]

    return new Rock({ x, y, size, 
        color: fillColor, 
        fillColor,
        elasticity: .5, 
        density: 5, 
        headingFollowsDirection:false 
    }, momentum)
}


function makeShip(x: number, y: number, color: string): Galley {
    return new Galley({
        x, y, color,
        size: 30,
        density: 10,
        elasticity: .7,
        maxThrust: 15000,
    })
}

export { makeRock, makeShip }
