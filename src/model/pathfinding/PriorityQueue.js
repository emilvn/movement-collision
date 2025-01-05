import MinHeap from "./MinHeap.js";

/**
 * @typedef {Object} GridCoord
 * @property {number} row - Row index in the grid
 * @property {number} col - Column index in the grid
 */

/**
 * @typedef {Object} Node
 * @property {GridCoord} data - The grid coordinates
 * @property {number} priority - Priority value (fScore) for ordering in the queue
 */

export default class PriorityQueue {
  constructor() {
    this.heap = new MinHeap();
  }

  /**
   * @returns {number} Number of elements in queue
   */
  get size() {
    return this.heap.size();
  }

  /**
   * Adds a new grid coordinate to the queue with given priority
   * @param {GridCoord} data The grid coordinate to add
   * @param {number} priority Priority value (fScore) determining position in queue
   * @throws {Error} If data or priority is invalid
   */
  enqueue(data, priority) {
    if (!data || typeof data.row !== "number" || typeof data.col !== "number") {
      throw new Error("Data must be a valid grid coordinate");
    }
    if (typeof priority !== "number") {
      throw new Error("Priority must be a number");
    }
    this.heap.insert({ data, priority });
  }

  /**
   * Removes and returns the grid coordinate with lowest priority value
   * @returns {GridCoord | undefined} The grid coordinate with lowest priority, or undefined if queue is empty
   */
  dequeue() {
    const node = this.heap.extractMin();
    return node?.data;
  }
}
