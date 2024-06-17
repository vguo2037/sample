import React, { useContext } from 'react';
import { GameStatusContext, SettingsContext } from '../utils';
import { PlayerMark } from '../utils/types';
import { ImCross } from "react-icons/im";
import { RiRadioButtonFill } from "react-icons/ri";

interface GameCellProps {
  row: number;
  col: number;
  id: string;
  disabled: boolean;
}

const GameCell: React.FC<GameCellProps> = ({ row, col, id, disabled }) => {
  const {
    currentPlayer, gameMode, handleCellSelect, board
  } = useContext(GameStatusContext);
  const cellMark = board[row][col];

  const { darkMode } = useContext(SettingsContext);
  const bgColor = darkMode ? "bg-dark" : "bg-light";
  const textColor = darkMode ? "text-light" : "text-dark";

  const handleSelect = () => {
    if (!currentPlayer) {
      alert("Error detecting current player.");
      return;
    }
    handleCellSelect({row, col, mark: currentPlayer});
  };

  const displayCellMark = (mark: PlayerMark | null) => {
    switch (mark) {
      case "X":
        return <ImCross size={24} />;
      case "O":
        return <RiRadioButtonFill size={24} />;
      default:
        return null;
    };
  };

  return (<>
    <button className={`game-cell center-children ${bgColor} ${textColor}`} id={id}
      onClick={handleSelect} disabled={disabled || Boolean(cellMark) || gameMode === "ended"}
    >
      {displayCellMark(cellMark)}
    </button>
  </>);
};

export default GameCell;
