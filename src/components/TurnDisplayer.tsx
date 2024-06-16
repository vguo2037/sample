import React, { useContext } from "react";
import { GameStatusContext, SettingsContext } from "../utils";

interface TurnDisplayerProps {
  isNPCTurn: boolean
};

const TurnDisplayer: React.FC<TurnDisplayerProps> = ({ isNPCTurn }) => {
  const { gameMode, gameOutcome, currentPlayer } = useContext(GameStatusContext);
  const { nickname } = useContext(SettingsContext);

  if (gameMode === "ended") {
    switch (gameOutcome) {
      case "win":
      case "lose":
        return <p>{nickname} {gameOutcome}s!</p>;
      case "draw":
        return <p>It's a draw!</p>;
      default:
        return null;
    }
  };

  if (gameMode !== "none") {
    if (isNPCTurn) return <p>NPC is thinking…</p>;
    else return <p>It is Player {currentPlayer}'s turn!</p>;
  };

  return null;
};

export default TurnDisplayer;
