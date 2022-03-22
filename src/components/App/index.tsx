import React, { FC } from 'react';
//@ts-ignore
import NumberDiplay from '../Display/index.tsx';
import './App.scss';

const App: FC = () => {
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
      <div className="Body">Body</div>
    </div>
  );
};

export default App;
