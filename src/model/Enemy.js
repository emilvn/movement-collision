import Character from "./Character.js";

export default class Enemy extends Character {
  static idCounter = 1;
  controls = {
    up: false,
    left: false,
    down: false,
    right: false,
  };
  constructor(options) {
    super({
      id: "enemy" + Enemy.idCounter,
      x: Math.random() * 800,
      y: Math.random() * 600,
      ...options,
      enemy: true,
    });
    Enemy.idCounter++;
    this.randomizeControls();
  }

  randomizeControls() {
    const up = Math.random() > 0.5;
    const left = Math.random() > 0.5;
    const down = Math.random() > 0.5 && !up;
    const right = Math.random() > 0.5 && !left;
    this.controls = {
      up,
      left,
      down,
      right,
    };
  }

  move(deltaT, board) {
    const newPos = { x: this.x, y: this.y };

    if (this.controls.up) {
      newPos.y -= 20 * this.speed * deltaT;
    }
    if (this.controls.down) {
      newPos.y += 20 * this.speed * deltaT;
    }
    if (this.controls.left) {
      newPos.x -= 32 * this.speed * deltaT;
    }
    if (this.controls.right) {
      newPos.x += 32 * this.speed * deltaT;
    }

    if (board.validateMovement(this, newPos)) {
      this.x = newPos.x;
      this.y = newPos.y;
    } else {
      this.randomizeControls();
    }
  }
}
