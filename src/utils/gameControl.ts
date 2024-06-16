import { GameStatus } from "./types";

export const noop = () => {};

export const continueGame = () => {}; // TODO

export const setupNewGame = (gameStatusContext: GameStatus) => {
  const {
    currentPlayer, switchCurrentPlayer, resetBoard
  } = gameStatusContext;
  if (currentPlayer !== "X") switchCurrentPlayer();

  resetBoard();
};

export const handleWin = ({ addScore, setGameMode, setGameOutcome }: GameStatus) => {
  addScore();
  setGameMode("ended");
  setGameOutcome("win");
};

export const handleLose = ({ setGameMode, setGameOutcome }: GameStatus) => {
  setGameMode("ended");
  setGameOutcome("lose");
};
