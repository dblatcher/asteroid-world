import { BackGround, Effect, EffectData, ViewPort } from "physics-worlds";
import { renderLine, renderPolygon } from "../../../worlds/src/renderFunctions";


class Wave extends Effect {
    constructor(data: EffectData) {
        super(data)
        this.color = data.color || 'white'
    }

    renderOnCanvas(ctx: CanvasRenderingContext2D, viewPort: ViewPort) {
        const { x, y, color, size, frame } = this
        renderLine.onCanvas(ctx, [
            { x: x - (frame * size / 10), y: y + (frame / 5) },
            { x: x + (frame * size / 10), y: y + (frame / 5) }
        ], { strokeColor: color }, viewPort)
    }

    tick() {
        this.frame++
        if (this.frame >= this.duration) { this.leaveWorld() }
    }
}

class OceanData {
    fillColor?: string
}

class Ocean extends BackGround {
    color: string

    constructor(data: OceanData) {
        super()
        this.color = data.fillColor || 'blue'
    }

    tick() {
        const { world } = this
        if (!world) { return }

        const waveCount = world.effects.filter(effect => Object.getPrototypeOf(effect).constructor === Wave).length

        if (waveCount < 10) {
            new Wave({
                x: Math.random() * world.width,
                y: Math.random() * world.height,
                size: 2,
                duration: 40 + Math.floor(Math.random() * 20),
            }).enterWorld(world)
        }
    }

    renderOnCanvas(ctx: CanvasRenderingContext2D, viewPort: ViewPort) {
        const mappedCorners = viewPort.worldCorners.map(point => viewPort.mapPoint(point))
        renderPolygon.onCanvas(ctx, mappedCorners, { fillColor: this.color }, viewPort)
    }
}


export { Ocean, OceanData }