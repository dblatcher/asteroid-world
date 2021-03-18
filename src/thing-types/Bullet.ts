import { Body, Force, BodyData, Shape, Geometry, RenderFunctions, CollisionDetection } from '../../../worlds/src/index'
import { Rock } from './Rock'

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
        this.ticksRemaining = config.ticksRemaining || Infinity
    }

    get typeId() { return 'Bullet' }

    move() {
        Body.prototype.move.apply(this, [])

        if (this.ticksRemaining-- < 0) {
            this.leaveWorld()
        }
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