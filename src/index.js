window.addEventListener("load", start);

const BOARD = document.querySelector("#game");
let prevTime = 0;

const board = {};

const player = {
  element: document.querySelector("#player"),
  x: 0,
  y: 0,
  speed: 5,
  movementCycle: 0,
};

const controls = {
  up: false,
  left: false,
  down: false,
  right: false,
};

function start() {
  setInterval(() => {
    if (controls.up || controls.down || controls.left || controls.right) {
      cycleMovement();
    } else {
      player.movementCycle = 0;
    }
  }, 100);
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
  look();
  move(deltaT);
  displayPlayer();
}

function look() {
  if (controls.up && !controls.down) {
    player.element.style.backgroundPositionY = "300%";
  }
  if (controls.down && !controls.up) {
    player.element.style.backgroundPositionY = 0;
  }
  if (controls.left && !controls.right) {
    player.element.style.backgroundPositionY = "200%";
  }
  if (controls.right && !controls.left) {
    player.element.style.backgroundPositionY = "100%";
  }
}

function move(deltaT) {
  const newPos = { x: player.x, y: player.y };

  if (controls.up) {
    newPos.y -= 20 * player.speed * deltaT;
  }
  if (controls.down) {
    newPos.y += 20 * player.speed * deltaT;
  }
  if (controls.left) {
    newPos.x -= 32 * player.speed * deltaT;
  }
  if (controls.right) {
    newPos.x += 32 * player.speed * deltaT;
  }

  if (validateMovement(player, newPos)) {
    player.x = newPos.x;
    player.y = newPos.y;
  }
}

function validateMovement(player, newPos) {
  return true;
}

function cycleMovement() {
  if (player.movementCycle === 3) {
    player.movementCycle = 0;
  } else {
    player.movementCycle++;
  }
}

function displayPlayer() {
  player.element.style.translate = `${player.x}px ${player.y}px`;
  player.element.style.backgroundPositionX = player.movementCycle * 100 + "%";
}
