import { map1 } from "./maps.js";
import Board from "./model/Board.js";
import Enemy from "./model/Enemy.js";
import Player from "./model/Player.js";
import * as view from "./view.js";

window.addEventListener("load", start);

let prevTime = 0;
let accumulator = 0;
let restart = false;

const board = new Board(768, 768, 64);
board.loadMap(map1);

let player = createPlayer();

let enemies = createEnemies(0, board);

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

function createPlayer() {
  return new Player({ level: 2 });
}

export function reset() {
  restart = true;
  player = createPlayer();
  enemies = createEnemies(5, board);
  view.init(board, [player, ...enemies]);
  setTimeout(() => {
    restart = false;
    tick();
  }, 100);
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
  if (!restart) requestAnimationFrame(tick);
  view.displayCharacter(player, controls, board);

  const deltaT = (time - prevTime) / 1000;
  prevTime = time;
  if (!isNaN(deltaT)) {
    accumulator += deltaT;
  }
  player.move(deltaT, controls, board);
  let playerCollided = false;
  enemies.forEach((enemy) => {
    view.displayCharacter(enemy, enemy.controls, board);
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
    }
    setTimeout(() => {
      view.removeCollisionAnimation(enemy);
    }, 500);
  });

  if (playerCollided) {
    view.addCollisionAnimation(player);
  } else {
    view.removeCollisionAnimation(player);
  }
}

function handleCollision(charA, charB) {
  if (!charA.alive || !charB.alive) return false;
  if (collision(charA, charB)) {
    const cALeveledDown = charA.takeDamage(charB.damage);
    const cBLeveledDown = charB.takeDamage(charA.damage);

    if (cBLeveledDown) {
      akilledb(charA, charB);
    } else if (cALeveledDown) {
      akilledb(charB, charA);
    }
    return true;
  }
  return false;
}

function akilledb(c1, c2) {
  c1.levelUp(board);
  view.addLevelUpAnimation(c1);

  if (c2.alive) {
    view.addInvulnerabilityAnimation(c2);
  }

  setTimeout(() => {
    view.removeInvulnerabilityAnimation(c2);
    view.removeLevelUpAnimation(c1);
  }, 2000);
}

function collision(c1, c2) {
  return (
    c1.x < c2.x + c2.width &&
    c1.x + c1.width > c2.x &&
    c1.y < c2.y + c2.height &&
    c1.y + c1.height > c2.y
  );
}

function createEnemies(amount, board) {
  const enemies = [];
  for (let i = 0; i < amount; i++) {
    enemies.push(createRandomEnemy(board));
  }
  return enemies;
}

function createRandomEnemy(board) {
  const newEnemy = new Enemy({
    level: Math.ceil(Math.random() * 2) + 1,
    x: Math.random() * board.width,
    y: Math.random() * board.height,
    speed: Math.random() * 500 + 200,
  });

  if (!board.validateMovement(newEnemy, newEnemy)) {
    return createRandomEnemy(board);
  }
  return newEnemy;
}
