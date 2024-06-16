import React from 'react';

interface GameCellProps {
  row: number;
  col: number;
  id: string;
}

const GameCell: React.FC<GameCellProps> = ({ row, col, id }) => {
  return (<div className='game-cell' id={id}>
    {row},{col}
  </div>);
};

export default GameCell;
