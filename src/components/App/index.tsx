import React, { FC, useState, ReactNode, useEffect, MouseEvent } from 'react';
//@ts-ignore
import NumberDisplay from '../Display/index.tsx';
//@ts-ignore
import { generateCells, openMultipleCells } from '../../utils/index.ts';
//@ts-ignore
import Button from '../Button/index.tsx';
//@ts-ignore
import Level from '../Level/index.tsx';
//@ts-ignore
import { Cell, Face, CellState, CellValue } from '../../types/index.ts';
//@ts-ignore
import { MAX_ROWS, MAX_COLS, NUMS_MINES } from '../../constants/index.ts';
import './App.scss';
import useLocalStorage from 'use-local-storage';

const App: FC = () => {
  const [level, setLevel] = useState<string>('easy');
  const [cells, setCells] = useState<Cell[][]>(generateCells(level));
  const [face, setFace] = useState<Face>(Face.smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [mines, setMines] = useState<number>(NUMS_MINES[level]);
  const [hasLost, setHasLost] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);

  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useLocalStorage(
    'theme',
    defaultDark ? 'dark' : 'light'
  );

  const switchTheme = (): void => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  useEffect(() => {
    const handleMouseDown = (e: any): void => {
      if (e.target.className.substr(0, 6) === 'Button') setFace(Face.oh);
    };
    const handleMouseUp = (e: any): void => {
      if (e.target.className.substr(0, 6) === 'Button') setFace(Face.smile);
    };
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (live && time < 999 && !hasLost && !hasWon) {
      const timer = setInterval(() => {
        setTime(time + 1);
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [live, time, hasLost, hasWon]);

  useEffect(() => {
    if (hasWon) {
      setFace(Face.won);
      setLive(false);
    }
  }, [hasWon]);

  useEffect(() => {
    if (hasLost) {
      setFace(Face.lost);
      setLive(false);
    }
  }, [hasLost]);

  const handleCellClick = (rowParam: number, colParam: number) => () => {
    let newCells = cells.slice();
    if (!live) {
      let isANone = newCells[rowParam][colParam].value === CellValue.none;
      while (!isANone) {
        newCells = generateCells(level);
        if (newCells[rowParam][colParam].value === CellValue.none) {
          isANone = true;
          break;
        }
      }

      setLive(true);
    }

    const currCell = newCells[rowParam][colParam];

    if (
      currCell.state === CellState.flagged ||
      currCell.state === CellState.visible
    )
      return;
    if (currCell.value === CellValue.bomb) {
      newCells[rowParam][colParam].red = true;
      setHasLost(true);
      showAllBombs();
      return;
    } else if (currCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam, colParam);
    } else {
      newCells[rowParam][colParam].state = CellState.visible;
    }

    let safeOpenCells = false;
    for (let r = 0; r < MAX_ROWS[level]; r++) {
      for (let c = 0; c < MAX_COLS[level]; c++) {
        if (
          newCells[r][c].value !== CellValue.bomb &&
          newCells[r][c].state === CellState.open
        ) {
          safeOpenCells = true;
          break;
        }
      }
    }
    if (!safeOpenCells) {
      setHasWon(true);
      showAllFlags();
    }

    setCells(newCells);
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
    };

  const handleFaceClick = (): void => {
    setFace(Face.smile);
    setHasLost(false);
    setHasWon(false);
    setLive(false);
    setTime(0);
    setMines(NUMS_MINES[level]);
    setCells(generateCells(level));
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
          red={cell.red}
        />
      ))
    );

  const showAllBombs = (): Cell[][] => {
    const newCells = cells.slice();
    newCells.map((row, rowIdx) =>
      row.map((cell, colIdx) => {
        if (cell.value === CellValue.bomb) cell.state = CellState.visible;
        return cell;
      })
    );
    return newCells;
  };

  const showAllFlags = (): Cell[][] => {
    const newCells = cells.slice();
    newCells.map((row, rowIdx) =>
      row.map((cell, colIdx) => {
        if (cell.value === CellValue.bomb) cell.state = CellState.flagged;
        return cell;
      })
    );
    return newCells;
  };

  const handleLevelChange = (level: string): void => {
    setLevel(level);
    const newCells = generateCells(level);
    const newMines = NUMS_MINES[level];
    setCells(newCells);
    setMines(newMines);
    setLive(false);
    setTime(0);
  };

  return (
    <div className="Container" data-theme={theme}>
      <button className="toggleDark" onClick={switchTheme}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode{' '}
      </button>
      <Level onClick={handleLevelChange} />
      <div className="App">
        <div className="Header">
          <NumberDisplay value={mines} />
          <div className="Face" onClick={handleFaceClick}>
            <span role="img" aria-label="face">
              {face}
            </span>
          </div>
          <NumberDisplay value={time} />
        </div>

        <div className={`Body ${level}`}>{renderCells()}</div>
      </div>
    </div>
  );
};

export default App;
