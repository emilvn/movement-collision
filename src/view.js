import * as controller from "./controller.js";
import { tileValueToClassnameMap } from "./maps.js";

export function init(board, characters) {
  initKeyboardListeners();
  initButtonEventListeners();

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

function initButtonEventListeners() {
  const restartButton = document.querySelector("#restart-button");
  restartButton.addEventListener("click", controller.reset);
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
      const tileVal = board.tiles.get(row, col);
      tile.classList.add(tileValueToClassnameMap[tileVal]);
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

  if (window.DEBUG) {
    if (!character.enemy) debugHighlightTilesUnderCharacter(character, board);
    debugShowHitBox(character);
    debugShowRect(character);
    debugShowReg(character);
    debugShowGridOutline();
  } else {
    removeDebugStyles(character);
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

let prevTiles = [];
function debugHighlightTilesUnderCharacter(character, board) {
  const coords = board.getTileCoordsFromCharacter(character);
  const className = "highlight-player-tile";
  prevTiles.forEach((t) => t.classList.remove(className));
  prevTiles = [];
  coords.forEach((c) => {
    const visualTile = getVisualTileFromCoords(c);
    visualTile.classList.add(className);
    prevTiles.push(visualTile);
  });
}

function getVisualTileFromCoords({ row, col }) {
  return document.querySelector(`.tile[data-row="${row}"][data-col="${col}"]`);
}

function debugShowHitBox(character) {
  document.documentElement.style.setProperty("--hitboxH", character.hitbox.h);
  document.documentElement.style.setProperty("--hitboxW", character.hitbox.w);
  document.documentElement.style.setProperty("--hitboxX", character.hitbox.x);
  document.documentElement.style.setProperty("--hitboxY", character.hitbox.y);
  character.element.classList.add("show-hitbox");
}

function debugShowReg(character) {
  document.documentElement.style.setProperty("--regY", character.regY);
  document.documentElement.style.setProperty("--regX", character.regX);
  character.element.classList.add("show-reg");
}

function debugShowRect(character) {
  character.element.classList.add("show-rect");
}

function debugShowGridOutline() {
  document
    .querySelectorAll(".tile")
    .forEach((t) => t.classList.add("show-grid-outline"));
}

function removeDebugStyles(character) {
  character.element.classList.remove("show-hitbox");
  character.element.classList.remove("show-reg");
  character.element.classList.remove("show-rect");
  document.querySelectorAll(".tile").forEach((t) => {
    t.classList.remove("show-grid-outline");
    t.classList.remove("highlight-player-tile");
  });
}
