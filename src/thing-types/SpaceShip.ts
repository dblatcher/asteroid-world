import { Thing, Force, ThingData, Shape, Geometry, RenderFunctions } from '../_fake-module'
import { Bullet } from './Bullet'

const { getVectorX, getVectorY, reverseHeading } = Geometry

class SpaceShipData implements ThingData {
    x: number
    y: number
    heading?: number
    size?: number
    color?: string
    density?: number
    shape?: Shape
    elasticity?: number

    headingFollowsDirection?: false
    fillColor?: string
    thrust?: number
    maxThrust?: number
}

class SpaceShip extends Thing {
    data: SpaceShipData
    constructor(config: SpaceShipData, momentum: Force = null) {
        super(config, momentum);
        this.data.color = config.color || 'red'
        this.data.fillColor = config.fillColor || 'white'
        this.data.thrust = config.thrust || 0
        this.data.maxThrust = config.maxThrust || 100
    }

    get typeId() { return 'SpaceShip' }

    renderOnCanvas(ctx: CanvasRenderingContext2D) {

        const { x, y, size, heading, color, fillColor, thrust, maxThrust } = this.data

        let frontPoint = {
            x: x + getVectorX(size, heading),
            y: y + getVectorY(size, heading)
        }

        const backSideAngle = Math.PI * .75

        let backLeftPoint = {
            x: x + getVectorX(size, heading - backSideAngle),
            y: y + getVectorY(size, heading - backSideAngle)
        }
        let backRightPoint = {
            x: x + getVectorX(size, heading + backSideAngle),
            y: y + getVectorY(size, heading + backSideAngle)
        }

        RenderFunctions.renderPolygon.onCanvas(ctx, [frontPoint, backLeftPoint, backRightPoint], { strokeColor: color, fillColor })


        if (thrust > 0) {
            let backPoint = {
                x: x - getVectorX(size, heading),
                y: y - getVectorY(size, heading)
            }

            let flicker = (Math.random() - .5) * .5
            let flameEndPoint = {
                x: backPoint.x + getVectorX(size * (thrust / maxThrust) * 2, reverseHeading(heading + flicker)),
                y: backPoint.y + getVectorY(size * (thrust / maxThrust) * 2, reverseHeading(heading + flicker))
            }

            RenderFunctions.renderPolygon.onCanvas(ctx, [backRightPoint, flameEndPoint, backLeftPoint], { strokeColor: 'blue', fillColor: 'green' })
        }
    }

    changeThrottle(change: number) {
        let newAmount = this.data.thrust + change
        if (newAmount < 0) { newAmount = 0 }
        if (newAmount > this.data.maxThrust) { newAmount = this.data.maxThrust }
        this.data.thrust = newAmount
    }

    updateMomentum() {
        Thing.prototype.updateMomentum.apply(this, [])
        const { thrust, heading } = this.data
        const thrustForce = new Force(thrust / this.mass, heading)
        this.momentum = Force.combine([this.momentum, thrustForce])
    }

    shoot() {

        const bullet = new Bullet({
            x: this.data.x + getVectorX(this.data.size+5, this.data.heading),
            y: this.data.y + getVectorY(this.data.size+5, this.data.heading),
            color: 'red',
            fillColor: 'red',
            ticksRemaining: 100
        }, new Force(10, this.data.heading))

        bullet.enterWorld(this.world)

    }

}

export { SpaceShip }