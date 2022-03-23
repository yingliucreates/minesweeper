//@ts-ignore
import { MAX_COLS, MAX_ROWS, NUMS_MINES } from '../constants/index.ts';
//@ts-ignore
import { Cell, CellValue, CellState } from '../types/index.ts';

export const generateCells = (): Cell[][] => {
  const cells: Cell[][] = [];

  //grenerating all cells;
  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([]);
    for (let col = 0; col < MAX_COLS; col++) {
      cells[row].push({
        value: CellValue.none,
        state: CellState.visible, //make open later
      });
    }
  }
  //randomly placing mines
  let minesPlaced = 0;
  while (minesPlaced < NUMS_MINES) {
    const randomRow = Math.floor(Math.random() * MAX_ROWS);
    const randomCol = Math.floor(Math.random() * MAX_COLS);
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
  for (let rowIdx = 0; rowIdx < MAX_ROWS; rowIdx++) {
    for (let colIdx = 0; colIdx < MAX_COLS; colIdx++) {
      const currCell = cells[rowIdx][colIdx];
      if (currCell.value === CellValue.bomb) continue;
      let minesCount = 0;

      for (const [dx, dy] of dirs) {
        const newRowIdx = rowIdx + dx;
        const newColIdx = colIdx + dy;
        if (
          newRowIdx >= 0 &&
          newRowIdx < MAX_ROWS &&
          newColIdx >= 0 &&
          newColIdx < MAX_COLS &&
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
