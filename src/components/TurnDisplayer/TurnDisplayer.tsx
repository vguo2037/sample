// turn/win status displayed above gamePanel

import React, { useContext } from "react";
import { GameStatusContext, SettingsContext } from "../../utils";
import { reverseMark, winningOutcome } from "../../utils/gameControl";

const TurnDisplayer = () => {
  const { gameMode, gameOutcome, currentPlayer } = useContext(GameStatusContext);
  const { nickname, playerPlayAs } = useContext(SettingsContext);

  const isNpcTurn = gameMode === "NPC" && currentPlayer !== playerPlayAs;

  if (gameMode === "ended") {
    switch (gameOutcome) {
      case "xWin":
      case "oWin":
        // eslint-disable-next-line no-case-declarations
        const playerWins = winningOutcome(playerPlayAs, gameOutcome);
        return <p>{nickname} {playerWins ? "win" : "lose"}s!</p>;
      case "draw":
        return <p>It&apos;s a draw!</p>;
      default:
        return null;
    }
  }

  if (gameMode !== "none") {
    if (isNpcTurn) return <p>NPC ({reverseMark(playerPlayAs)}) is thinking…</p>;
    else if (gameMode === "NPC") return <p>It&apos;s your ({playerPlayAs}) turn!</p>
    else return <p>It is Player {currentPlayer}&apos;s turn!</p>;
  }

  return null;
};

export default TurnDisplayer;
