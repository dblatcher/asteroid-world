import { Force, Thing } from '../../../worlds/src'
import { SpaceShip, SpaceShipData } from './SpaceShip'


class ExplorerShipData extends SpaceShipData {
    isLaunchingFromPlanet?: boolean
}

class ExplorerShip extends SpaceShip {
    data: ExplorerShipData

    constructor(config: ExplorerShipData, force: Force = null) {
        super(config, force)
        this.data.isLaunchingFromPlanet = config.isLaunchingFromPlanet || false
    }

    get typeId() {return "ExplorerShip"}

    blastOff() {
        console.log('5,4,3,2,1...')
        this.data.isLaunchingFromPlanet=true
    }

    updateMomentum() {
        Thing.prototype.updateMomentum.apply(this, [])


        const { thrust, heading } = this.data
        const thrustForce = new Force(thrust / this.mass, heading)

        let launchForce
        if (this.data.isLaunchingFromPlanet) {
            //console.log('...lift off')
            launchForce = new Force(1500000 / this.mass, heading)
            this.data.isLaunchingFromPlanet = false
        } else {
            launchForce = Force.none
        }

        this.momentum = Force.combine([this.momentum, thrustForce, launchForce])
    }
}


export {ExplorerShip}