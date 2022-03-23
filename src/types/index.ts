export enum CellValue {
  none,
  one,
  two,
  three,
  four,
  five,
  six,
  seven,
  egith,
  bomb,
}

export enum CellState {
  open,
  visible,
  flagged,
}

export type Cell = { value: CellValue; state: CellState };

export enum Face {
  smile = '😁',
  oh = '😮',
  lost = '😱',
  won = '😎',
}
