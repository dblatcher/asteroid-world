import { _deg } from '../../../worlds/src/geometry'
import { Body, Force } from 'physics-worlds'
import { Rock } from '../thing-types/Rock'
import { Galley } from './Galley'


const rockColors = ['gainsboro', 'darksalmon', 'dimgray', 'darkgray', 'azure', 'cornsilk',]

function makeRock(x: number, y: number, size: number, momentum?: Force): Body {
    const fillColor = rockColors[Math.floor(Math.random() * rockColors.length)]

    return new Rock({
        x, y, size,
        color: fillColor,
        fillColor,
        elasticity: .5,
        density: 5,
        headingFollowsDirection: false
    }, momentum)
}


function makeShip(x: number, y: number, fillColor: string): Galley {
    return new Galley({
        x, y, fillColor,
        size: 30,
        density: 5,
        elasticity: .7,
        maxThrust: 30000,
        rudderAngle: 0,
    })
}

export { makeRock, makeShip }
