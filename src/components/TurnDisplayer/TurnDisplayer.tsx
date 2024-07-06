import React, { useContext } from "react";
import { GameStatusContext, SettingsContext } from "../../utils";
import { reverseMark, winningOutcome } from "../../utils/gameControl";

interface TurnDisplayerProps {
  isNpcTurn: boolean
};

const TurnDisplayer: React.FC<TurnDisplayerProps> = ({ isNpcTurn }) => {
  const { gameMode, gameOutcome, currentPlayer } = useContext(GameStatusContext);
  const { nickname, playerPlayAs } = useContext(SettingsContext);

  if (gameMode === "ended") {
    switch (gameOutcome) {
      case "xWin":
      case "oWin":
        const playerWins = winningOutcome(playerPlayAs, gameOutcome);
        return <p>{nickname} {playerWins ? "win" : "lose"}s!</p>;
      case "draw":
        return <p>It's a draw!</p>;
      default:
        return null;
    }
  };

  if (gameMode !== "none") {
    if (isNpcTurn) return <p>NPC ({reverseMark(playerPlayAs)}) is thinking…</p>;
    else if (gameMode === "NPC") return <p>It's your ({playerPlayAs}) turn!</p>
    else return <p>It is Player {currentPlayer}'s turn!</p>;
  };

  return null;
};

export default TurnDisplayer;
