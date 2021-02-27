import { TinyEmitter } from 'tiny-emitter';



class KeyWatcher extends TinyEmitter {
    _target: HTMLElement
    keysPressed: string[]

    constructor(target:HTMLElement) {
        super()
        this.emitKeyDown = this.emitKeyDown.bind(this)
        this.emitKeyUp = this.emitKeyUp.bind(this)
        this._target = target
        this.keysPressed = []
        target.addEventListener('keydown', this.emitKeyDown) 
        target.addEventListener('keyup', this.emitKeyUp) 
    }

    emitKeyDown(event:KeyboardEvent) {
        if (!this.keysPressed.includes(event.code)) {
            this.keysPressed.push(event.code)
        }
        this.emit('keydown', event)
    }
    emitKeyUp(event:KeyboardEvent) {
        if (this.keysPressed.includes(event.code)) {
            this.keysPressed.splice(this.keysPressed.indexOf(event.code),1)
        }
        this.emit('keyUp', event)
    }
}

export default KeyWatcher