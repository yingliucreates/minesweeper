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
  return cells;
};
