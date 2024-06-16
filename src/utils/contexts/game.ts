import { createContext, useState } from "react";
import type { GameStatistics } from "../types";

export const GameContext = createContext<GameStatistics | null>(null);
export const useGameValues = () => {
  const [score, setScore] = useState<number>(0);

  const addScore = () => setScore(s => s + 1);
  const resetScore = () => setScore(0);

  return { score, addScore, resetScore };
};
