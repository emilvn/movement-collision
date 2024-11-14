import Board from "./model/Board.js";
import Character from "./model/Character.js";
import Enemy from "./model/Enemy.js";
import * as view from "./view.js";

window.addEventListener("load", start);

let prevTime = 0;
let accumulator = 0;

const board = new Board(window.innerWidth - 100, window.innerHeight - 100);

const player = new Character("player", 64, 80, 0, 0, 10, 1000, false);
const enemy1 = new Enemy("enemy1", 128, 160, 200, 50, 5, 100);
const enemy2 = new Enemy("enemy2", 32, 40, 400, 100, 20, 100);
const enemy3 = new Enemy("enemy3", 32, 40, 800, 150, 30, 100);
const enemy4 = new Enemy("enemy4", 128, 160, 1000, 50, 5, 100);
const enemy5 = new Enemy("enemy5", 64, 80, 1000, 200, 10, 100);
const enemy6 = new Enemy("enemy6", 64, 80, 1000, 200, 10, 100);
const enemy7 = new Enemy("enemy7", 64, 80, 1000, 200, 10, 100);
const enemies = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6, enemy7];

const controls = {
  up: false,
  left: false,
  down: false,
  right: false,
};

function start() {
  view.init(board, [player, ...enemies]);
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "w":
      case "ArrowUp":
        controls.up = true;
        break;
      case "a":
      case "ArrowLeft":
        controls.left = true;
        break;
      case "s":
      case "ArrowDown":
        controls.down = true;
        break;
      case "d":
      case "ArrowRight":
        controls.right = true;
        break;
    }
  });
  window.addEventListener("keyup", (e) => {
    switch (e.key) {
      case "w":
      case "ArrowUp":
        controls.up = false;
        break;
      case "a":
      case "ArrowLeft":
        controls.left = false;
        break;
      case "s":
      case "ArrowDown":
        controls.down = false;
        break;
      case "d":
      case "ArrowRight":
        controls.right = false;
        break;
    }
  });
  tick();
}

function tick(time) {
  requestAnimationFrame(tick);
  const deltaT = (time - prevTime) / 1000;
  prevTime = time;
  if (!isNaN(deltaT)) {
    accumulator += deltaT;
  }
  player.move(deltaT, controls, board);
  let playerCollided = false;
  enemies.forEach((enemy) => {
    // Randomize enemy controls every 500ms
    if (accumulator > Math.random() * 500) {
      enemy.randomizeControls();
      accumulator = 0;
    }

    if (!enemy.alive) return;

    enemy.move(deltaT, board);

    if (handleCollision(player, enemy)) {
      view.addCollisionAnimation(enemy);
      playerCollided = true;
    } else {
      view.removeCollisionAnimation(enemy);
    }

    view.displayCharacter(enemy, enemy.controls);
  });

  if (playerCollided) {
    view.addCollisionAnimation(player);
  } else {
    view.removeCollisionAnimation(player);
  }

  view.displayCharacter(player, controls);
}

function handleCollision(c1, c2) {
  if (collision(c1, c2)) {
    c1.takeDamage(c2.damage);
    c2.takeDamage(c1.damage);

    if (!c1.alive) {
      c2.heal(10);
    } else if (!c2.alive) {
      c1.heal(10);
    }
    return true;
  }
  return false;
}

function collision(c1, c2) {
  return (
    c1.x < c2.x + c2.width &&
    c1.x + c1.width > c2.x &&
    c1.y < c2.y + c2.height &&
    c1.y + c1.height > c2.y
  );
}
