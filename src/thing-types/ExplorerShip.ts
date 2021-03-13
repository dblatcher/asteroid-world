import { Force, Physics, Thing } from '../../../worlds/src'
import { getDistanceBetweenPoints } from '../../../worlds/src/geometry'
import { Planet } from './Planet'
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

    get typeId() { return "ExplorerShip" }

    get closestPlanet() {
        if (!this.world) { return null }
        return this.world.things
            .filter(thing => thing.typeId === 'Planet')
            .sort(
                (planetA, planetB) => getDistanceBetweenPoints(planetA.data, this.data) - getDistanceBetweenPoints(planetB.data, this.data)
            )[0] as Planet || null
    }

    get planetThisIsOn() {
        if (!this.world) { return null }
        return this.world.things
            .filter(thing => thing.typeId === 'Planet')
            .find(
                planet => getDistanceBetweenPoints(planet.data, this.data) < planet.data.size + (this.data.size * 1.1)
            ) as Planet || null
    }

    blastOff() {
        const { planetThisIsOn } = this

        if (planetThisIsOn && !this.data.isLaunchingFromPlanet)

            console.log('5,4,3,2,1...')
        this.data.isLaunchingFromPlanet = true
    }

    updateMomentum() {
        const { planetThisIsOn, closestPlanet,mass } = this
        const { thrust, heading, isLaunchingFromPlanet, maxThrust } = this.data


        if (isLaunchingFromPlanet) {

            Thing.prototype.updateMomentum.apply(this, [])
            const gravity = Physics.getGravitationalForce(this.world.gravitationalConstant, this, closestPlanet)
            let altitude = getDistanceBetweenPoints(closestPlanet.data, this.data) - closestPlanet.data.size 

            const takeOffForce = new Force(
                ((gravity.magnitude) + 100)/mass
                , heading
            )

            const thrustForce = new Force(thrust / this.mass, heading)
            this.momentum = Force.combine([this.momentum, thrustForce, takeOffForce])


            
        
            //if (altitude > 300) {this.data.isLaunchingFromPlanet = false}
            if (gravity.magnitude < maxThrust/2) { 
                this.data.isLaunchingFromPlanet = false
                console.log('ESCAPE')
            }

            console.log(`g: ${gravity.magnitude/mass}N L: ${takeOffForce.magnitude}N : ALT: ${altitude}M`)

        } else if (!planetThisIsOn) {
            Thing.prototype.updateMomentum.apply(this, [])
            const thrustForce = new Force(thrust / this.mass, heading)
            this.momentum = Force.combine([this.momentum, thrustForce])
        } else {
            this.momentum = Force.none
        }

    }
}


export { ExplorerShip }