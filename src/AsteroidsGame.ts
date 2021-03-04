import { World, Thing } from "./_fake-module"
import { SpaceShip } from './thing-types/SpaceShip';
import { Rock } from './thing-types/Rock';
import KeyWatcher from './KeyWatcher'



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
            game.world.ticksPerSecond = game.world.ticksPerSecond ? 0 : game.gameSpeed
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
    player: SpaceShip
    gameSpeed: number
    levels: Thing[][]

    constructor(world: World, levels: Thing[][], gameCanvas: HTMLCanvasElement, gameSpeed: number) {
        this.world = world
        this.gameSpeed = gameSpeed
        this.levels = levels
        this.score = 0
        this.lives = 3
        this.level = 0

        this.resetGame = this.resetGame.bind(this)
        this.resetLevel = this.resetLevel.bind(this)
        this.handleRockHit = this.handleRockHit.bind(this)
        this.handleShipDeath = this.handleShipDeath.bind(this)

        this.world.viewPort.setCanvas(gameCanvas)
        this.world.ticksPerSecond = gameSpeed
        this.world.emitter.on('shipDeath', this.handleShipDeath)
        this.world.emitter.on('rockHit', this.handleRockHit)

        watchKeys(this)
        this.resetLevel(0)
        this.updateInfo()
    }

    updateInfo() {
        const scoreElement = document.getElementById('score')
        if (scoreElement) { scoreElement.innerText = this.score.toString() }
        const livesElement = document.getElementById('lives')
        if (livesElement) { livesElement.innerText = this.lives.toString() }
        const levelElement = document.getElementById('level')
        if (levelElement) { levelElement.innerText = this.level.toString() }
    }

    resetGame() {
        this.score = 0
        this.lives = 3
        this.resetLevel(0)
        this.updateInfo()
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
                this.resetLevel(this.level)
                this.updateInfo()
            } else {
                setTimeout(this.resetGame, 2000)
            }
        }
    }

}



export { AsteroidsGame }