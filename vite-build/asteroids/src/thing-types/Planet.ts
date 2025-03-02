import { AbstractGradientFill, BodyData, Shape, Body } from "physics-worlds";



class PlanetData implements BodyData {
    x: number
    y: number
    heading?: number
    size?: number
    headingFollowsDirection?: boolean
    shape?: Shape
    color?: string
    fillColor?: string | AbstractGradientFill
    density?: number
    elasticity?: number
    immobile?: boolean
    renderHeadingIndicator?: boolean
    renderPathAhead?: boolean

    name:string
}

class Planet extends Body {
    data: PlanetData
    get typeId(){return 'Planet'}

    constructor(planetData:PlanetData) {
        super(planetData)

        this.data.name = planetData.name || '[unknown]'
    }
}


export { Planet };
