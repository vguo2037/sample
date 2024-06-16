import React, { useContext } from 'react';
import GameCell from './GameCell';
import { SettingsContext } from '../utils';

const GamePanel = () => {
  const settingsContext = useContext(SettingsContext);
  const backLineColor = settingsContext?.darkMode ? "bg-light" : "bg-dark";

  return (<>
    <div className={`game-grid ${backLineColor}`}>
      {[0, 1, 2].map(row => {
        return [0, 1, 2].map(col => (
          <GameCell
            row={row} col={col} id={`cell-${row}-${col}`}
          />
        ));
      })}
    </div>
  </>);
};

export default GamePanel;
