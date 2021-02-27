import { Thing, Force, Geometry, ThingData, RenderFunctions } from '../_fake-module'



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


    static makeJaggedEdgeShape(config: ThingData): Force[] {
        const numberOfCorners = 8 + Math.floor(Math.random() * 4)
        const cornerSegment = (Math.PI * 2) / numberOfCorners
        const corners: Force[] = []
        let i, angleVariance, radiusVariance

        for (i = 0; i < numberOfCorners; i++) {
            angleVariance = (Math.random() - .5)
            radiusVariance = (Math.random() * config.size)/10
            corners.push(new Force(config.size -radiusVariance, (cornerSegment * i) + angleVariance))
        }
        return corners
    }
}

export { Rock }