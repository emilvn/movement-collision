import Character from "./Character.js";

export default class Enemy extends Character {
  static ID_COUNTER = 1;
  controls = {
    up: false,
    left: false,
    down: false,
    right: false,
  };
  constructor(options) {
    super({
      id: "enemy" + Enemy.ID_COUNTER,
      ...options,
      enemy: true,
    });
    Enemy.ID_COUNTER++;
    this.randomizeControls();
  }

  // randomizes enemy controls/movement
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

  // moves the enemy on the board
  move(deltaT, collisionSystem) {
    const newPos = this.getNewPos(deltaT, this.controls);

    if (collisionSystem.validateMovement(this, newPos)) {
        this.x = newPos.x;
        this.y = newPos.y;
    } else {
        this.randomizeControls();
    }
}
}
