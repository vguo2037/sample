import React from 'react';
import GameCell from './GameCell';

interface GamePanelProps {
  disabled: boolean
};

const GamePanel: React.FC<GamePanelProps> = ({ disabled }) => {
  return (<>
    <div className={"game-grid"}>
      {[0, 1, 2].map(row => {
        return [0, 1, 2].map(col => (
          <GameCell disabled={disabled} key={`cell-${row}-${col}`}
            row={row} col={col} id={`cell-${row}-${col}`}
          />
        ));
      })}
    </div>
  </>);
};

export default GamePanel;
