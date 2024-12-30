import Board from "../model/Board";

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
 * calculates optimal path from start to goal
 * @param {{x: number, y: number}} start start position (enemy position)
 * @param {{x: number, y: number}} goal goal position (player position)
 * @param {Board} board game board
 * @param {(a: {x: number, y: number}, b: {x: number, y: number}) => number} h heuristics funtion to estimate cost to reach goal
 */
export function aStar(start, goal, board, h) {}
