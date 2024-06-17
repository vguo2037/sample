import { Board, CellMove, GameMode, GameOutcomeChecker, GameStatus, NPCDifficulty, NPCStrategyInput, OutcomeStartingCell, PlayerMark } from "./types";

export const noop = () => {};

export const startGame = (
  mode: GameMode,
  { setGameMode, resetHistory, currentPlayer, switchCurrentPlayer, setNpcDifficulty }: GameStatus,
  difficulty: NPCDifficulty = 0
) => {
  setNpcDifficulty(difficulty);
  setGameMode(mode);
  if (currentPlayer !== "X") switchCurrentPlayer();
  resetHistory();
};

const npcStrategyRandom = ({ board }: NPCStrategyInput) => {
  const emptyCells: number[][] = [];

  for (let i=0; i<board.length; i++) for (let j=0; j<board[0].length; j++) {
    if (!board[i][j]) emptyCells.push([i, j]);
  };

  if (emptyCells.length === 0) {
    throw new Error("Error in computation. No valid moves can be made.");
  };
  const chosenIndex = Math.floor(Math.random() * emptyCells.length);

  return emptyCells[chosenIndex];
};

const checkWinnable = (board: Board, row: number, col: number) => {
  if (board[row][col]) return null; // cell already filled
  const boardCopy = JSON.parse(JSON.stringify(board));

  boardCopy[row][col] = "O";
  const simulatedSelfMove = checkMoveOutcome(boardCopy, { row, col, mark: "O" });
  if (simulatedSelfMove === "lose") return "O"; // losing for player means winning for NPC

  boardCopy[row][col] = "X";
  const simulatedOpponentMove = checkMoveOutcome(boardCopy, { row, col, mark: "X" });
  if (simulatedOpponentMove === "win") return "X";

  return null;
};

const npcStrategyTactical = ({ board }: NPCStrategyInput) => {
  let winnableOpponent = null;

  // check winnable cells
  for (let i=0; i<board.length; i++) for (let j=0; j<board[0].length; j++) {
    const winnable: PlayerMark | null = checkWinnable(board, i, j);
    if (winnable === "O") return [i, j]; // win game
    if (winnable === "X") winnableOpponent = [i, j];
  };

  // if opponent about to win, stop them
  if (winnableOpponent) return winnableOpponent;

  // pick center
  if (!board[1][1]) return [1, 1];

  // pick any cell
  return npcStrategyRandom({ board });
};

export const makeNpcMove = ({ board, npcDifficulty, handleCellSelect }: GameStatus) => {
  let chosenCell: number[] = [];
  switch (npcDifficulty) {
    case 1:
      chosenCell = npcStrategyRandom({ board });
      break;
    case 2:
      chosenCell = npcStrategyTactical({ board });
      break;
    default:
      return;
  };
  console.log("chosenCell", chosenCell)
  handleCellSelect({ row: chosenCell[0], col: chosenCell[1], mark: "O" });
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
