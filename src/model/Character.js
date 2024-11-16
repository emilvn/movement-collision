export default class Character {
  static ID_COUNTER = 0;
  static LEVELS = {
    1: { width: 32, height: 40, damage: 5, health: 50 },
    2: { width: 48, height: 60, damage: 10, health: 100 },
    3: { width: 64, height: 80, damage: 20, health: 200 },
    4: { width: 80, height: 100, damage: 40, health: 400 },
    5: { width: 96, height: 120, damage: 80, health: 800 },
    6: { width: 128, height: 160, damage: 160, health: 1600 },
  };
  static MAX_LEVEL = Object.keys(Character.LEVELS).length;

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
    if (this.level < 1 || this.level > Character.MAX_LEVEL) {
      this.level = 1;
    }
    this.id = options?.id ?? "character" + this.idCounter;
    this.width = options?.width ?? Character.LEVELS[this.level].width;

    this.width = options?.width ?? Character.LEVELS[this.level].width;
    this.height = options?.height ?? Character.LEVELS[this.level].height;
    this.speed = options?.speed ?? this.speed;
    this.maxHealth = options?.health ?? Character.LEVELS[this.level].health;
    this.health = options?.health ?? Character.LEVELS[this.level].health;
    this.damage = options?.damage ?? Character.LEVELS[this.level].damage;

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

  levelUp(board) {
    if (this.level === Character.MAX_LEVEL) {
      this.heal(this.maxHealth);
      return;
    }
    this.level++;
    this.width = Character.LEVELS[this.level].width;
    this.height = Character.LEVELS[this.level].height;
    this.maxHealth = Character.LEVELS[this.level].health;
    this.health = this.maxHealth;
    this.damage = Character.LEVELS[this.level].damage;

    if (this.x + this.width > board.width) {
      this.x = board.width - (this.width + 1);
    }
    if (this.y + this.height > board.height) {
      this.y = board.height - (this.height + 1);
    }
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.y < 0) {
      this.y = 0;
    }
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
    this.width = Character.LEVELS[this.level].width;
    this.height = Character.LEVELS[this.level].height;
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
    this.maxHealth = Character.LEVELS[this.level].health;
    this.health = this.maxHealth;
    this.damage = Character.LEVELS[this.level].damage;
  }
}
