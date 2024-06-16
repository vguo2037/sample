import { createContext, useState } from "react";
import type { GameMode, GameOutcome, PlayerTurn, GameStatus } from "../types";
import { noop } from "../gameControl";

export const GameStatusContext = createContext<GameStatus>({ 
  score: 0, addScore: noop, resetScore: noop,
  currentPlayer: "X", switchCurrentPlayer: noop,
  gameMode: "none", setGameMode: noop,
  gameOutcome: "none", setGameOutcome: noop
});

export const useGameStatusValues = () => {
  const [score, setScore] = useState<number>(0);
  const [currentPlayer, setCurrentPlayer] = useState<PlayerTurn>("X");
  const [gameMode, setGameMode] = useState<GameMode>("none");
  const [gameOutcome, setGameOutcome] = useState<GameOutcome>("none");

  const addScore = () => setScore(s => s + 1);
  const resetScore = () => setScore(0);

  const switchCurrentPlayer = () => {
    if (currentPlayer !== "X") setCurrentPlayer("X");
    else setCurrentPlayer("O");
  };

  return {
    score, addScore, resetScore,
    currentPlayer, switchCurrentPlayer,
    gameMode, setGameMode,
    gameOutcome, setGameOutcome
  };
};
