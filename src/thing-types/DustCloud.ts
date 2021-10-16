import { Effect, EffectData, ViewPort, RenderFunctions, Geometry } from "physics-worlds";

class Spec {
    x: number
    y: number
    color: string
    driftVector: Geometry.Vector
    constructor(config: DustCloudData) {

        const { colors = null, size, x, y, driftSpeed = 1, driftBiasX = 0, driftBiasY = 0 } = config

        if (colors) {
            this.color = colors[Math.floor(Math.random() * colors.length)]
        } else {
            this.color = "white"
        }

        this.x = x + (Math.random() * size) - (size / 2)
        this.y = y + (Math.random() * size) - (size / 2)

        this.driftVector = {
            x: driftSpeed * (Math.random() - (1 / 2) + driftBiasX),
            y: driftSpeed * (Math.random() - (1 / 2)) + driftBiasY,
        }
    }

    get radius() { return 1 }
    drift() {
        const { driftVector } = this
        this.x += driftVector.x
        this.y += driftVector.y
    }
}

interface DustCloudData {
    x: number
    y: number
    frame?: number
    duration: number
    size: number
    colors?: string[]
    numberOfSpecs: number
    driftSpeed?: number
    driftBiasX?: number
    driftBiasY?: number
}

class DustCloud extends Effect {
    size: number
    specs: Spec[]
    numberOfSpecs: number

    constructor(config: DustCloudData) {
        super(config)
        this.specs = []
        this.numberOfSpecs = config.numberOfSpecs
        for (let i = 0; i < config.numberOfSpecs; i++) {
            this.specs.push(new Spec(config))
        }
    }

    get disapearRate() {
        return Math.round(1 / (this.numberOfSpecs / this.duration))
    }

    tick() {
        Effect.prototype.tick.apply(this, [])
        if (this.frame % this.disapearRate == 0) { this.specs.pop() }
        this.specs.forEach(spec => {
            spec.drift()
        })
    }

    renderOnCanvas(ctx: CanvasRenderingContext2D, viewPort: ViewPort) {
        this.specs.forEach(spec => {
            RenderFunctions.renderCircle.onCanvas(ctx, spec, { strokeColor: spec.color, fillColor:spec.color }, viewPort)
        })
    }
}

export { DustCloud, DustCloudData }