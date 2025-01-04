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

  /**
   * @param {"N" |"NE" | "E" | "SE" | "S" | "SW" | "W" | "NW"} dir
   */
  changeDirection(dir) {
    this.controls = {
      up: dir.includes("N"),
      down: dir.includes("S"),
      left: dir.includes("W"),
      right: dir.includes("E"),
    };
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

  /**
   *
   * @param {number} deltaT difference in time since last tick in seconds
   * @param {CollisionSystem} collisionSystem
   * @param {Character} player
   * @param {{row: number, col: number}[]} path list of cells to move through
   */
  move(deltaT, collisionSystem, player, path) {
    if (path && path.length > 1) {
      this.followPath(collisionSystem, path);
    } else if (path && path.length === 1) {
      this.chasePlayer(player);
    }
    this.updatePosition(deltaT, collisionSystem);
  }

  followPath(collisionSystem, path) {
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
          this.changeDirection("E");
        } else {
          // move left
          this.changeDirection("W");
        }
      } else if (nextCoord.row > currentCoord.row) {
        // move down
        this.changeDirection("S");
      } else {
        // move up
        this.changeDirection("N");
      }
    }
  }

  chasePlayer(player) {
    const playerReg = {
      x: player.x + player.regX,
      y: player.y + player.regY,
    };

    const enemyReg = {
      x: this.x + this.regX,
      y: this.y + this.regY,
    };

    const dx = playerReg.x - enemyReg.x;
    const dy = playerReg.y - enemyReg.y;
    let dirs = "";
    if (dy > 0) {
      dirs += "S";
    } else if (dy < 0) {
      dirs += "N";
    }
    if (dx > 0) {
      dirs += "E";
    } else if (dx < 0) {
      dirs += "W";
    }
    this.changeDirection(dirs);
  }

  updatePosition(deltaT, collisionSystem) {
    const newPos = this.getNewPos(deltaT, this.controls);

    if (collisionSystem.validateMovement(this, newPos)) {
      this.x = newPos.x;
      this.y = newPos.y;
    } else {
      this.randomizeControls();
    }
  }
}
