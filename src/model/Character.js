export default class Character {
  static ID_COUNTER = 0;
  static BASE_SPEED = 20;
  static BASE_HEALTH = 100;
  static BASE_DAMAGE = 5;
  static BASE_WIDTH = 32;
  static BASE_HEIGHT = 40;

  level = 1;
  element = null;
  height = 40;
  width = 32;
  x = 16;
  y = 28;
  regX = 16;
  regY = 28;
  speed = 200;
  maxHealth = 100;
  health = 100;
  enemy = false;
  alive = true;
  damage = 5;

  hitbox = {
    x: 8,
    y: 12,
    w: 20,
    h: 30,
  };

  constructor(options) {
    this.level = options?.level ?? this.level;
    if (this.level < 1) {
      this.level = 1;
    }
    this.id = options?.id ?? "character" + this.idCounter;
    this.speed = options?.speed ?? this.speed;
    this.x = options?.x ?? this.x;
    this.y = options?.y ?? this.y;
    this.enemy = options?.enemy ?? this.enemy;
    this.setStatsFromLevel(this.level);

    Character.ID_COUNTER++;
  }

  setStatsFromLevel(level) {
    this.level = level;
    this.width = Character.BASE_WIDTH * 1.1 ** (level - 1);
    this.height = Character.BASE_HEIGHT * 1.1 ** (level - 1);
    this.maxHealth = Character.BASE_HEALTH * 1 * 1.1 ** (level - 1);
    this.health = this.maxHealth;
    this.damage = Character.BASE_DAMAGE * 1 * 1.1 ** (level - 1);
  }

  getNewPos(deltaT, controls) {
    const newPos = { x: this.x, y: this.y };

    if (controls.up && controls.right) {
      newPos.y -= (this.speed / 2) * deltaT;
      newPos.x += (this.speed / 2) * deltaT;
    } else if (controls.up && controls.left) {
      newPos.y -= (this.speed / 2) * deltaT;
      newPos.x -= (this.speed / 2) * deltaT;
    } else if (controls.down && controls.right) {
      newPos.y += (this.speed / 2) * deltaT;
      newPos.x += (this.speed / 2) * deltaT;
    } else if (controls.down && controls.left) {
      newPos.y += (this.speed / 2) * deltaT;
      newPos.x -= (this.speed / 2) * deltaT;
    } else {
      if (controls.up) {
        newPos.y -= this.speed * deltaT;
      }
      if (controls.down) {
        newPos.y += this.speed * deltaT;
      }
      if (controls.left) {
        newPos.x -= this.speed * deltaT;
      }
      if (controls.right) {
        newPos.x += this.speed * deltaT;
      }
    }
    return newPos;
  }

  move(deltaT, controls, board) {
    if (!this.alive) return;
    const newPos = this.getNewPos(deltaT, controls);

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
    this.setStatsFromLevel(++this.level);

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
    while (!board.validateMovement(this, this)) {
      this.levelDown(false);
    }
  }

  levelDown(withProtection = true) {
    if (this.level === 1) {
      this.alive = false;
      return;
    }
    this.alive = true;
    this.level--;
    this.setStatsFromLevel(this.level);

    if (withProtection) {
      this.levelDownProtectionOn();
      setTimeout(() => {
        this.levelDownProtectionOff();
      }, 2000);
    }
  }

  levelDownProtectionOn() {
    this.maxHealth = Number.POSITIVE_INFINITY;
    this.health = Number.POSITIVE_INFINITY;
    this.damage = 0;
  }

  levelDownProtectionOff() {
    this.setStatsFromLevel(this.level);
  }
}
