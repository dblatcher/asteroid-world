import { Thing, Force, ThingData, Shape, Geometry, RenderFunctions, CollisionDetection } from '../../../worlds/src/index'
import { Rock } from './Rock'

class BulletData implements ThingData {
    x: number
    y: number
    color?: string
    fillColor?: string
    ticksRemaining?: number
}

class Bullet extends Thing {

    ticksRemaining: number

    constructor(config: BulletData, momentum: Force = null) {
        super(config, momentum);
        this.ticksRemaining = config.ticksRemaining || Infinity
    }

    get typeId() { return 'Bullet' }

    move() {
        Thing.prototype.move.apply(this, [])

        if (this.ticksRemaining-- < 0) {
            this.leaveWorld()
        }
    }

    handleCollision(report: CollisionDetection.CollisionReport) {
        Thing.prototype.handleCollision(report)

        if (report) {
            const otherThing = report.item1 === this ? report.item2 : report.item1
            if (otherThing.typeId === 'Rock') {
                (otherThing as Rock).shatter()
                this.leaveWorld()
            }
        }
    }

}


export { Bullet }