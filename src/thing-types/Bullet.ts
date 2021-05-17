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

    tick() {
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
            switch(report.item2.typeId) {
                case 'Rock':
                this.leaveWorld()
                break;
            }
        }
    }


    respondToImpact(report: CollisionDetection.CollisionReport) {

        switch(report.item1.typeId) {
            case 'Rock':
                this.leaveWorld()
                break;
        }

    }

}


export { Bullet }