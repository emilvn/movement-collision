export default class Character {
  id;
  element;
  height;
  width;
  x;
  y;
  speed;
  movementCycle = 0;
  health = 100;
  enemy = false;

  constructor(id, width, height, startX, startY, speed, isEnemy) {
    this.id = id;
    this.width = width;
    this.height = height;
    this.x = startX;
    this.y = startY;
    this.speed = speed;
    this.enemy = isEnemy;
  }

  cycleMovement() {
    if (this.movementCycle === 3) {
      this.movementCycle = 0;
    } else {
      this.movementCycle++;
    }
  }

  move(deltaT, controls, board) {
    const newPos = { x: this.x, y: this.y };

    if (controls.up) {
      newPos.y -= 20 * this.speed * deltaT;
    }
    if (controls.down) {
      newPos.y += 20 * this.speed * deltaT;
    }
    if (controls.left) {
      newPos.x -= 32 * this.speed * deltaT;
    }
    if (controls.right) {
      newPos.x += 32 * this.speed * deltaT;
    }

    if (board.validateMovement(this, newPos)) {
      this.x = newPos.x;
      this.y = newPos.y;
    }
  }
}
