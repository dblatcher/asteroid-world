import { Thing, Force, Geometry, ThingData, RenderFunctions, CollisionDetection } from '../_fake-module'



class Rock extends Thing {

    jaggedEdgeShape: Force[]

    constructor(config: ThingData, momentum: Force = Force.none) {
        super(config, momentum)
        this.jaggedEdgeShape = Rock.makeJaggedEdgeShape(config)
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

    duplicate() {
        return new Rock(Object.assign({}, this.data), new Force(this.momentum.magnitude, this.momentum.direction))
    }

    renderOnCanvas(ctx: CanvasRenderingContext2D) {
        RenderFunctions.renderPolygon.onCanvas(ctx, this.jaggedEdgePoints, { strokeColor: this.data.color, fillColor: this.data.fillColor })
    }

    move() {
        Thing.prototype.move.apply(this, [])
        this.data.heading += .025
    }

    shatter() {
        if (this.data.size > 10) {
            const splitDirection = Math.random() * 2 * Math.PI
            makeFragment(this.data, splitDirection).enterWorld(this.world)
            makeFragment(this.data, -splitDirection).enterWorld(this.world)
        }

        this.leaveWorld()

        function makeFragment(data: ThingData, splitDirection: number): Rock {
            const newRockConfig = Object.assign({}, data, { 
                size: data.size / 2,
                x: data.x + Geometry.getVectorX(data.size/2, splitDirection),
                y: data.y + Geometry.getVectorY(data.size/2, splitDirection),
            })

            return new Rock(newRockConfig, new Force(5, splitDirection))
        }
    }

    handleCollision(report: CollisionDetection.CollisionReport) {
        Thing.prototype.handleCollision(report)

        if (report) {
            const otherThing = report.item1 === this ? report.item2 : report.item1
            if (otherThing.typeId === 'Bullet') {
                this.shatter()
                otherThing.leaveWorld()
                this.world.emitter.emit('rockHit', this)
            }
            if (otherThing.typeId === 'SpaceShip') {
                otherThing.leaveWorld()
                this.world.emitter.emit('shipDeath', otherThing)
            }
        }
    }

    static makeJaggedEdgeShape(config: ThingData): Force[] {
        const numberOfCorners = 8 + Math.floor(Math.random() * 4)
        const cornerSegment = (Math.PI * 2) / numberOfCorners
        const corners: Force[] = []
        let i, angleVariance, radiusVariance

        for (i = 0; i < numberOfCorners; i++) {
            angleVariance = (Math.random() - .5)
            radiusVariance = (Math.random() * config.size) / 10
            corners.push(new Force(config.size - radiusVariance, (cornerSegment * i) + angleVariance))
        }
        return corners
    }
}

export { Rock }