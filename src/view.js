export function init(board, characters) {
  board.element.style.width = board.width + "px";
  board.element.style.height = board.height + "px";

  characters.forEach((c) => {
    const characterElement = document.createElement("div");
    if (c.enemy) {
      characterElement.classList.add("enemy");
    }
    characterElement.setAttribute("id", c.id);
    characterElement.style.height = c.height + "px";
    characterElement.style.width = c.width + "px";

    board.element.insertAdjacentElement(`afterbegin`, characterElement);
    c.element = document.querySelector("#" + c.id);
    const health = document.querySelector("#" + c.id + "-health");
    if (!health) return;
    health.style.width = c.health + "%";
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
  character.element.style.translate = `${character.x}px ${character.y}px`;
  character.element.style.backgroundPositionX =
    character.movementCycle * 100 + "%";

  const health = document.querySelector("#" + character.id + "-health");
  if (!health) return;
  health.style.width = character.health + "%";
}

export function addCollisionAnimation(character) {
  character.element.classList.add("collision");
}

export function removeCollisionAnimation(character) {
  character.element.classList.remove("collision");
}
