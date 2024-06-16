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

export const makeNPCmove = ({ board, handleCellSelect }: GameStatus) => {
  const emptyCells = [];

  for (let i=0; i<board.length; i++) for (let j=0; j<board[0].length; j++) {
    if (!board[i][j]) emptyCells.push(`${i},${j}`);
  }

  if (emptyCells.length === 0) return;
  const chosenIndex = Math.floor(Math.random() * emptyCells.length);
  const chosenCell = emptyCells[chosenIndex].split(",");
  handleCellSelect({ row: Number.parseInt(chosenCell[0]), col: Number.parseInt(chosenCell[1]), player: "O" });
};
