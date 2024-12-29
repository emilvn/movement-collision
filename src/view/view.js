import * as controller from "../controller.js";
import * as debugRenderer from "./debugRenderer.js";

export function init(board, characters) {
  initKeyboardListeners();
  initButtons();

  const root = document.querySelector("#root");
  root.innerHTML = "";
  const boardElement = initBoard(board);
  root.appendChild(boardElement);
  displayTiles(board);

  characters.forEach((c) => {
    const characterElement = initCharacter(c);
    board.element.appendChild(characterElement);
  });
}

function initButtons() {
  const restartButton = document.querySelector("#restart-button");
  restartButton.addEventListener("click", controller.reset);

  const debugButton = document.querySelector("#debug-button");
  debugButton.addEventListener("click", controller.toggleDebug);
  setDebugButtonText(controller.debugModeOn() ? "ON" : "OFF");
}

export function setDebugButtonText(text) {
  const debugButtonText = document.querySelector("#debug-status");
  debugButtonText.innerText = text;
}

function initKeyboardListeners() {
  window.removeEventListener("keydown", controller.handleKeyDownInput);
  window.removeEventListener("keyup", controller.handleKeyUpInput);
  window.addEventListener("keydown", controller.handleKeyDownInput);
  window.addEventListener("keyup", controller.handleKeyUpInput);
}

function initBoard(board) {
  const boardElement = document.createElement("div");
  boardElement.setAttribute("id", "board");
  boardElement.style.width = board.width + "px";
  boardElement.style.height = board.height + "px";
  board.element = boardElement;

  initTiles(board);

  document.documentElement.style.setProperty("--row-num", board.tiles.rowNum);
  document.documentElement.style.setProperty("--col-num", board.tiles.colNum);
  document.documentElement.style.setProperty("--tile-size", board.tileSize);

  return boardElement;
}

function initTiles(board) {
  for (let row = 0; row < board.tiles.rowNum; row++) {
    for (let col = 0; col < board.tiles.colNum; col++) {
      const cell = document.createElement("div");
      cell.classList.add("tile");
      cell.dataset.row = row;
      cell.dataset.col = col;
      board.element.appendChild(cell);
    }
  }
}

function displayTiles(board) {
  for (let row = 0; row < board.tiles.rowNum; row++) {
      for (let col = 0; col < board.tiles.colNum; col++) {
          const tile = document.querySelector(
              `.tile[data-row="${row}"][data-col="${col}"]`
          );
          const tileObj = board.tiles.get(row, col);
          tile.classList.add(tileObj.className);
      }
  }
}

function initCharacter(character) {
  const characterElement = document.createElement("div");
  if (character.enemy) {
    characterElement.classList.add("enemy");
  }
  characterElement.setAttribute("id", character.id);
  characterElement.classList.add("character");
  characterElement.style.height = character.height + "px";
  characterElement.style.width = character.width + "px";

  character.element = characterElement;
  return characterElement;
}

export function displayCharacter(character, controls, board) {
  character.element.style.height = character.height + "px";
  character.element.style.width = character.width + "px";
  if (!character.enemy) {
    displayPlayerStats(character);
  }

  if (controller.debugModeOn()) {
    if (!character.enemy) debugRenderer.highlightTilesUnderCharacter(character, board);
    debugRenderer.showHitBox(character);
    debugRenderer.showRect(character);
    debugRenderer.showReg(character);
    debugRenderer.showGridOutline();
  } else {
    debugRenderer.clearAll(character);
  }

  if (!character.alive) {
    character.element.classList.add("dead");
    return;
  }
  displayLookDirection(character, controls);
  displayCharacterMovement(character, controls);
}

function displayCharacterMovement(character, controls) {
  if (controls.up || controls.down || controls.left || controls.right) {
    character.element.classList.add("move");
  } else {
    character.element.classList.remove("move");
  }
  character.element.style.translate = `${character.x - character.regX}px ${
    character.y - character.regY
  }px`;
}

function displayLookDirection(character, controls) {
  if (controls.up && !controls.down) {
    character.element.style.backgroundPositionY = "300%";
  }
  if (controls.down && !controls.up) {
    character.element.style.backgroundPositionY = 0;
  }
  if (controls.left && !controls.right) {
    character.element.style.backgroundPositionY = "200%";
  }
  if (controls.right && !controls.left) {
    character.element.style.backgroundPositionY = "100%";
  }
}

export function addCollisionAnimation(character) {
  character.element.classList.add("collision");
}

export function removeCollisionAnimation(character) {
  character.element.classList.remove("collision");
}

function displayPlayerStats(player) {
  const playerHealth = document.querySelector("#player-health");
  const playerDamage = document.querySelector("#player-damage");
  playerHealth.innerText = player.health.toFixed(2);
  playerDamage.innerText = player.damage.toFixed(2);
}