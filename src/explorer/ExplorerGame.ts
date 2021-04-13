import { World, Body, ViewPort, RenderFunctions, CameraFollowInstruction, Area } from "../../../worlds/src/index"
import { ExplorerShip } from '../thing-types/ExplorerShip';
import { Rock } from '../thing-types/Rock';
import KeyWatcher from '../KeyWatcher'
import { RenderTransformationRule } from "../../../worlds/src/ViewPort";


interface ExplorerGameElements {
    main: HTMLElement
    score: HTMLElement
    lives: HTMLElement
    level: HTMLElement
    message?: HTMLElement
};

class ExplorerGame {
    score: number
    lives: number
    level: number
    world: World
    mainScreen: ViewPort
    miniMap?: ViewPort
    player: ExplorerShip
    gameSpeed: number
    levels: Array<Body|Area>[]
    elements: ExplorerGameElements

    constructor(world: World, levels: Array<Body|Area>[], gameSpeed: number, gameCanvas: HTMLCanvasElement, miniMapCanvas: HTMLCanvasElement, elements: ExplorerGameElements) {
        this.world = world
        this.gameSpeed = gameSpeed
        this.levels = levels
        this.score = 0
        this.lives = -1
        this.level = 0

        this.resetGame = this.resetGame.bind(this)
        this.createMessageElement = this.createMessageElement.bind(this)
        this.resetLevel = this.resetLevel.bind(this)
        this.handleRockHit = this.handleRockHit.bind(this)
        this.handleShipDeath = this.handleShipDeath.bind(this)

        //this.world.ticksPerSecond = gameSpeed
        this.world.emitter.on('shipDeath', this.handleShipDeath)
        this.world.emitter.on('rockHit', this.handleRockHit)

        this.mainScreen = new ViewPort({ world, canvas: gameCanvas, x: 100, y: 100, width: 1000, height: 1000 })

        

        this.miniMap = miniMapCanvas
            ? ViewPort.fitToSize(world, miniMapCanvas, 150, 200)
            : null

        this.elements = elements;

        const keyWatcher = new KeyWatcher(document.body)
        keyWatcher.startReportTimer(1000 / this.gameSpeed)
        keyWatcher.on('report', (keyCodes: string[]) => { this.respondToControls(keyCodes) })
        keyWatcher.on('keydown', (event: KeyboardEvent) => { this.respondToKeyDown(event) })

        this.mainScreen.renderCanvas();
        if (this.miniMap) {
            this.miniMap.dontRenderBackground = true
            this.miniMap.dontRenderEffects = true

            this.miniMap.transformRules.push(new RenderTransformationRule(
                thing => thing.typeId === 'ExplorerShip',
                (thing, ctx, viewPort) => {
                    const duplicate = thing.duplicate()
                    duplicate.data.size = viewPort.visibleLineWidth * 200
                    duplicate.renderOnCanvas(ctx, viewPort)
                }
            ))


            this.miniMap.renderCanvas();
        }
        
        // this.createMessageElement(['hello and welcome to', 'Explorer'], true)
        // this.resetLevel(0)
        // this.updateInfo()

        this.resetGame()

        this.elements.main.classList.remove('hidden')
    }

    get isActive() {
        return !this.elements.message && !!this.player && this.world.bodies.includes(this.player)
    }

    updateInfo() {
        const { score, lives, level } = this.elements
        if (score) { score.innerText = this.score.toString() }
        if (lives) { lives.innerText = this.lives.toString() }
        if (level) { level.innerText = this.level.toString() }
    }

    togglePause() {
        if (this.lives < 0) { return }

        if (this.world.ticksPerSecond) {
            this.createMessageElement(['paused'])
            this.world.ticksPerSecond = 0
        } else {
            this.removeMessageElement()
            this.world.ticksPerSecond = this.gameSpeed
        }
    }

    resetGame() {
        this.removeMessageElement()
        this.world.ticksPerSecond = this.gameSpeed
        this.score = 0
        this.lives = 3
        this.resetLevel(0)
        this.updateInfo()
    }

    createMessageElement(text: string[], includeResetButton: boolean = false) {

        if (this.elements.message) { this.removeMessageElement() }

        const message = document.createElement('article')
        message.classList.add("message")

        function addParagraph(textLine: string) {
            const pargraph = document.createElement('p')
            pargraph.innerText = textLine
            message.appendChild(pargraph)
        }
        text.forEach(line => addParagraph(line))

        if (includeResetButton) {
            const resetButton = document.createElement('button')
            resetButton.innerText = 'new game'
            resetButton.addEventListener('click', this.resetGame)
            message.appendChild(resetButton)
        }

        this.elements.message = message
        this.elements.main.appendChild(message)
        return message
    }

    removeMessageElement() {
        if (!this.elements.message) { return }
        this.elements.main.removeChild(this.elements.message)
        this.elements.message = null
    }

    resetLevel(level: number) {
        this.world.bodies.splice(0, this.world.bodies.length)

        this.levels[level].forEach(thing => {
            thing.duplicate().enterWorld(this.world)
        })

        const ExplorerShip = this.world.bodies.filter(thing => thing.typeId == "ExplorerShip")[0] as ExplorerShip
        this.player = ExplorerShip

        this.mainScreen.cameraInstruction = new CameraFollowInstruction({body:ExplorerShip, followHeading:true, magnify:.75, leadDistance:300})
    }

    respondToKeyDown(event: KeyboardEvent) {
        switch (event.code) {
            case 'KeyP':
                this.togglePause()
                break;
            case 'KeyR':
                this.resetGame()
                break;
        }
    }

    respondToControls(keyCodes: string[]) {
        const { player, isActive } = this
        if (isActive) {
            if (keyCodes.includes('Space')) { player.shoot() }
            if (keyCodes.includes('KeyZ')) { player.blastOff() }
            if (keyCodes.includes('ArrowLeft')) { player.data.heading += .1 }
            if (keyCodes.includes('ArrowRight')) { player.data.heading -= .1 }
            if (keyCodes.includes('ArrowUp')) { player.changeThrottle(player.data.maxThrust * .02) } else { player.changeThrottle(-player.data.maxThrust * .1) }
        }
    }

    handleRockHit(rock: Rock) {
        this.score += Math.max(100, 210 - Math.floor(rock.data.size))
        this.updateInfo()

        const allRocksGone = this.world.bodies
            .filter(thing => thing.typeId === 'Rock')
            .filter(thing => !this.world.bodiesLeavingAtNextTick.includes(thing))
            .length === 0

    }

    handleShipDeath(ExplorerShip: ExplorerShip) {
        if (ExplorerShip == this.player) {
            this.lives--

            if (this.lives >= 0) {
                setTimeout(() => {
                    this.resetLevel(this.level)
                    this.updateInfo()
                }, 1500)
            } else {
                setTimeout(() => {
                    this.createMessageElement(['GAME OVER'], true)
                }, 1500)
            }
        }
    }

}



export { ExplorerGame }