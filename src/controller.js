import Board from "./model/Board.js";
import Enemy from "./model/Enemy.js";
import Player from "./model/Player.js";
import * as view from "./view.js";

window.addEventListener("load", start);

let prevTime = 0;
let accumulator = 0;
let restart = false;

const board = new Board(window.innerWidth - 100, window.innerHeight - 100);

let player = createPlayer();

let enemies = createEnemies(25, board);

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
  return new Player({ level: 10 });
}

export function reset() {
  restart = true;
  player = createPlayer();
  enemies = createEnemies(25, board);
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
  view.displayCharacter(player, controls);

  const deltaT = (time - prevTime) / 1000;
  prevTime = time;
  if (!isNaN(deltaT)) {
    accumulator += deltaT;
  }
  player.move(deltaT, controls, board);
  let playerCollided = false;
  enemies.forEach((enemy) => {
    view.displayCharacter(enemy, enemy.controls);
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

function akilledb(charA, charB) {
  charA.levelUp(board);
  view.addLevelUpAnimation(charA);

  if (charB.alive) {
    view.addInvulnerabilityAnimation(charB);
  }

  setTimeout(() => {
    view.removeInvulnerabilityAnimation(charB);
    view.removeLevelUpAnimation(charA);
  }, 2000);
}

function collision(charA, charB) {
  return (
    charA.x < charB.x + charB.width &&
    charA.x + charA.width > charB.x &&
    charA.y < charB.y + charB.height &&
    charA.y + charA.height > charB.y
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
    level: Math.ceil(Math.random() * 5) + 1,
    x: Math.random() * board.width,
    y: Math.random() * board.height,
    speed: Math.random() * 20 + 5,
  });

  if (!board.validateMovement(newEnemy, newEnemy)) {
    return createRandomEnemy(board);
  }
  return newEnemy;
}
