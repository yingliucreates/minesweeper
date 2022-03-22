//@ts-ignore
import { MAX_COLS, MAX_ROWS } from '../constants/index.ts';
//@ts-ignore
import { Cell, CellValue, CellState } from '../types/index.ts';

export const generateCells = (): Cell[][] => {
  const cells: Cell[][] = [];
  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([]);
    for (let col = 0; col < MAX_COLS; col++) {
      cells[row].push({
        value: CellValue.none,
        state: CellState.open,
      });
    }
  }
  return cells;
};
