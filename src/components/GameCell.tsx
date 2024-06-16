import React, { useContext } from 'react';
import { GameStatusContext, SettingsContext } from '../utils';

interface GameCellProps {
  row: number;
  col: number;
  id: string;
}

const GameCell: React.FC<GameCellProps> = ({ row, col, id }) => {
  const {
    currentPlayer, gameMode, handleCellSelect, board
  } = useContext(GameStatusContext);
  const cellValue = board[row][col];

  const { darkMode } = useContext(SettingsContext);
  const cellColor = darkMode ? "bg-dark" : "bg-light";
  const textColor = darkMode ? "text-light" : "text-dark";

  const handleSelect = () => {
    if (!currentPlayer) {
      alert("Error detecting current player.");
      return;
    }
    handleCellSelect({row, col, player: currentPlayer});
  };

  return (<>
    <button className={`game-cell center-children ${cellColor} ${textColor}`} id={id} key={id}
      onClick={handleSelect} disabled={Boolean(cellValue) || gameMode === "ended"}
    >
      {cellValue}
    </button>
  </>);
};

export default GameCell;
