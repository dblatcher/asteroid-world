import { Thing, Force, ThingData, Shape, Geometry, RenderFunctions, CollisionDetection, ViewPort, ExpandingRing } from '../_fake-module'
import { Bullet } from './Bullet'
import { DustCloud } from './DustCloud'

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

    shootCooldownDuration?:number
    shootCooldownCurrent?:number
}

class SpaceShip extends Thing {
    data: SpaceShipData
    constructor(config: SpaceShipData, momentum: Force = null) {
        super(config, momentum);
        this.data.color = config.color || 'red'
        this.data.fillColor = config.fillColor || 'white'
        this.data.thrust = config.thrust || 0
        this.data.maxThrust = config.maxThrust || 100
        this.data.shootCooldownCurrent = 0
        this.data.shootCooldownDuration = config.shootCooldownDuration || 20
    }

    get typeId() { return 'SpaceShip' }

    move() {
        Thing.prototype.move.apply(this,[])

        if (this.data.shootCooldownCurrent > 0) {this.data.shootCooldownCurrent--}
    }

    renderOnCanvas(ctx: CanvasRenderingContext2D, viewPort:ViewPort) {

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

        RenderFunctions.renderPolygon.onCanvas(ctx, [frontPoint, backLeftPoint, backRightPoint], { strokeColor: color, fillColor }, viewPort)


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

            RenderFunctions.renderPolygon.onCanvas(ctx, [backRightPoint, flameEndPoint, backLeftPoint], { strokeColor: 'blue', fillColor: 'green' }, viewPort)
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

    explode() {
        this.leaveWorld()

        new ExpandingRing({
            x: this.data.x,
            y: this.data.y,
            duration: 50,
            size: this.data.size * 2,
            color: this.data.color,
        }).enterWorld(this.world)

        new ExpandingRing({
            x: this.data.x,
            y: this.data.y,
            duration: 60,
            size: this.data.size * 3,
            color: 'white',
        }).enterWorld(this.world)

        new ExpandingRing({
            x: this.data.x,
            y: this.data.y,
            duration: 70,
            size: this.data.size * 4,
            color: this.data.color,
        }).enterWorld(this.world)

        new DustCloud({
            size: 5,
            numberOfSpecs: 40,
            x: this.data.x,
            y: this.data.y,
            duration: 80,
            driftSpeed:2,
            colors: ['white', this.data.color, this.data.color]
        }).enterWorld(this.world)
    }

    handleCollision(report: CollisionDetection.CollisionReport) {
        Thing.prototype.handleCollision(report)

        if (report) {
            const otherThing = report.item1 === this ? report.item2 : report.item1
            if (otherThing.typeId === 'Rock') {
                this.explode()
                this.world.emitter.emit('shipDeath', this)
            }
        }
    }

    shoot() {
        if (!this.world) {return}

        if (this.data.shootCooldownCurrent > 0) {return}
        this.data.shootCooldownCurrent = this.data.shootCooldownDuration

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

export { SpaceShip, SpaceShipData }