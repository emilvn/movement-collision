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

  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  getLeftChildIndex(index) {
    return 2 * index + 1;
  }

  getRightChildIndex(index) {
    return 2 * index + 2;
  }

  size() {
    return this.heap.length;
  }

  swap(indexA, indexB) {
    [this.heap[indexA], this.heap[indexB]] = [
      this.heap[indexB],
      this.heap[indexA],
    ];
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

  heapifyUp(index) {
    while (index > 0) {
      const parentIndex = this.getParentIndex(index);
      if (this.heap[parentIndex].priority <= this.heap[index].priority) break;

      this.swap(index, parentIndex);
      index = parentIndex;
    }
  }

  heapifyDown(index) {
    let smallest = index;
    const leftIndex = this.getLeftChildIndex(index);
    const rightIndex = this.getRightChildIndex(index);

    if (
      leftIndex < this.size() &&
      this.heap[leftIndex].priority < this.heap[smallest].priority
    ) {
      smallest = leftIndex;
    }

    if (
      rightIndex < this.size() &&
      this.heap[rightIndex].priority < this.heap[smallest].priority
    ) {
      smallest = rightIndex;
    }

    if (smallest !== index) {
      this.swap(index, smallest);
      this.heapifyDown(smallest);
    }
  }
}
