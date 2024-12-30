export default class PriorityQueue {
  head = null;
  tail = null;
  size = 0;
  priorityComparator;

  /**
   * @param {(a, b) => number} priorityComparator comparator function to prioritize data. Positive number = a is higher priority than b
   */
  constructor(priorityComparator) {
    this.priorityComparator = priorityComparator;
  }

  /**
   * Returns an iterator that allows you to iterate over the queue
   * @returns {Iterator} iterator
   */
  [Symbol.iterator]() {
    let current = this.head;
    return {
      next() {
        if (!current) {
          return { done: true };
        }
        const data = current.data;
        current = current.next;
        return { value: data, done: false };
      },
    };
  }

  enqueue(data) {
    const newNode = new Node(data);
    // if empty just put it in
    if (this.size === 0) {
      this.head = newNode;
      this.tail = newNode;
    }

    let tmpNode = this.tail;
    while (tmpNode) {
      const c = this.priorityComparator(data, tmpNode.data);
      if (c <= 0) {
        // newNode should be before tmpNode
        this.insertBeforeNode(newNode, tmpNode);
        break;
      } else if (tmpNode === this.head) {
        // if we reach this step, it means newNode should be the new head of the queue
        this.insertAfterNode(newNode, tmpNode);
        break;
      }
      tmpNode = tmpNode.next;
    }
  }

  dequeue() {
    if (!this.head) {
      return undefined;
    }
    const data = this.head.data;
    this.size--;
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
      return data;
    }
    this.head = this.head.prev;
    this.head.next = null;
    return data;
  }

  /**
   * Inserts new node before an existing node
   * @param {Node} newNode node to insert
   * @param {Node} existingNode node to insert new node before
   */
  insertBeforeNode(newNode, existingNode) {
    newNode.prev = existingNode.prev;
    newNode.next = existingNode;

    if (this.tail === existingNode) {
      this.tail = newNode;
    } else {
      existingNode.prev.next = newNode;
    }
    existingNode.prev = newNode;
    this.size++;
  }

  /**
   * Inserts new node after an existing node
   * @param {Node} newNode node to insert
   * @param {Node} existingNode node to insert new node after
   */
  insertAfterNode(newNode, existingNode) {
    newNode.next = existingNode.next;
    newNode.prev = existingNode;

    if (existingNode === this.head) {
      this.head = newNode;
    } else {
      existingNode.next.prev = newNode;
    }
    existingNode.next = newNode;
    this.size++;
  }
}

class Node {
  next = null;
  prev = null;
  data;
  constructor(data) {
    this.data = data;
  }
}
