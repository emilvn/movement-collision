export default class Character {
  static ID_COUNTER = 0;
  static BASE_SPEED = 100;
  static BASE_HEALTH = 10000;
  static BASE_DAMAGE = 5;
  static BASE_WIDTH = 32;
  static BASE_HEIGHT = 40;
  static BASE_REGX = 14;
  static BASE_REGY = 28;
  static BASE_HITBOX = {
    x: 6,
    y: 18,
    w: 20,
    h: 20,
  };
  element = null;
  height = Character.BASE_HEIGHT;
  width = Character.BASE_WIDTH;
  x = Character.BASE_REGX;
  y = Character.BASE_REGY;
  regX = Character.BASE_REGX;
  regY = Character.BASE_REGY;
  speed = Character.BASE_SPEED;
  maxHealth = Character.BASE_HEALTH;
  health = Character.BASE_HEALTH;
  enemy = false;
  alive = true;
  damage = Character.BASE_DAMAGE;

  hitbox = Character.BASE_HITBOX;

  constructor(options) {
    this.id = options?.id ?? "character" + Character.ID_COUNTER;
    this.speed = options?.speed ?? Character.BASE_SPEED;
    this.enemy = options?.enemy ?? false;
    this.height = options?.height ?? Character.BASE_HEIGHT;
    this.width = options?.width ?? Character.BASE_WIDTH;
    this.x = options?.x ?? Character.BASE_REGX;
    this.y = options?.y ?? Character.BASE_REGY;
    this.regX = options?.regX ?? Character.BASE_REGX;
    this.regY = options?.regY ?? Character.BASE_REGY;
    this.maxHealth = options?.maxHealth ?? Character.BASE_HEALTH;
    this.health = options?.health ?? Character.BASE_HEALTH;
    this.damage = options?.damage ?? Character.BASE_DAMAGE;
    this.hitbox = options?.hitbox ?? Character.BASE_HITBOX;

    Character.ID_COUNTER++;
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
      this.alive = false;
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

  collidedWith(character) {
    return (
      this.x + this.hitbox.x <
        character.x + character.hitbox.x + character.hitbox.w &&
      this.x + this.hitbox.x + this.hitbox.w >
        character.x + character.hitbox.x &&
      this.y + this.hitbox.y <
        character.y + character.hitbox.y + character.hitbox.h &&
      this.y + this.hitbox.y + this.hitbox.h > character.y + character.hitbox.y
    );
  }
}
