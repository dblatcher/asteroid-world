import { Body, Force, BodyData, Shape, Geometry, RenderFunctions, CollisionDetection, ViewPort, ExpandingRing, shapes } from '../_fake-module'
import { Bullet } from '../thing-types/Bullet'
import { DustCloud } from '../thing-types/DustCloud'
import { normaliseHeading, Point, _90deg, _deg } from '../../../worlds/src/geometry'
import { calculateDragForce } from '../../../worlds/src/physics'

const { getVectorX, getVectorY, reverseHeading, getXYVector, translatePoint, _360deg } = Geometry

class GalleyData implements BodyData {
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

    shootCooldownDuration?: number
    shootCooldownCurrent?: number

    corners?: Point[]
}

class Galley extends Body {
    data: GalleyData
    constructor(config: GalleyData, momentum: Force = null) {
        super(config, momentum);
        this.data.color = config.color || 'red'
        this.data.fillColor = config.fillColor || 'white'
        this.data.thrust = config.thrust || 0
        this.data.maxThrust = config.maxThrust || 100
        this.data.shootCooldownCurrent = 0
        this.data.shootCooldownDuration = config.shootCooldownDuration || 20

        this.data.shape = shapes.polygon
        this.data.corners = [
            { x: 0, y: 1 },
            { x: .3, y: .5 },
            { x: .3, y: -.9 },
            { x: 0, y: -1 },
            { x: -.3, y: -.9 },
            { x: -.3, y: .5 },
        ]
    }

    get typeId() { return 'Galley' }

    tick() {
        if (this.data.shootCooldownCurrent > 0) { this.data.shootCooldownCurrent-- }
    }

    renderOnCanvas(ctx: CanvasRenderingContext2D, viewPort: ViewPort) {
        Body.prototype.renderOnCanvas.apply(this, [ctx, viewPort])

    }

    get angleAwayFromHeading(): number {
        const { heading } = this.data
        const { direction } = this.momentum
        return normaliseHeading(Math.abs(heading - direction))
    }

    get dragMultiplier(): number {
        const { angleAwayFromHeading } = this
        const degreesToHeading = Math.floor(angleAwayFromHeading / _deg);

        const effect = degreesToHeading <= 90
            ? degreesToHeading / 90
            : degreesToHeading <= 180
                ? (180 - degreesToHeading) / 90
                : degreesToHeading <= 270
                    ? (degreesToHeading - 180) / 90
                    : (360 - degreesToHeading) / 90;

        return 1 + (effect * 4)
    }

    updateMomentum() {
        const { mass, dragMultiplier } = this

        const drag = calculateDragForce(this, Force.combine([this.momentum]));

        drag.magnitude *= dragMultiplier;

        this.momentum = Force.combine([this.momentum, drag])
        this.otherBodiesCollidedWithThisTick = []

        const { thrust, heading } = this.data
        const thrustForce = new Force(thrust / mass, heading)
        this.momentum = Force.combine([this.momentum, thrustForce])
    }


    explode(config: {
        driftBiasX?: number
        driftBiasY?: number
    } = {}) {

        const { driftBiasX = 0, driftBiasY = 0 } = config

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
            size: 1,
            numberOfSpecs: 50,
            x: this.data.x,
            y: this.data.y,
            duration: 100,
            driftSpeed: 2,
            driftBiasX,
            driftBiasY,
            colors: ['white', this.data.color, this.data.color]
        }).enterWorld(this.world)

        this.world.emitter.emit('SFX', { soundName: 'shipExploding', source: this });
    }

    handleCollision(report: CollisionDetection.CollisionReport) {

        switch (report.item2.typeId) {
            case 'Rock':
                const drift = Geometry.getXYVector(-1, this.momentum.direction);
                this.explode({ driftBiasX: drift.x, driftBiasY: drift.y })
                this.world.emitter.emit('shipDeath', this)
        }

        Body.prototype.handleCollision(report)
    }


    respondToImpact(report: CollisionDetection.CollisionReport) {

        switch (report.item1.typeId) {
            case 'Rock':
                const drift = Geometry.getXYVector(1, report.item1.momentum.direction);
                this.explode({ driftBiasX: drift.x, driftBiasY: drift.y })
                this.world.emitter.emit('shipDeath', this)
                break;
        }

    }

    get steerSpeed() { return .075 }

    shoot() {
        if (!this.world) { return }

        if (this.data.shootCooldownCurrent > 0) { return }
        this.data.shootCooldownCurrent = this.data.shootCooldownDuration

        const bullet = new Bullet({
            x: this.data.x + getVectorX(this.data.size + 5, this.data.heading),
            y: this.data.y + getVectorY(this.data.size + 5, this.data.heading),
            color: 'red',
            fillColor: 'red',
            ticksRemaining: 100
        }, new Force(10, this.data.heading))

        bullet.enterWorld(this.world)
        this.world.emitter.emit('SFX', { soundName: 'laser', source: this });
    }

    steer(direction: "LEFT" | "RIGHT") {
        switch (direction) {
            case "LEFT":
                this.data.heading += this.steerSpeed;
                break;
            case "RIGHT":
                this.data.heading -= this.steerSpeed;
                break;
        }
    }

    changeThrottle(change: number) {
        let newAmount = this.data.thrust + change
        if (newAmount < 0) { newAmount = 0 }
        if (newAmount > this.data.maxThrust) { newAmount = this.data.maxThrust }
        this.data.thrust = newAmount
    }

}

export { Galley, GalleyData }