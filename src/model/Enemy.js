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
    if (!(up || left || down || right)) {
      this.randomizeControls();
      return;
    }
    this.controls = {
      up,
      left,
      down,
      right,
    };
  }

  move(deltaT, board) {
    const newPos = this.getNewPos(deltaT, this.controls);

    if (board.validateMovement(this, newPos)) {
      this.x = newPos.x;
      this.y = newPos.y;
    } else {
      this.randomizeControls();
    }
  }
}
