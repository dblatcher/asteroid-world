import { World, Body, ViewPort, SoundPlayer, KeyWatcher } from "../../../worlds/src/index"
import { Galley } from './Galley';
import { Rock } from '../thing-types/Rock';


interface TriremeGameElements {
    main: HTMLElement
    score: HTMLElement
    lives: HTMLElement
    level: HTMLElement
    message?: HTMLElement
};

class TriremeGame {
    score: number
    lives: number
    level: number
    world: World
    mainScreen: ViewPort
    player: Galley
    gameSpeed: number
    levels: Body[][]
    elements: TriremeGameElements
    soundPlayer: SoundPlayer

    constructor(world: World, levels: Body[][], gameSpeed: number, gameCanvas: HTMLCanvasElement, elements: TriremeGameElements, soundPlayer: SoundPlayer = null) {
        this.world = world
        this.gameSpeed = gameSpeed
        this.levels = levels
        this.score = 0
        this.lives = -1
        this.level = 0
        this.soundPlayer = soundPlayer;

        this.resetGame = this.resetGame.bind(this)
        this.createMessageElement = this.createMessageElement.bind(this)
        this.resetLevel = this.resetLevel.bind(this)
        this.handleRockHit = this.handleRockHit.bind(this)
        this.handleShipDeath = this.handleShipDeath.bind(this)
        this.playSfx = this.playSfx.bind(this)

        //this.world.ticksPerSecond = gameSpeed
        this.world.emitter.on('shipDeath', this.handleShipDeath)
        this.world.emitter.on('rockHit', this.handleRockHit)

        this.mainScreen = ViewPort.full(world, gameCanvas, 2)

        this.elements = elements;

        const keyWatcher = new KeyWatcher(document.body)
        keyWatcher.startReportTimer(1000 / this.gameSpeed)
        keyWatcher.on('report', (keyCodes: string[]) => { this.respondToControls(keyCodes) })
        keyWatcher.on('keydown', (event: KeyboardEvent) => { this.respondToKeyDown(event) })

        this.mainScreen.renderCanvas();
        this.createMessageElement(['TRIREME'], true)

        this.resetLevel(0)
        this.updateInfo()

        if (this.soundPlayer) {
            this.world.emitter.on('SFX', this.playSfx)
        }

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

        const galley = this.world.bodies.filter(thing => thing.typeId == "Galley")[0] as Galley
        this.player = galley
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
            if (keyCodes.includes('ArrowLeft')) { player.steer("LEFT") }
            if (keyCodes.includes('ArrowRight')) { player.steer("RIGHT") }
            if (keyCodes.includes('ArrowUp')) { player.changeThrottle(player.data.maxThrust * .05) } else { player.changeThrottle(-player.data.maxThrust * .1) }
        }
    }

    handleRockHit(rock: Rock) {
        this.score += Math.max(100, 210 - Math.floor(rock.data.size))
        this.updateInfo()

        const allRocksGone = this.world.bodies
            .filter(thing => thing.typeId === 'Rock')
            .filter(thing => !this.world.bodiesLeavingAtNextTick.includes(thing))
            .length === 0

        if (allRocksGone) {
            setTimeout(() => {
                this.level = Math.min(this.levels.length - 1, this.level + 1)
                this.updateInfo()
                this.resetLevel(this.level)
            }, 2000)
        }
    }

    handleShipDeath(galley: Galley) {
        if (galley == this.player) {
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

    playSfx(payload: any) {
        this.soundPlayer.play(payload.soundName, payload.config || {});
    }

}



export { TriremeGame }