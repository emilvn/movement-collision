import Character from "./Character.js";

export default class Enemy extends Character {
  controls = {
    up: false,
    left: false,
    down: false,
    right: false,
  };
  constructor(id, width, height, startX, startY, speed, health) {
    super(id, width, height, startX, startY, speed, health, true);
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
