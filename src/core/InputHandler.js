export default class InputHandler {
    constructor() {
        this.controls = {
            up: false,
            left: false,
            down: false,
            right: false
        };
    }

    // note: .bind(this) is used to bind the context of the function to the class instance. 
    // This is necessary because the functions are passed as event listeners and would otherwise lose the context of the class instance.
    setupListeners() {
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    removeListeners() {
        window.removeEventListener('keydown', this.handleKeyDown.bind(this));
        window.removeEventListener('keyup', this.handleKeyUp.bind(this));
    }

    handleKeyDown(e) {
        switch (e.key) {
            case "w":
            case "ArrowUp":
                this.controls.up = true;
                break;
            case "a":
            case "ArrowLeft":
                this.controls.left = true;
                break;
            case "s":
            case "ArrowDown":
                this.controls.down = true;
                break;
            case "d":
            case "ArrowRight":
                this.controls.right = true;
                break;
        }
    }

    handleKeyUp(e) {
        switch (e.key) {
            case "w":
            case "ArrowUp":
                this.controls.up = false;
                break;
            case "a":
            case "ArrowLeft":
                this.controls.left = false;
                break;
            case "s":
            case "ArrowDown":
                this.controls.down = false;
                break;
            case "d":
            case "ArrowRight":
                this.controls.right = false;
                break;
        }
    }

    getControls() {
        return this.controls;
    }
}