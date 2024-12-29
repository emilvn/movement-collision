import { Grid } from "./Grid.js";
export default class Board {
  element;

  // board dimensions
  width;
  height;
  tileSize;

  // tiles grid
  tiles;

  // collision system reference
  collisionSystem;

  constructor(width, height, tileSize) {
      this.width = width;
      this.height = height;
      this.tileSize = tileSize;
      this.tiles = new Grid(
          Math.ceil(height / tileSize),
          Math.ceil(width / tileSize)
      );
  }

  setCollisionSystem(collisionSystem) {
      this.collisionSystem = collisionSystem;
  }

  // loads a map into the board
  loadMap(map) {
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[0].length; col++) {
        this.tiles.set(row, col, map[row][col]);
      }
    }
  }

  // checks if a tile is an obstacle, i.e. should block movement
  isObstacle(tileval) {
    const obstacleVals = [1, 3, 4, 15, 16, 17, 18, 19];
    return obstacleVals.includes(tileval);
  }

  // gets the tile at a given row and col
  getTileAtCoord({ row, col }) {
    return this.tiles.get(row, col);
  }

  // gets the tile at a given position (x, y)
  getTileAtPos({ x, y }) {
    const { row, col } = this.getCoordFromPos({ x, y });
    return this.getTileAtCoord({ row, col });
  }

  // gets the position (x, y) of the top left corner of a tile given a row and col
  getTilePosFromCoord({ row, col }) {
    return { x: col * this.tileSize, y: row * this.tileSize };
  }

  // gets the row and col of a tile given a position (x, y)
  getCoordFromPos({ x, y }) {
    return {
      row: Math.floor(y / this.tileSize),
      col: Math.floor(x / this.tileSize),
    };
  }

  // gets the coords (row, col) of the 4 corners of a character hitbox
  getTileCoordsFromCharacter(character) {
    const topLeft = {
      x: character.x - character.regX + character.hitbox.x,
      y: character.y - character.regY + character.hitbox.y,
    };
    const topRight = {
      x: topLeft.x + character.hitbox.w,
      y: topLeft.y,
    };
    const botLeft = {
      x: topLeft.x,
      y: topLeft.y + character.hitbox.h,
    };
    const botRight = {
      x: topLeft.x + character.hitbox.w,
      y: topLeft.y + character.hitbox.h,
    };

    return [
      this.getCoordFromPos(topLeft),
      this.getCoordFromPos(topRight),
      this.getCoordFromPos(botLeft),
      this.getCoordFromPos(botRight),
    ];
  }
}
