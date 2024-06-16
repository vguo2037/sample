import React, { useContext, useState } from 'react';
import { GameStatusContext, SettingsContext } from '../utils';
import { PlayerTurn } from '../utils/types';

interface GameCellProps {
  row: number;
  col: number;
  id: string;
  cellSelect: Function;
}

const GameCell: React.FC<GameCellProps> = ({ row, col, id, cellSelect }) => {
  const gameStatusContext = useContext(GameStatusContext);
  const [playerSelection, setPlayerSelection] = useState<PlayerTurn>();

  const { darkMode } = useContext(SettingsContext);
  const cellColor = darkMode ? "bg-dark" : "bg-light";
  const textColor = darkMode ? "text-light" : "text-dark";

  const handleSelect = () => {
    if (!gameStatusContext?.currentPlayer) {
      alert("Error detecting current player.");
      return;
    }

    setPlayerSelection(gameStatusContext.currentPlayer);
    cellSelect(gameStatusContext.currentPlayer);
  }

  return (<>
    <button className={`game-cell center-children ${cellColor} ${textColor}`} id={id}
      onClick={handleSelect} disabled={Boolean(playerSelection)}
    >
      {playerSelection}
    </button>
  </>);
};

export default GameCell;
