import React from 'react';
import GameCell from './GameCell';

interface GamePanelProps {
  isNPCTurn: boolean
};

const GamePanel: React.FC<GamePanelProps> = ({ isNPCTurn }) => {
  return (<>
    <div className={"game-grid"}>
      {[0, 1, 2].map(row => {
        return [0, 1, 2].map(col => (
          <GameCell disabled={isNPCTurn} key={`cell-${row}-${col}`}
            row={row} col={col} id={`cell-${row}-${col}`}
          />
        ));
      })}
    </div>
  </>);
};

export default GamePanel;
