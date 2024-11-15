import * as controller from "./controller.js";

export function init(board, characters) {
  initKeyboardListeners();
  initButtonEventListeners();

  const root = document.querySelector("#root");
  root.innerHTML = "";
  const boardElement = initBoard(board);
  root.appendChild(boardElement);

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
  return boardElement;
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

  const healthBarContainer = initCharacterHealth(character);
  characterElement.appendChild(healthBarContainer);

  character.element = characterElement;
  return characterElement;
}

function initCharacterHealth(character) {
  const healthBarContainer = document.createElement("div");
  healthBarContainer.classList.add("health-container");
  const healthBar = document.createElement("div");
  healthBar.style.width = "100%";
  healthBar.classList.add("health");
  healthBarContainer.appendChild(healthBar);
  return healthBarContainer;
}

export function displayCharacter(character, controls) {
  character.element.style.height = character.height + "px";
  character.element.style.width = character.width + "px";
  displayHealth(character);
  if (!character.alive) return;
  displayLookDirection(character, controls);
  displayCharacterMovement(character, controls);
}

function displayCharacterMovement(character, controls) {
  if (controls.up || controls.down || controls.left || controls.right) {
    character.element.classList.add("move");
  } else {
    character.element.classList.remove("move");
  }
  character.element.style.translate = `${character.x}px ${character.y}px`;
}

function displayHealth(character) {
  const health = character.element.querySelector(".health");
  health.style.width = (character.health / character.maxHealth) * 100 + "%";
  if (!character.alive) {
    character.element.classList.add("dead");
    character.element.classList.remove("move");
  }
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

export function addInvulnerabilityAnimation(character) {
  character.element.classList.add("invulnerable");
  character.element.querySelector(".health").style.width = "100%";
}

export function removeInvulnerabilityAnimation(character) {
  character.element.classList.remove("invulnerable");
}

export function addLevelUpAnimation(character) {
  character.element.classList.add("levelup");
}

export function removeLevelUpAnimation(character) {
  character.element.classList.remove("levelup");
}
