import { createContext, useState } from "react";

type GameStats = {
  score: number,
  addScore: Function,
  resetScore: Function
};

export const GameContext = createContext<GameStats | null>(null);
export const useGameValues = () => {
  const [score, setScore] = useState<number>(0);

  const addScore = () => setScore(s => s + 1);
  const resetScore = () => setScore(0);

  return { score, addScore, resetScore };
};
