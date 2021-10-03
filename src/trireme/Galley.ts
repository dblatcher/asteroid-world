import { Body, Force, BodyData, Shape, Geometry, RenderFunctions, CollisionDetection, ViewPort, ExpandingRing, shapes } from '../_fake-module'
import { Bullet } from '../thing-types/Bullet'
import { DustCloud } from '../thing-types/DustCloud'
import { normaliseHeading, Point, Vector, _90deg, _deg } from '../../../worlds/src/geometry'
import { calculateDragForce } from '../../../worlds/src/physics'
import { renderLine } from '../../../worlds/src/renderFunctions'

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
    corners?: Point[]

    headingFollowsDirection?: false
    fillColor?: string
    thrust?: number
    maxThrust?: number

    shootCooldownDuration?: number
    shootCooldownCurrent?: number

    rudderAngle?: number
    oarSpeed?: number
    oarPosition?: number
}

class Galley extends Body {
    data: GalleyData
    oarSplash: boolean

    constructor(config: GalleyData, momentum: Force = null) {
        super(config, momentum);
        this.data.color = config.color || 'white'
        this.data.fillColor = config.fillColor || 'white'
        this.data.thrust = config.thrust || 0
        this.data.maxThrust = config.maxThrust || 100
        this.data.shootCooldownCurrent = 0
        this.data.shootCooldownDuration = config.shootCooldownDuration || 20
        this.data.rudderAngle = config.rudderAngle || 0
        this.data.oarSpeed = config.oarSpeed || .25
        this.data.oarPosition = config.oarPosition || 0
        this.oarSplash = false

        this.data.shape = shapes.polygon
        this.data.corners = [
            { x: 0, y: 1 },
            { x: Galley.width, y: .5 },
            { x: Galley.width, y: -.9 },
            { x: 0, y: -1 },
            { x: -Galley.width, y: -.9 },
            { x: -Galley.width, y: .5 },
        ]
    }

    static width = .2
    static oarPositionPhases = 60

    get typeId() { return 'Galley' }

    rudderLength = 15
    oarLength = 25
    steerSpeed = .05
    oarForceMultiplier = 8000
    maxOarSpeed = 2

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

        return 1 + (effect * 5)
    }

    get oarsAreAboveWater(): boolean {
        return this.data.oarPosition > (Galley.oarPositionPhases / 2)
    }

    get oarForceMagnitude(): number {
        return this.oarsAreAboveWater ? this.data.oarSpeed * this.oarForceMultiplier : 0;
    }


    tick() {
        if (this.data.shootCooldownCurrent > 0) { this.data.shootCooldownCurrent-- }
        const rotation = this.data.rudderAngle * this.momentum.magnitude / 200
        this.data.heading += rotation
        this.moveOars()
    }

    renderOnCanvas(ctx: CanvasRenderingContext2D, viewPort: ViewPort) {
        Body.prototype.renderOnCanvas.apply(this, [ctx, viewPort])

        const toBack: Vector = new Force(this.data.size, this.data.heading).vector
        const back: Point = translatePoint(this.shapeValues, toBack, true)

        const toRudderEnd = new Force(this.rudderLength, this.data.heading + this.data.rudderAngle)
        const rudderEnd: Point = translatePoint(back, toRudderEnd.vector, true)

        renderLine.onCanvas(ctx, [
            back,
            rudderEnd,
        ], { fillColor: 'red', strokeColor: 'red', lineWidth: 8 }, viewPort)


        const oarAngle = (Math.abs(this.data.oarPosition - Galley.oarPositionPhases / 2) / (Galley.oarPositionPhases * 12)) - (2 / _deg)
        this.renderOar(ctx, viewPort, oarAngle, true, .1);
        this.renderOar(ctx, viewPort, oarAngle, false, .1);
        this.renderOar(ctx, viewPort, oarAngle, true, -.5);
        this.renderOar(ctx, viewPort, oarAngle, false, -.5);
    }

    renderOar(ctx: CanvasRenderingContext2D, viewPort: ViewPort, oarAngle: number, onRight: boolean, forwardFromCenter = 0) {

        const toForward: Vector = new Force(this.data.size * forwardFromCenter, this.data.heading).vector
        const toSide: Vector = new Force(this.data.size * Galley.width, this.data.heading + _90deg).vector
        const side: Point = translatePoint(
            translatePoint(this.shapeValues, toSide, onRight),
            toForward)


        const toOarEnd: Vector = onRight
            ? new Force(this.oarLength, this.data.heading - (oarAngle / _deg)).vector
            : new Force(this.oarLength, this.data.heading + (oarAngle / _deg)).vector;

        const oarEnd: Point = translatePoint(side, toOarEnd)

        renderLine.onCanvas(ctx, [
            side,
            oarEnd,
        ], { fillColor: 'red', strokeColor: 'red', lineWidth: 4 }, viewPort)

        if (this.oarSplash) {
            new ExpandingRing({ ...oarEnd, size: 6, duration: 50, color: 'white' }).enterWorld(this.world)
        }
    }

    updateMomentum() {
        const { mass, dragMultiplier } = this
        const drag = calculateDragForce(this, Force.combine([this.momentum]));

        drag.magnitude *= dragMultiplier;

        this.momentum = Force.combine([this.momentum, drag])
        this.otherBodiesCollidedWithThisTick = []

        const { heading } = this.data
        const { oarForceMagnitude } = this

        const thrustForce = new Force(oarForceMagnitude / mass, heading)
        this.momentum = Force.combine([this.momentum, thrustForce])
    }

    moveOars() {
        const startsAboveWater = this.oarsAreAboveWater;
        this.data.oarPosition += startsAboveWater
            ? this.data.oarSpeed
            : this.data.oarSpeed * 3;

        this.oarSplash = startsAboveWater != this.oarsAreAboveWater;
        this.data.oarPosition = this.data.oarPosition % Galley.oarPositionPhases
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
                this.data.rudderAngle += this.steerSpeed;
                break;
            case "RIGHT":
                this.data.rudderAngle -= this.steerSpeed;
                break;
        }

        this.data.rudderAngle = Math.max(this.data.rudderAngle, -60 * _deg)
        this.data.rudderAngle = Math.min(this.data.rudderAngle, 60 * _deg)
    }

    changeOarSpeed(change: number) {
        let newAmount = this.data.oarSpeed + change
        if (newAmount < 0) { newAmount = 0 }
        if (newAmount > this.maxOarSpeed) { newAmount = this.maxOarSpeed}
        this.data.oarSpeed = newAmount
    }

}

export { Galley, GalleyData }