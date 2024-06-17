import { Board, CellMove, CellWinnableCheckInputs, GameMode, GameOutcome, GameOutcomeChecker, GameStatus, NPCDifficulty, NPCStrategyInput, OutcomeStartingCell, PlayerMark } from "./types";

export const noop = () => {};

export const reverseMark = (mark: PlayerMark) => mark === "X" ? "O" : "X";

export const winningOutcome = (playAs: PlayerMark, outcome: GameOutcome) => {
  if (playAs === "X" && outcome === "xWin") return true;
  if (playAs === "O" && outcome === "oWin") return true;
  return false;
};

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

const checkCellWinnable = ({ board, row, col, playAs }: CellWinnableCheckInputs) => {
  if (board[row][col]) return null; // cell already filled
  const boardCopy = JSON.parse(JSON.stringify(board));
  const opponentPlayAs = reverseMark(playAs);

  boardCopy[row][col] = playAs;
  const simulatedSelfMove = checkMoveOutcome(boardCopy, { row, col, mark: playAs });
  if (winningOutcome(playAs, simulatedSelfMove)) return playAs;

  boardCopy[row][col] = opponentPlayAs;
  const simulatedOpponentMove = checkMoveOutcome(boardCopy, { row, col, mark: opponentPlayAs });
  if (winningOutcome(opponentPlayAs, simulatedOpponentMove)) return opponentPlayAs;

  return null;
};

const npcStrategyTactical = ({ board, npcPlayAs }: NPCStrategyInput) => {
  let winnableOpponent = null;

  // check winnable cells
  for (let row=0; row<board.length; row++) for (let col=0; col<board[0].length; col++) {
    const winnable: PlayerMark | null = checkCellWinnable({ board, row, col, playAs: npcPlayAs });
    if (winnable === npcPlayAs) return [row, col]; // win game
    if (winnable === reverseMark(npcPlayAs)) winnableOpponent = [row, col];
  };

  // if opponent about to win, stop them
  if (winnableOpponent) return winnableOpponent;

  // pick center
  if (!board[1][1]) return [1, 1];

  // pick any cell
  return npcStrategyRandom({ board, npcPlayAs });
};

export const makeNpcMove = (
  { board, npcDifficulty, handleCellSelect }: GameStatus,
  npcPlayAs: PlayerMark
) => {
  let chosenCell: number[] = [];
  switch (npcDifficulty) {
    case 1:
      chosenCell = npcStrategyRandom({ board, npcPlayAs });
      break;
    case 2:
      chosenCell = npcStrategyTactical({ board, npcPlayAs });
      break;
    default:
      return;
  };
  handleCellSelect({ row: chosenCell[0], col: chosenCell[1], mark: npcPlayAs });
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
  ) return currentPlayer === "X" ? "xWin" : "oWin";

  for (let i=0; i<board.length; i++) for (let j=0; j<board[0].length; j++) {
    if (!board[i][j]) return "none"; // game has not yet ended
  };

  return "draw";
};
