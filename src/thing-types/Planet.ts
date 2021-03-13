import { Shape, Thing, ThingData } from "../../../worlds/src";

class PlanetData implements ThingData {
    x: number
    y: number
    heading?: number
    size?: number
    headingFollowsDirection?: boolean
    shape?: Shape
    color?: string
    fillColor?: string
    density?: number
    elasticity?: number
    immobile?: boolean
    renderHeadingIndicator?: boolean
    renderPathAhead?: boolean

    name:string
}

class Planet extends Thing {
    data: PlanetData
    get typeId(){return 'Planet'}

    constructor(planetData:PlanetData) {
        super(planetData)

        this.data.name = planetData.name || '[unknown]'
    }
}


export { Planet };
