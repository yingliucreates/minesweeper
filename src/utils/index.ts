//@ts-ignore
import { MAX_COLS, MAX_ROWS, NUMS_MINES } from '../constants/index.ts';
//@ts-ignore
import { Cell, CellValue, CellState } from '../types/index.ts';

export const generateCells = (level: string): Cell[][] => {
  const cells: Cell[][] = [];

  //grenerating all cells;
  for (let row = 0; row < MAX_ROWS[level]; row++) {
    cells.push([]);
    for (let col = 0; col < MAX_COLS[level]; col++) {
      cells[row].push({
        value: CellValue.none,
        state: CellState.open, //make open later
      });
    }
  }
  //randomly placing mines
  let minesPlaced = 0;
  while (minesPlaced < NUMS_MINES[level]) {
    const randomRow = Math.floor(Math.random() * MAX_ROWS[level]);
    const randomCol = Math.floor(Math.random() * MAX_COLS[level]);
    const currCell = cells[randomRow][randomCol];
    if (currCell.value !== CellValue.bomb) {
      cells.map((row, rowIdx) =>
        row.map((col, colIdx) => {
          if (randomRow === rowIdx && randomCol === colIdx) {
            cells[randomRow][randomCol] = {
              ...cells[randomRow][randomCol],
              value: CellValue.bomb,
            };
          }
          return cells[randomRow][randomCol];
        })
      );
    }

    minesPlaced++;
  }

  const dirs = [
    [1, 1],
    [1, 0],
    [1, -1],
    [0, 1],
    [0, -1],
    [-1, 0],
    [-1, 1],
    [-1, -1],
  ];

  //calculate the numbers for each cell
  for (let rowIdx = 0; rowIdx < MAX_ROWS[level]; rowIdx++) {
    for (let colIdx = 0; colIdx < MAX_COLS[level]; colIdx++) {
      const currCell = cells[rowIdx][colIdx];
      if (currCell.value === CellValue.bomb) continue;
      let minesCount = 0;

      for (const [dx, dy] of dirs) {
        const newRowIdx = rowIdx + dx;
        const newColIdx = colIdx + dy;
        if (
          newRowIdx >= 0 &&
          newRowIdx < MAX_ROWS[level] &&
          newColIdx >= 0 &&
          newColIdx < MAX_COLS[level] &&
          cells[newRowIdx][newColIdx].value === CellValue.bomb
        ) {
          minesCount++;
        }
      }
      if (minesCount > 0) {
        cells[rowIdx][colIdx] = {
          ...currCell,
          value: minesCount,
        };
      }
    }
  }
  return cells;
};

const dirs: number[][] = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, 1],
  [0, -1],
  [-1, 0],
  [-1, 1],
  [-1, -1],
];

const outBound = (board, r, c) =>
  r < 0 || c < 0 || r >= board.length || c >= board[0].length;

export const openMultipleCells = (
  cells: Cell[][],
  r: number,
  c: number
): Cell[][] => {
  let newCells = cells.slice();
  if (outBound(newCells, r, c)) return;
  if (newCells[r][c].value === CellValue.bomb) return;
  if (
    newCells[r][c].state === CellState.flagged ||
    newCells[r][c].state === CellState.visible
  )
    return;
  newCells[r][c].state = CellState.visible;
  if (newCells[r][c].value === CellValue.none) {
    for (const [dr, dc] of dirs) {
      const newR = dr + r;
      const newC = dc + c;
      openMultipleCells(newCells, newR, newC);
    }
  }
  return newCells;
};
