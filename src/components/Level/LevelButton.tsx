import React, { FC } from 'react';

interface LevelButtonProps {
  onClick(name: string): (name: string) => void;
  name: string;
}

const LevelButton: FC<LevelButtonProps> = ({ onClick, name }) => {
  const handleClick = () => {
    onClick(name);
  };
  return (
    <div className="LevelButton" onClick={handleClick}>
      {name}
    </div>
  );
};

export default LevelButton;
