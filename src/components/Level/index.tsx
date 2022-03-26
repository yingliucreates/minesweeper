import React, { FC } from 'react';
//@ts-ignore
import LevelButton from './LevelButton.tsx';
import './Level.scss';

interface LevelProps {
  onClick(name: string): (name: string) => void;
}

const Level: FC<LevelProps> = ({ onClick }) => {
  return (
    <div className="Level">
      <LevelButton name="easy" onClick={onClick} />
      <LevelButton name="medium" onClick={onClick} />
      <LevelButton name="hard" onClick={onClick} />
    </div>
  );
};

export default Level;
