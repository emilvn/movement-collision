export default class Character {
  static idCounter = 0;
  element = null;
  height = 40;
  width = 32;
  x = 0;
  y = 0;
  speed = 20;
  maxHealth = 100;
  health = 100;
  enemy = false;
  alive = true;
  damage = 1;

  constructor(options) {
    this.id = options.id ?? "character" + this.idCounter;
    this.width = options.width ?? this.width;
    this.height = options.height ?? this.height;
    this.x = options.x ?? this.x;
    this.y = options.y ?? this.y;
    this.speed = options.speed ?? this.speed;
    this.enemy = options.enemy ?? this.enemy;
    this.maxHealth = options.health ?? this.health;
    this.health = options.health ?? this.health;
  }

  move(deltaT, controls, board) {
    if (!this.alive) return;
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

  takeDamage(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      this.alive = false;
    }
  }

  heal(heal) {
    this.health += heal;
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }
  }
}
