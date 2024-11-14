import Board from "./model/Board.js";
import Character from "./model/Character.js";
import Enemy from "./model/Enemy.js";
import * as view from "./view.js";

window.addEventListener("load", start);

let prevTime = 0;
let accumulator = 0;

const board = new Board(window.innerWidth - 100, window.innerHeight - 100);

const player = new Character({ id: "player" });
const enemy1 = new Enemy("small");
const enemy2 = new Enemy("medium");
const enemy3 = new Enemy("large");
const enemy4 = new Enemy("small");
const enemy5 = new Enemy("medium");
const enemy6 = new Enemy("large");
const enemy7 = new Enemy("small");
const enemies = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6, enemy7];

const controls = {
  up: false,
  left: false,
  down: false,
  right: false,
};

function start() {
  view.init(board, [player, ...enemies]);
  tick();
}

export function handleKeyDownInput(e) {
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
}

export function handleKeyUpInput(e) {
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
