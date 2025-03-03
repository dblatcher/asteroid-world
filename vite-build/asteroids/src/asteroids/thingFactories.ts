import { Body, Force } from 'physics-worlds'
import { SpaceShip } from '../thing-types/SpaceShip'
import { Rock } from '../thing-types/Rock'


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


function makeShip(x: number, y: number, color: string): SpaceShip {
    return new SpaceShip({
        x, y, color,
        size: 10,
        density: 10,
        elasticity: .7,
        maxThrust: 3000,
        thrust: 0,

        heading: 0,
        fillColor: 'white',
        shootCooldownDuration: 20,
        shootCooldownCurrent: 0
    })
}

export { makeRock, makeShip }
