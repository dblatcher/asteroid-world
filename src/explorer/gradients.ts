import { RadialGradientFill, Geometry } from "../../../worlds/src";

const { getVectorX, getVectorY } = Geometry

const redSwirl = new RadialGradientFill({
    fallbackColor: "pink",
    canvasFunction: (ctx: CanvasRenderingContext2D, circle: Geometry.Circle, heading: number) => {

        const offCenter: Geometry.Vector = {
            x: getVectorX(circle.radius * .25, heading),
            y: getVectorY(circle.radius * .25, heading)
        }

        const innerCircle: Geometry.Circle = {
            x: circle.x + offCenter.x,
            y: circle.y + offCenter.y,
            radius: circle.radius * (1 / 2)
        }

        const gradient = ctx.createRadialGradient(innerCircle.x, innerCircle.y, innerCircle.radius, circle.x, circle.y, circle.radius);
        gradient.addColorStop(0, 'red');
        gradient.addColorStop(.1, 'pink');
        gradient.addColorStop(.7, 'crimson');
        gradient.addColorStop(.8, 'crimson');
        gradient.addColorStop(.9, 'pink');
        gradient.addColorStop(1, 'red');

        return gradient;
    }
})

const blueGreenBall = new RadialGradientFill({
    fallbackColor: "blue",
    canvasFunction: (ctx: CanvasRenderingContext2D, circle: Geometry.Circle, heading: number) => {


        const innerCircle: Geometry.Circle = {
            x: circle.x,
            y: circle.y,
            radius: circle.radius * (3 / 4)
        }

        const gradient = ctx.createRadialGradient(innerCircle.x, innerCircle.y, innerCircle.radius, circle.x, circle.y, circle.radius);
        gradient.addColorStop(0, 'green');
        gradient.addColorStop(1, 'blue');

        return gradient;
    }
})

export { redSwirl, blueGreenBall }