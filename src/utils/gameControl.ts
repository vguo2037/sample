import { GameStatus } from "./types";

export const noop = () => {};

export const continueGame = () => {}; // TODO

export const setupNewGame = (gameStatusContext: GameStatus) => {
  const {
    currentPlayer, switchCurrentPlayer,
  } = gameStatusContext;
  if (currentPlayer !== "X") switchCurrentPlayer();

  // TODO clearBoard();
};
