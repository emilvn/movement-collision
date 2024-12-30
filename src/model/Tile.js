import { TILES } from "../../configs/tileConfig.js";

export default class Tile {
  constructor(type) {
    const tileData = TILES[type] || TILES[0]; // Fallback to grass tile if type is not found
    this.type = type;
    this.name = tileData.name;
    this.className = tileData.className;
    this.weight = tileData.weight;
    this.isObstacle = tileData.isObstacle;
    this.blocksVision = tileData.blocksVision;
  }

  // Get the cost of moving through this tile
  getPathfindingCost() {
    return this.weight;
  }
}
