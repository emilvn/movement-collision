import Board from "../model/Board.js";
import PriorityQueue from "../model/PriorityQueue.js";

/**
 * Calculates Euclidian distance between two positions
 * distance = sqrt(Δx² + Δy²)
 * @param {{x: number, y: number}} a position a
 * @param {{x: number, y: number}} b position b
 * @returns {number} Euclidian distance in pixels between a and b
 */
export function euclideanDistance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/**
 * Calculates Manhatten distance between two coords in a grid
 * distance = |Δx| + |Δy|
 * @param {{row: number, col: number}} a coord a
 * @param {{row: number, col: number}} b coord b
 */
export function manhattanDistance(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

/**
 * calculates optimal path from start to goal
 * @param {{x: number, y: number}} start start position (enemy position)
 * @param {{x: number, y: number}} goal goal position (player position)
 * @param {Board} board game board
 * @param {(a: {row: number, col: number}, b: {row: number, col: number}) => number} h heuristics funtion to estimate cost to reach goal
 * @returns {{row:number, col:number}[]} path from start to goal in grid coordinates
 */
export function aStar(start, goal, board, h) {
  const startCoords = board.getCoordFromPos(start);
  const goalCoords = board.getCoordFromPos(goal);

  // For node n, gScore[n] is the currently known cost of the cheapes path from start to n
  const gScore = {};
  gScore[getCoordKey(startCoords)] = 0;

  // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
  // how cheap a path could be from start to finish if it goes through n.
  const fScore = {};
  fScore[getCoordKey(startCoords)] = h(startCoords, goalCoords);

  const cameFrom = {};

  const openSetCoords = new Set();
  const openSet = new PriorityQueue((a, b) => compareDistance(a, b, fScore));
  openSet.enqueue(startCoords);
  openSetCoords.add(startCoords);

  while (openSet.size > 0) {
    let current = openSet.dequeue();
    const currentKey = getCoordKey(current);
    const currentGScore = gScore[currentKey] ?? Infinity;

    if (current.row === goalCoords.row && current.col === goalCoords.col) {
      return reconstructPath(cameFrom, current);
    }

    const neighbours = board.tiles.neighbours(current.row, current.col);
    for (const neighbour of neighbours) {
      const neighbourKey = getCoordKey(neighbour);
      const neighbourGScore = gScore[neighbourKey] ?? Infinity;

      const tile = board.getTileAtCoord(neighbour);
      if (!tile) continue; // skip if tile is out of bounds

      const tentativeGScore = currentGScore + tile.getPathfindingCost();
      if (tentativeGScore < neighbourGScore) {
        cameFrom[neighbourKey] = current;
        gScore[neighbourKey] = tentativeGScore;
        fScore[neighbourKey] = tentativeGScore + h(neighbour, goalCoords);
        if (!openSetCoords.has(neighbour)) {
          openSet.enqueue(neighbour);
        }
      }
    }
  }
  return [];
}

/**
 * Reconstructs the fastest path and returns it
 * @param {{[key:string]:{row:number, col: number}}} cameFrom map of grid coords containing the path from goal to start
 * @param {{row: number, col: number}} current goal cell coords
 * @returns {{row: number, col: number}[]} return
 */
function reconstructPath(cameFrom, current) {
  const totalPath = [current];
  while (current) {
    current = cameFrom[getCoordKey(current)];
    if (current) {
      totalPath.unshift(current);
    }
  }
  return totalPath;
}

/**
 * Compares position a and b's distance to goal.
 * if a is closer to goal than b: returns positive number
 * if b is closer to goal than a: returns negative number
 * if they are the same distance returns 0
 * @param {{row: number, col: number}} a position a
 * @param {{row: number, col: number}} b position b
 * @param {{row: number, col: number}} goal position goal
 * @returns {number} comparison value between a and b's fScore
 */
function compareDistance(a, b, fScore) {
  return fScore[getCoordKey(b)] - fScore[getCoordKey(a)];
}

/**
 * @param {{row:number, col: number}} coords coords to get grid coord key for
 * @returns {string} unique key for the grid cell of a given position as a string. Example: row: 5, col: 7, would give key "57"
 */
function getCoordKey(coords) {
  return coords.row.toString() + coords.col.toString();
}
