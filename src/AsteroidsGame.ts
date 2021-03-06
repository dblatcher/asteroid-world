import { World, Thing } from "./_fake-module"
import { SpaceShip } from './thing-types/SpaceShip';
import { Rock } from './thing-types/Rock';
import KeyWatcher from './KeyWatcher'
import { ViewPort } from "../../worlds/src";



function watchKeys(game: AsteroidsGame) {
    const keyWatcher = new KeyWatcher(document.body)

    keyWatcher.startReportTimer(1000 / game.gameSpeed)
    keyWatcher.on('report', (keyCodes: string[]) => {
        if (game.world.ticksPerSecond) {
            if (keyCodes.includes('ArrowLeft')) { game.player.data.heading += .1 }
            if (keyCodes.includes('ArrowRight')) { game.player.data.heading -= .1 }
            if (keyCodes.includes('ArrowUp')) { game.player.changeThrottle(game.player.data.maxThrust * .02) } else { game.player.changeThrottle(-game.player.data.maxThrust * .1) }
        }
    })

    keyWatcher.on('keydown', (event: KeyboardEvent) => {
        const { code } = event
        if (game.world.ticksPerSecond) {
            if (code == 'Space') { game.player.shoot() }
        }
        if (code == 'KeyP') {
            game.togglePause()
        }
        if (code == 'KeyR') {
            game.resetGame()
        }
    })
}


class AsteroidsGame {
    score: number
    lives: number
    level: number
    world: World
    mainScreen: ViewPort
    miniMap?: ViewPort
    player: SpaceShip
    gameSpeed: number
    levels: Thing[][]
    elements: {
        main: HTMLElement
        score: HTMLElement
        lives: HTMLElement
        level: HTMLElement
        message: HTMLElement
    }

    constructor(world: World, levels: Thing[][], gameSpeed: number, gameCanvas: HTMLCanvasElement, miniMapCanvas: HTMLCanvasElement,) {
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

        this.mainScreen = ViewPort.full(world, gameCanvas, 1.2)
        this.miniMap = miniMapCanvas
            ? ViewPort.fitToSize(world, miniMapCanvas, 150, 200)
            : null

        this.elements = {
            main: document.querySelector('main'),
            score: document.getElementById('score'),
            lives: document.getElementById('lives'),
            level: document.getElementById('level'),
            message: null,
        }

        this.createMessageElement(['hello and welcome to', 'asteroid world'], true)

        watchKeys(this)
        this.resetLevel(0)
        this.updateInfo()

        this.elements.main.classList.remove('hidden')
    }

    updateInfo() {
        const { score, lives, level } = this.elements
        if (score) { score.innerText = this.score.toString() }
        if (lives) { lives.innerText = this.lives.toString() }
        if (level) { level.innerText = this.level.toString() }
    }

    togglePause() {

        if (this.lives < 0 ) {return}

        if (this.world.ticksPerSecond) {
            this.createMessageElement(['paused'])
            this.world.ticksPerSecond =  0 
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
        this.world.things.splice(0, this.world.things.length)

        this.levels[level].forEach(thing => {
            thing.duplicate().enterWorld(this.world)
        })

        const spaceShip = this.world.things.filter(thing => thing.typeId == "SpaceShip")[0] as SpaceShip
        this.player = spaceShip
    }


    handleRockHit(rock: Rock) {
        this.score += Math.max(100, 210 - Math.floor(rock.data.size))
        this.updateInfo()

        const allRocksGone = this.world.things
            .filter(thing => thing.typeId === 'Rock')
            .filter(thing => !this.world.thingsLeavingAtNextTick.includes(thing))
            .length === 0

        if (allRocksGone) {
            setTimeout(() => {
                this.level = Math.min(this.levels.length - 1, this.level + 1)
                this.updateInfo()
                this.resetLevel(this.level)
            }, 2000)
        }
    }

    handleShipDeath(spaceship: SpaceShip) {
        if (spaceship == this.player) {
            this.lives--

            if (this.lives >= 0) {
                setTimeout(() => {
                    this.resetLevel(this.level)
                    this.updateInfo()
                }, 1500)
            } else {
                setTimeout(() => { 
                    this.createMessageElement(['GAME OVER'],true) 
                }, 1500)
            }
        }
    }

}



export { AsteroidsGame }