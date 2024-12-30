import CollisionSystem from "../core/CollisionSystem.js";
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
    // TODO: Comment in again
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

  // TODO: moveTo metode som tager imod en celle koordinat og bevæger fjenden derover

  /**
   *
   * @param {number} deltaT difference in time since last tick in seconds
   * @param {CollisionSystem} collisionSystem
   * @param {{row: number, col: number}[]} path list of cells to move through
   */
  move(deltaT, collisionSystem, path) {
    if (path && path.length > 1) {
      // path[0] is always the coords of the cell the enemy is currently located in.
      // we want the enemy to move towards the next cell in the path, hence path[1]
      const nextCoord = path[1];
      const currentCoord = collisionSystem.board.getCoordFromPos(this);
      const coordsUnderCharacter =
        collisionSystem.board.getTileCoordsFromCharacter(this);

      if (
        coordsUnderCharacter.every(
          (coord) =>
            coord.row === coordsUnderCharacter[0].row &&
            coord.col === coordsUnderCharacter[0].col
        )
      ) {
        if (nextCoord.row === currentCoord.row) {
          if (nextCoord.col > currentCoord.col) {
            // move right
            this.controls = {
              up: false,
              down: false,
              left: false,
              right: true,
            };
          } else {
            // move left
            this.controls = {
              up: false,
              down: false,
              left: true,
              right: false,
            };
          }
        } else if (nextCoord.row > currentCoord.row) {
          // move down
          this.controls = {
            up: false,
            down: true,
            left: false,
            right: false,
          };
        } else {
          // move up
          this.controls = {
            up: true,
            down: false,
            left: false,
            right: false,
          };
        }
      }
    }
    const newPos = this.getNewPos(deltaT, this.controls);

    if (collisionSystem.validateMovement(this, newPos)) {
      this.x = newPos.x;
      this.y = newPos.y;
    }
  }
}
