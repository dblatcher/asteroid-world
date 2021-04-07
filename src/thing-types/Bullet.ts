import { Body, Force, BodyData, Shape, Geometry, RenderFunctions, CollisionDetection, ViewPort } from '../../../worlds/src/index'
import { Rock } from './Rock'
const { renderCircle, renderLine, renderPoint } = RenderFunctions

class BulletData implements BodyData {
    x: number
    y: number
    color?: string
    fillColor?: string
    ticksRemaining?: number
}

class Bullet extends Body {

    ticksRemaining: number

    constructor(config: BulletData, momentum: Force = null) {
        super(config, momentum);
        this.data.headingFollowsDirection = true
        this.ticksRemaining = config.ticksRemaining || Infinity
    }

    get typeId() { return 'Bullet' }

    move() {
        Body.prototype.move.apply(this, [])

        if (this.ticksRemaining-- < 0) {
            this.leaveWorld()
        }
    }

    renderOnCanvas(ctx: CanvasRenderingContext2D, viewPort: ViewPort) {

        const { shapeValues, ticksRemaining } = this
        const {size, color, heading} = this.data

        const glow: Geometry.Circle = {
            x: shapeValues.x,
            y: shapeValues.y,
            radius: size + 1 + ((ticksRemaining % 4)/2)
        }

        const tail: [Geometry.Point, Geometry.Point] = [
            shapeValues,
            Geometry.translatePoint(shapeValues, Geometry.getXYVector(-10,heading))
        ]

        renderCircle.onCanvas(ctx, glow, { fillColor: 'rgba(255,255,255,.75)' }, viewPort);
        renderLine.onCanvas(ctx, tail, { strokeColor: color }, viewPort);
    }

    handleCollision(report: CollisionDetection.CollisionReport) {
        Body.prototype.handleCollision(report)

        if (report) {
            const otherThing = report.item1 === this ? report.item2 : report.item1
            if (otherThing.typeId === 'Rock') {
                (otherThing as Rock).shatter(report)
                this.leaveWorld()
                this.world.emitter.emit('rockHit', otherThing)
            }
        }
    }

}


export { Bullet }