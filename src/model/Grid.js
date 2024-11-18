export class Grid {
  grid = [];
  rowNum;
  colNum;

  constructor(rows, cols) {
    this.rowNum = rows;
    this.colNum = cols;
    for (let i = 0; i < rows; i++) {
      this.grid[i] = [];
    }
  }

  set(row, col, value) {
    const { r, c, v } = this.getRowColAndValue(row, col, value);
    if (this.grid[r]) {
      this.grid[r][c] = v;
    }
  }

  get(row, col) {
    const { r, c } = this.getRowCol(row, col);
    return this.grid[r]?.[c];
  }

  indexFor(row, col) {
    const { r, c } = this.getRowCol(row, col);
    if (r < 0 || r >= this.rowNum || c < 0 || c >= this.colNum) {
      return -1;
    }
    return r * this.colNum + c;
  }

  rowColFor(i) {
    const col = i % this.colNum;
    const row = Math.floor(i / this.colNum);
    return { col, row };
  }

  neighbours(row, col) {
    const { r, c } = this.getRowCol(row, col);
    const neighbours = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (
          r + i < this.colNum &&
          c + j < this.rowNum &&
          !(i === 0 && j === 0)
        ) {
          neighbours.push({ row: r + i, col: c + j });
        }
      }
    }
    return neighbours;
  }

  neighbourValues(row, col) {
    const { r, c } = this.getRowCol(row, col);
    const neighbours = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (this.grid[r + i]?.[c + j] && !(i === 0 && j === 0)) {
          neighbours.push(this.grid[r + i][c + j]);
        }
      }
    }
    return neighbours;
  }

  nextInRow(row, col) {
    const { r, c } = this.getRowCol(row, col);
    return this.grid[r]?.[c + 1];
  }

  nextInCol(row, col) {
    const { r, c } = this.getRowCol(row, col);
    return this.grid[r + 1]?.[c];
  }

  north(row, col) {
    const { r, c } = this.getRowCol(row, col);
    return this.grid[r - 1]?.[c];
  }

  south(row, col) {
    return this.nextInCol(row, col);
  }

  west(row, col) {
    const { r, c } = this.getRowCol(row, col);
    return this.grid[r]?.[c - 1];
  }

  east(row, col) {
    return this.nextInRow(row, col);
  }

  rows() {
    return this.rowNum;
  }

  cols() {
    return this.colNum;
  }

  size() {
    return this.rowNum * this.colNum;
  }

  fill(value) {
    for (let r = 0; r < this.rowNum; r++) {
      for (let c = 0; c < this.colNum; c++) {
        this.grid[r][c] = value;
      }
    }
  }

  getRowColAndValue(row, col, value) {
    // if value is undefined we assume it is called with ({row, col}, value)
    if (value === undefined) {
      const obj = row;
      value = col;
      col = obj.col;
      row = obj.row;
    }
    return { r: row, c: col, v: value };
  }

  getRowCol(row, col) {
    if (col === undefined) {
      const obj = row;
      col = obj.col;
      row = obj.row;
    }
    return { r: row, c: col };
  }

  clear() {
    this.grid = [];
    for (let i = 0; i < this.rowNum; i++) {
      this.grid[i] = [];
    }
  }

  dump() {
    console.table(this.grid);
  }
}
