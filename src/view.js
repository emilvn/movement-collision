export function init(board, characters) {
  board.element = document.querySelector("#board");
  board.element.style.width = board.width + "px";
  board.element.style.height = board.height + "px";

  characters.forEach((c) => {
    const characterElement = document.createElement("div");
    if (c.enemy) {
      characterElement.classList.add("enemy");
    }
    characterElement.setAttribute("id", c.id);
    characterElement.classList.add("character");
    characterElement.style.height = c.height + "px";
    characterElement.style.width = c.width + "px";

    const healthBarContainer = document.createElement("div");
    healthBarContainer.classList.add("health-container");
    const healthBar = document.createElement("div");
    healthBar.style.width = "100%";
    healthBar.classList.add("health");
    healthBarContainer.appendChild(healthBar);

    characterElement.appendChild(healthBarContainer);

    board.element.appendChild(characterElement);
    c.element = document.querySelector("#" + c.id);
  });
}

export function displayCharacter(character, controls) {
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
  if (controls.up || controls.down || controls.left || controls.right) {
    character.element.classList.add("move");
  } else {
    character.element.classList.remove("move");
  }
  character.element.style.translate = `${character.x}px ${character.y}px`;

  const health = character.element.querySelector(".health");
  health.style.width = (character.health / character.maxHealth) * 100 + "%";
}

export function addCollisionAnimation(character) {
  character.element.querySelector(".health").classList.add("collision");
}

export function removeCollisionAnimation(character) {
  character.element.querySelector(".health").classList.remove("collision");
}
