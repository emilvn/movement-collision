export default class Character {
  id;
  element;
  height;
  width;
  x;
  y;
  speed;
  maxHealth = 1000;
  health = 1000;
  enemy = false;

  constructor(id, width, height, startX, startY, speed, health, isEnemy) {
    this.id = id;
    this.width = width;
    this.height = height;
    this.x = startX;
    this.y = startY;
    this.speed = speed;
    this.enemy = isEnemy;
    this.maxHealth = health;
    this.health = health;
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
