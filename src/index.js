import Board from "./model/Board.js";
import Character from "./model/Character.js";
import * as view from "./view.js";

window.addEventListener("load", start);

let prevTime = 0;

const board = new Board(1200, 500);

const player = new Character("player", 64, 80, 0, 0, 10, false);
const enemy1 = new Character("enemy1", 64, 80, 200, 50, 5, true);
const enemy2 = new Character("enemy2", 64, 80, 400, 100, 20, true);
const enemy3 = new Character("enemy3", 64, 80, 800, 150, 30, true);
const enemy4 = new Character("enemy4", 64, 80, 1000, 200, 10, true);
const enemies = [enemy1, enemy2, enemy3, enemy4];

const controls = {
  up: false,
  left: false,
  down: false,
  right: false,
};

const enemyControls = {
  up: false,
  left: false,
  down: true,
  right: false,
};

function start() {
  view.init(board, [player, ...enemies]);
  setInterval(() => {
    if (controls.up || controls.down || controls.left || controls.right) {
      player.cycleMovement();
    } else {
      player.movementCycle = 0;
    }
    if (
      enemyControls.up ||
      enemyControls.down ||
      enemyControls.left ||
      enemyControls.right
    ) {
      enemies.forEach((enemy) => enemy.cycleMovement());
    } else {
      enemies.forEach((enemy) => (enemy.movementCycle = 0));
    }
  }, 100);
  setInterval(enemyMovement, 1000);
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
  player.move(deltaT, controls, board);
  enemies.forEach((enemy) => enemy.move(deltaT, enemyControls, board));

  if (enemies.some((enemy) => collision(player, enemy))) {
    player.health -= 1;
    view.addCollisionAnimation(player);
  } else {
    view.removeCollisionAnimation(player);
  }
  view.displayCharacter(player, controls);
  enemies.forEach((enemy) => view.displayCharacter(enemy, enemyControls));
}

function collision(c1, c2) {
  return (
    c1.x < c2.x + c2.width &&
    c1.x + c1.width > c2.x &&
    c1.y < c2.y + c2.height &&
    c1.y + c1.height > c2.y
  );
}

function enemyMovement(enemy) {
  enemyControls.up = enemyControls.down;
  enemyControls.down = !enemyControls.up;
}
