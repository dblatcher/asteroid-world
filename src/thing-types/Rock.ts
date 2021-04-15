import { } from '../../../worlds/src/Effect'
import { Body, Force, Geometry, BodyData, RenderFunctions, CollisionDetection, ViewPort, ExpandingRing } from '../_fake-module'
import { DustCloud } from './DustCloud'
import { SpaceShip } from './SpaceShip'

class Rock extends Body {

    jaggedEdgeShape: Force[]
    rotation: number

    constructor(config: BodyData, momentum: Force = Force.none) {
        super(config, momentum)
        this.jaggedEdgeShape = Rock.makeJaggedEdgeShape(config)
        this.rotation = (.02 + Math.random() * .01) * (Math.random() > .5 ? 1 : -1)
    }

    get typeId() { return 'Rock' }

    get jaggedEdgePoints(): Geometry.Point[] {
        return this.jaggedEdgeShape.map(force => {
            return {
                x: this.data.x + Geometry.getVectorX(force.magnitude, force.direction + this.data.heading),
                y: this.data.y + Geometry.getVectorY(force.magnitude, force.direction + this.data.heading),
            }
        })
    }

    renderOnCanvas(ctx: CanvasRenderingContext2D, viewPort: ViewPort) {
        RenderFunctions.renderPolygon.onCanvas(ctx, this.jaggedEdgePoints, { strokeColor: this.data.color, fillColor: this.data.fillColor }, viewPort)
    }

    move() {
        Body.prototype.move.apply(this, [])
        this.data.heading += this.rotation
    }

    shatter(report: CollisionDetection.CollisionReport = null) {
        if (this.data.size > 10) {

            let impactDirection = Math.random() * 2 * Math.PI
            if (report) {
                let otherThing = report.item1 == this ? report.item2 : report.item1
                impactDirection = otherThing.momentum.direction
            }

            makeFragment(this.data, impactDirection + Geometry._90deg).enterWorld(this.world)
            makeFragment(this.data, impactDirection - Geometry._90deg).enterWorld(this.world)

            new ExpandingRing({
                x: report ? report.impactPoint.x : this.data.x,
                y: report ? report.impactPoint.y : this.data.y,
                duration: 20 + Math.floor(this.data.size / 10),
                size: this.data.size / 2,
                color: 'white',
            }).enterWorld(this.world)

            const driftBias = Geometry.getXYVector(1, impactDirection + Geometry._90deg)

            new DustCloud({
                size: 10,
                numberOfSpecs: this.data.size / 2,
                x: this.data.x,
                y: this.data.y,
                driftBiasX: driftBias.x,
                driftBiasY: driftBias.y,
                duration: 40,
                driftSpeed: 1,
                colors: [this.data.color, 'white'],
            }).enterWorld(this.world)

            new DustCloud({
                size: 10,
                numberOfSpecs: this.data.size / 2,
                x: this.data.x,
                y: this.data.y,
                driftBiasX: -driftBias.x,
                driftBiasY: -driftBias.y,
                duration: 40,
                driftSpeed: 1,
                colors: [this.data.color, 'white'],
            }).enterWorld(this.world);

            this.world.emitter.emit('SFX', { soundName: 'rockThud', source: this });
        } else {

            new DustCloud({
                size: 10,
                numberOfSpecs: 20,
                x: this.data.x,
                y: this.data.y,
                duration: 50,
                colors: ['red', 'blue', 'pink']
            }).enterWorld(this.world);
            this.world.emitter.emit('SFX', { soundName: 'rockDisintergrating', source: this });
        }


        this.leaveWorld()

        function makeFragment(data: BodyData, splitDirection: number): Rock {
            const newRockConfig = Object.assign({}, data, {
                size: data.size / 2,
                x: data.x + Geometry.getVectorX(data.size / 2, splitDirection),
                y: data.y + Geometry.getVectorY(data.size / 2, splitDirection),
            })

            return new Rock(newRockConfig, new Force(3, splitDirection))
        }
    }

    handleCollision(report: CollisionDetection.CollisionReport) {

        const otherThing = report.item1 === this ? report.item2 : report.item1
        if (otherThing.typeId === 'Bullet') {
            this.shatter(report)
            otherThing.leaveWorld()
            this.world.emitter.emit('rockHit', this)
        }
        if (otherThing.typeId === 'SpaceShip') {
            const drift = Geometry.getXYVector(1, this.momentum.direction);
            (otherThing as SpaceShip).explode({ driftBiasX: drift.x, driftBiasY: drift.y })
            this.world.emitter.emit('shipDeath', otherThing)
        }
        if (otherThing.typeId === 'Rock') {
            this.world.emitter.emit('SFX', { soundName: 'rockThud', config: { volume: .2 }, source: this });
        }

        Body.prototype.handleCollision(report)
    }

    static makeJaggedEdgeShape(config: BodyData): Force[] {
        const numberOfCorners = 9 + Math.floor(Math.random() * 3)
        const cornerSegment = (Math.PI * 2) / numberOfCorners
        const corners: Force[] = []
        let i, angleVariance, radiusVariance

        for (i = 0; i < numberOfCorners; i++) {
            angleVariance = (Math.random() - .5) * (2 / 3)
            radiusVariance = (Math.random() * config.size) * (2 / 14)
            corners.push(new Force(config.size - radiusVariance, (cornerSegment * i) + angleVariance))
        }
        return corners
    }
}

export { Rock }