import { CollisionDetection, Force, Physics, RenderFunctions, Body, ViewPort, Geometry } from '../../../worlds/src'
import { Planet } from './Planet'
import { SpaceShip, SpaceShipData } from './SpaceShip'

const { getDistanceBetweenPoints, getVectorX, getVectorY, reverseHeading } = Geometry

class ExplorerShipData extends SpaceShipData {
    isLaunchingFromPlanet?: boolean
    planetThisIsOn?: Planet
    maxImpact?: number
}

class ExplorerShip extends SpaceShip {
    data: ExplorerShipData

    constructor(config: ExplorerShipData, force: Force = null) {
        super(config, force)
        this.data.isLaunchingFromPlanet = config.isLaunchingFromPlanet || false
        this.data.planetThisIsOn = config.planetThisIsOn || null
        this.data.maxImpact = config.maxImpact || 0
    }

    get typeId() { return "ExplorerShip" }

    get closestPlanet() {
        if (!this.world) { return null }
        return this.world.bodies
            .filter(thing => thing.typeId === 'Planet')
            .sort(
                (planetA, planetB) => getDistanceBetweenPoints(planetA.data, this.data) - getDistanceBetweenPoints(planetB.data, this.data)
            )[0] as Planet || null
    }

    handleCollision(report: CollisionDetection.CollisionReport) {
        Body.prototype.handleCollision(report)

        if (report) {
            const otherThing = report.item1 === this ? report.item2 : report.item1
            if (otherThing.typeId === 'Planet') {
                console.log('PLANET', report.force)
                if (report.force > this.data.maxImpact) {
                    this.explode()
                } else if (!this.data.isLaunchingFromPlanet) {
                    this.data.planetThisIsOn = otherThing as Planet
                }
            }
        }
    }

    renderOnCanvas(ctx: CanvasRenderingContext2D, viewPort:ViewPort) {
        SpaceShip.prototype.renderOnCanvas.apply(this, [ctx, viewPort])

        const { x, y, size, heading, isLaunchingFromPlanet } = this.data

        if (isLaunchingFromPlanet) {
            let backPoint = {
                x: x - getVectorX(size, heading),
                y: y - getVectorY(size, heading)
            }
            let flicker = size * (.5+ (Math.random()*.5) )
            RenderFunctions.renderCircle.onCanvas(ctx, {x:backPoint.x, y:backPoint.y, radius:flicker}, { strokeColor: 'white', fillColor: 'red' }, viewPort)
        }
    }

    blastOff() {
        const { planetThisIsOn } = this.data

        if (planetThisIsOn && !this.data.isLaunchingFromPlanet) {
            console.log('5,4,3,2,1...')
            this.data.isLaunchingFromPlanet = true
            this.data.planetThisIsOn = null
        }
    }

    updateMomentum() {
        const { closestPlanet, mass } = this
        const { planetThisIsOn, thrust, heading, isLaunchingFromPlanet, maxThrust } = this.data
        const thrustForce = new Force(thrust / this.mass, heading)

        if (isLaunchingFromPlanet) {

            Body.prototype.updateMomentum.apply(this, [])
            const gravity = Physics.getGravitationalForce(this.world.gravitationalConstant, this, closestPlanet)
            let altitude = getDistanceBetweenPoints(closestPlanet.data, this.data) - closestPlanet.data.size

            const takeOffForce = new Force(
                ((gravity.magnitude) + 100) / mass
                , heading
            )

            this.momentum = Force.combine([this.momentum, thrustForce, takeOffForce])

            if (gravity.magnitude < maxThrust / 2) {
                this.data.isLaunchingFromPlanet = false
                console.log('ESCAPE', altitude)
            }

           // console.log(`g: ${gravity.magnitude / mass}N L: ${takeOffForce.magnitude}N : ALT: ${altitude}M`)

        } else if (planetThisIsOn) {
            this.momentum = Force.none
        } else {
            Body.prototype.updateMomentum.apply(this, [])
            this.momentum = Force.combine([this.momentum, thrustForce])
        }

    }
}


export { ExplorerShip }