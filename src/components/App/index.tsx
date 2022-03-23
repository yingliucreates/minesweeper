import React, { FC, useState, ReactNode, useEffect, MouseEvent } from 'react';
//@ts-ignore
import NumberDiplay from '../Display/index.tsx';
//@ts-ignore
import { generateCells } from '../../utils/index.ts';
//@ts-ignore
import Button from '../Button/index.tsx';
//@ts-ignore
import { Cell, Face, CellState } from '../../types/index.ts';
import './App.scss';

const App: FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<Face>(Face.smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [mines, setMines] = useState<number>(10);

  useEffect(() => {
    const handleMouseDown = (): void => {
      setFace(Face.oh);
    };
    const handleMouseUp = (): void => {
      setFace(Face.smile);
    };
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (live && time < 999) {
      const timer = setInterval(() => {
        setTime(time + 1);
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [live, time]);

  const handleCellClick = (rowParam: number, colParam: number) => () => {
    if (!live) {
      setLive(true);
    }
  };

  const handleCellContext =
    (rowParam: number, colParam: number) =>
    (e: MouseEvent<HTMLDivElement, MouseEvent>): void => {
      e.preventDefault();
      if (!live) {
        return;
      }
      const currCells = cells.slice();
      const currCell = cells[rowParam][colParam];
      if (currCell.state === CellState.visible) return;
      if (currCell.state === CellState.open) {
        currCells[rowParam][colParam].state = CellState.flagged;
        setCells(currCells);
        setMines(mines - 1);
      } else if (currCell.state === CellState.flagged) {
        currCells[rowParam][colParam].state = CellState.open;
        setCells(currCells);
        setMines(mines + 1);
      }

      console.log('in right click');
    };

  const handleFaceClick = (): void => {
    if (live) {
      setLive(false);
      setTime(0);
      setCells(generateCells());
    }
  };

  const renderCells = (): ReactNode =>
    cells.map((row, rowIdx) =>
      row.map((cell, colIdx) => (
        <Button
          key={`${rowIdx}-${colIdx}`}
          state={cell.state}
          value={cell.value}
          row={rowIdx}
          col={colIdx}
          onClick={handleCellClick}
          onContext={handleCellContext}
        />
      ))
    );

  return (
    <div className="App">
      <div className="Header">
        <NumberDiplay value={mines} />
        <div className="Face" onClick={handleFaceClick}>
          <span role="img" aria-label="face">
            {face}
          </span>
        </div>
        <NumberDiplay value={time} />
      </div>
      <div className="Body">{renderCells()}</div>
    </div>
  );
};

export default App;
