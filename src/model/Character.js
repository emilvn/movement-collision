export default class Character {
  static idCounter = 0;
  static levels = {
    1: { width: 32, height: 40, damage: 5, health: 50, speed: 30 },
    2: { width: 48, height: 60, damage: 10, health: 100, speed: 25 },
    3: { width: 64, height: 80, damage: 20, health: 200, speed: 20 },
    4: { width: 80, height: 100, damage: 40, health: 400, speed: 15 },
    5: { width: 96, height: 120, damage: 80, health: 800, speed: 10 },
    6: { width: 128, height: 160, damage: 160, health: 1600, speed: 5 },
  };
  static maxLevel = Object.keys(Character.levels).length;

  level = 1;
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
    this.level = options?.level ?? this.level;
    if (this.level < 1 || this.level > Character.maxLevel) {
      this.level = 1;
    }
    this.id = options?.id ?? "character" + this.idCounter;
    this.width = options?.width ?? Character.levels[this.level].width;

    this.width = options?.width ?? Character.levels[this.level].width;
    this.height = options?.height ?? Character.levels[this.level].height;
    this.speed = options?.speed ?? Character.levels[this.level].speed;
    this.maxHealth = options?.health ?? Character.levels[this.level].health;
    this.health = options?.health ?? Character.levels[this.level].health;
    this.damage = options?.damage ?? Character.levels[this.level].damage;

    this.x = options?.x ?? this.x;
    this.y = options?.y ?? this.y;
    this.enemy = options?.enemy ?? this.enemy;
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
      this.levelDown();
      return true;
    }
    return false;
  }

  heal(heal) {
    this.health += heal;
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }
  }

  levelUp() {
    if (this.level === Character.maxLevel) {
      this.heal(this.maxHealth);
      return;
    }
    this.level++;
    this.width = Character.levels[this.level].width;
    this.height = Character.levels[this.level].height;
    this.maxHealth = Character.levels[this.level].health;
    this.health = this.maxHealth;
    this.speed = Character.levels[this.level].speed;
    this.damage = Character.levels[this.level].damage;
  }

  levelDown() {
    if (this.level === 1) {
      this.alive = false;
      return;
    }
    this.levelDownProtectionOn();
    this.alive = true;
    this.maxHealth = Number.POSITIVE_INFINITY;
    this.level--;
    this.width = Character.levels[this.level].width;
    this.height = Character.levels[this.level].height;
    this.speed = Character.levels[this.level].speed;
    setTimeout(() => {
      this.levelDownProtectionOff();
    }, 2000);
  }

  levelDownProtectionOn() {
    this.maxHealth = Number.POSITIVE_INFINITY;
    this.health = Number.POSITIVE_INFINITY;
    this.damage = 0;
  }

  levelDownProtectionOff() {
    this.maxHealth = Character.levels[this.level].health;
    this.health = this.maxHealth;
    this.damage = Character.levels[this.level].damage;
  }
}
