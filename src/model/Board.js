export default class Board {
  width;
  height;
  element = document.querySelector("#board");

  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  validateMovement(player, newPos) {
    return (
      newPos.x >= 0 &&
      newPos.x < this.width - player.width &&
      newPos.y >= 0 &&
      newPos.y < this.height - player.height
    );
  }
}
