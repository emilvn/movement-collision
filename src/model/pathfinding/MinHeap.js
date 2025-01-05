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

export default class MinHeap {
  constructor() {
    /** @type {Node[]} */
    this.heap = [];
  }

  // Helper functions to access elements in the heap
  // and calculate parent/child indices

  /*
           0
        /     \
       1       2
      / \     / \
    3   4   5   6
    / \
  7   8

  For node at index 3:
  - Parent: Math.floor((3-1)/2) = 1
  - Left child: 2*3 + 1 = 7
  - Right child: 2*3 + 2 = 8
  */

  /**
   * Calculates the parent index for a node in a binary heap.
   * In a binary heap represented as an array, if a node is at index i:
   * - The parent is at index (i-1)/2 (floored)
   * This works because each level of the heap has twice the nodes of the previous level.
   * @param {number} index The index of the current node
   * @returns {number} The index of the parent node
   */
  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  /**
   * Calculates the left child index for a node in a binary heap.
   * In a binary heap represented as an array, if a node is at index i:
   * - The left child is at index 2i + 1
   * This formula ensures that nodes are stored in level-order traversal.
   * @param {number} index The index of the current node
   * @returns {number} The index of the left child node
   */
  getLeftChildIndex(index) {
    return 2 * index + 1;
  }

  /**
   * Calculates the right child index for a node in a binary heap.
   * In a binary heap represented as an array, if a node is at index i:
   * - The right child is at index 2i + 2
   * This formula ensures the right child comes immediately after the left child.
   * @param {number} index The index of the current node
   * @returns {number} The index of the right child node
   */
  getRightChildIndex(index) {
    return 2 * index + 2;
  }

  size() {
    return this.heap.length;
  }

  swap(indexA, indexB) {
    [this.heap[indexA], this.heap[indexB]] = [this.heap[indexB],this.heap[indexA]];
  }

  /**
   * @param {Node} node
   */
  insert(node) {
    this.heap.push(node);
    this.heapifyUp(this.size() - 1);
  }

  /**
   * @returns {Node | undefined}
   */
  extractMin() {
    if (this.size() === 0) return undefined;

    const min = this.heap[0];
    const last = this.heap.pop();

    if (this.size() > 0) {
      this.heap[0] = last;
      this.heapifyDown(0);
    }

    return min;
  }

  /**
  * Maintains the min-heap property by moving a node up the heap until it's in the correct position.
  * Used after inserting a new node at the bottom of the heap.
  * Process:
  * 1. Compare the node with its parent
  * 2. If parent's priority is higher (violating min-heap property), swap them
  * 3. Continue until either reaching the root or finding a parent with lower priority
  * 
  * Time complexity: O(log n) as we might traverse the height of the heap
  * 
  * @param {number} index The index of the node to move up
  */
  heapifyUp(index) {
    while (index > 0) {
      const parentIndex = this.getParentIndex(index);
      // If parent's priority is lower or equal, min-heap property is satisfied and we can break
      if (this.heap[parentIndex].priority <= this.heap[index].priority) break;

      // Otherwise, swap the node with its parent and continue
      this.swap(index, parentIndex);
      index = parentIndex;
    }
  }

  /**
  * Maintains the min-heap property by moving a node down the heap until it's in the correct position.
  * Used after removing the root node and moving the last node to the root.
  * Process:
  * 1. Compare the node with both its children
  * 2. Find the smallest of the three (parent and two children)
  * 3. If parent isn't the smallest, swap with the smallest child
  * 4. Recursively continue this process
  * 
  * Time complexity: O(log n) as we might traverse the height of the heap
  * 
  * @param {number} index The index of the node to move down
  */
  heapifyDown(index) {
    let smallest = index;
    const leftIndex = this.getLeftChildIndex(index);
    const rightIndex = this.getRightChildIndex(index);

    // Check if left child exists and is smaller than current smallest
    if (
      leftIndex < this.size() &&
      this.heap[leftIndex].priority < this.heap[smallest].priority
    ) {
      smallest = leftIndex;
    }
    // Check if right child exists and is smaller than current smallest
    if (
      rightIndex < this.size() &&
      this.heap[rightIndex].priority < this.heap[smallest].priority
    ) {
      smallest = rightIndex;
    }
    // If either child was smaller, swap and continue heapifying down
    if (smallest !== index) {
      this.swap(index, smallest);
      this.heapifyDown(smallest);
    }
  }
}
