import React, { FC } from 'react';
import './Display.scss';

interface NumberDisplayProps {
  value: number;
}

const NumberDiplay: FC<NumberDisplayProps> = ({ value }) => {
  return (
    <div className="NumberDisplay">{value.toString().padStart(3, '0')}</div>
  );
};

export default NumberDiplay;
