import { Board, CellMove, GameMode, GameOutcomeChecker, GameStatus, OutcomeStartingCell } from "./types";

export const noop = () => {};

export const startGame = (
  mode: GameMode,
  { setGameMode, resetHistory, currentPlayer, switchCurrentPlayer }: GameStatus
) => {
  setGameMode(mode);
  if (currentPlayer !== "X") switchCurrentPlayer();
  resetHistory();
};

export const makeNPCmove = ({ board, handleCellSelect }: GameStatus) => {

  // TODO make strategy for diff lvl NPCs

  const emptyCells = [];

  for (let i=0; i<board.length; i++) for (let j=0; j<board[0].length; j++) {
    if (!board[i][j]) emptyCells.push(`${i},${j}`);
  }

  if (emptyCells.length === 0) return;
  const chosenIndex = Math.floor(Math.random() * emptyCells.length);
  const chosenCell = emptyCells[chosenIndex].split(",");
  handleCellSelect({ row: Number.parseInt(chosenCell[0]), col: Number.parseInt(chosenCell[1]), mark: "O" });
};

const checkDiagWin = ({ board, currentRow, currentCol, currentPlayer }: OutcomeStartingCell) => {
  if ((currentRow + currentCol) % 2 > 0) return false; // current cell not on diagonals
  if (board[1][1] !== currentPlayer) return false;

  // check principal diagonal
  if (board[0][0] === currentPlayer && board[2][2] === currentPlayer) return true;
  
  // check secondary diagonal
  if (board[0][2] === currentPlayer && board[2][0] === currentPlayer) return true;

  return false;
};

const checkRowWin = ({ board, currentPlayer, currentRow }: OutcomeStartingCell) => {
  for (let col=0; col<board[0].length; col++) {
    if (board[currentRow][col] !== currentPlayer) return false;
  };
  
  return true;
};

const checkColWin = ({ board, currentPlayer, currentCol }: OutcomeStartingCell) => {
  for (let row=0; row<board.length; row++) {
    if (board[row][currentCol] !== currentPlayer) return false;
  };
  
  return true;
};

export const checkMoveOutcome: GameOutcomeChecker = (
  board: Board,
  { row: currentRow, col: currentCol, mark: currentPlayer }: CellMove
) => {
  const currentOutcomeStartingCell = { board, currentRow, currentCol, currentPlayer };

  if (
    checkDiagWin(currentOutcomeStartingCell) ||
    checkRowWin(currentOutcomeStartingCell) ||
    checkColWin(currentOutcomeStartingCell)
  ) return currentPlayer === "X" ? "win" : "lose";

  for (let i=0; i<board.length; i++) for (let j=0; j<board[0].length; j++) {
    if (!board[i][j]) return "none"; // game has not yet ended
  };

  return "draw";
};
