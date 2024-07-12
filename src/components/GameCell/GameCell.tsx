// display of one cell in the game grid

import React, { forwardRef, useContext, useImperativeHandle, useState } from "react";
import type { GameCellObject, PlayerMark } from "../../utils/types";
import { GameStatusContext, SettingsContext } from "../../utils";
import { ImCross } from "react-icons/im";
import { RiRadioButtonFill } from "react-icons/ri";
const X_WIN_DISPLAY = `${process.env.PUBLIC_URL}/xWinDisplay.gif`;
const O_WIN_DISPLAY = `${process.env.PUBLIC_URL}/oWinDisplay.gif`;

interface GameCellProps {
  row: number;
  col: number;
  id: string;
}

const GameCell = forwardRef<GameCellObject, GameCellProps>(({ row, col, id }, ref) => {
  const {
    currentPlayer, gameMode, handleCellSelect, board
  } = useContext(GameStatusContext);
  const cellMark = board[row][col];

  const { darkMode, playerPlayAs } = useContext(SettingsContext);
  const bgColor = darkMode ? "bg-dark" : "bg-light";
  const textColor = darkMode ? "text-light" : "text-dark";

  const [isWinningCell, setIsWinningCell] = useState(false); // differing display for cells that caused game win/lose

  // conditions for cell being disabled
  const isNpcTurn = gameMode === "NPC" && currentPlayer !== playerPlayAs;
  const isFilled = Boolean(cellMark);
  const gameEnded = gameMode === "ended";
  const disabled = isNpcTurn || isFilled || gameEnded;

  // exposing this function to gamePanel for centralised winning cell display coordination
  useImperativeHandle(ref, () => ({ setIsWinningCell }));

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
        return isWinningCell
          ? <img src={X_WIN_DISPLAY} alt="x winning animation" />
          : <ImCross size={24} />
        ;
        case "O":
          return isWinningCell
            ? <img src={O_WIN_DISPLAY} alt="o winning animation" />
            : <RiRadioButtonFill size={24} />
          ;
      default:
        return null;
    }
  };

  return (<>
    <button
      id={id} data-testid={isWinningCell ? "winning-cell" : ""}
      className={`game-cell center-children ${bgColor} ${textColor}`}
      onClick={handleSelect} disabled={disabled}
    >
      {displayCellMark(cellMark)}
    </button>
  </>);
});

GameCell.displayName = "GameCell";

export default GameCell;
