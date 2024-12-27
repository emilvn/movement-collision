import { map1 } from "./maps.js";
import Board from "./model/Board.js";
import Enemy from "./model/Enemy.js";
import Player from "./model/Player.js";
import * as view from "./view.js";

window.addEventListener("load", start);

// debug toggle flag
let DEBUG = false;

// game loop variables
let prevTime = 0;
let accumulator = 0;
let restart = false;

const board = new Board(768, 768, 64);
board.loadMap(map1);

let player = createPlayer();

let enemies = createEnemies(1, board);

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
  return new Player();
}

export function reset() {
  restart = true;
  player = createPlayer();
  enemies = createEnemies(1, board);
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
    // randomize enemy controls every 500ms
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
  if (charA.collidedWith(charB)) {
    charA.takeDamage(charB.damage);
    charB.takeDamage(charA.damage);
    return true;
  }
  return false;
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
    x: Math.random() * board.width,
    y: Math.random() * board.height,
  });

  if (!board.validateMovement(newEnemy, newEnemy)) {
    return createRandomEnemy(board);
  }
  return newEnemy;
}

export function debugModeOn() {
  return DEBUG;
}

export function toggleDebug() {
  DEBUG = !DEBUG;
  view.setDebugButtonText(DEBUG ? "ON" : "OFF");
}
