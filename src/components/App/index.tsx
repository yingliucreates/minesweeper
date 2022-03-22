import React, { FC, useState, ReactNode } from 'react';
//@ts-ignore
import NumberDiplay from '../Display/index.tsx';
//@ts-ignore
import { generateCells } from '../../utils/index.ts';
//@ts-ignore
import Button from '../Button/index.tsx';
import './App.scss';

const App: FC = () => {
  const [cells, setCells] = useState(generateCells());

  console.log(cells);

  const renderCells = (): ReactNode =>
    cells.map((row, rowIdx) =>
      row.map((cell, colIdx) => (
        <Button
          key={`${rowIdx}-${colIdx}`}
          state={cell.state}
          value={cell.value}
          row={rowIdx}
          col={colIdx}
        />
      ))
    );

  return (
    <div className="App">
      <div className="Header">
        <NumberDiplay value={2} />
        <div className="Face">
          <span role="img" aria-label="face">
            😁
          </span>
        </div>
        <NumberDiplay value={5} />
      </div>
      <div className="Body">{renderCells()}</div>
    </div>
  );
};

export default App;
