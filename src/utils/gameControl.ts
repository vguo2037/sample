import { Board, BoardSize, CellCoords, CellMove, CellWinnableCheckInputs, GameOutcome, GameOutcomeChecker, GameStarter, GameStatus, MoveOutcomeChecker, NpcStrategiesList, NPCStrategy, PlayerMark, WinType } from "./types";
import * as gc from "./gameControl";

export const noop = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function

export const reverseMark = (mark: PlayerMark) => mark === "X" ? "O" : "X";

export const winningOutcome = (playAs: PlayerMark, outcome: GameOutcome) => {
  if (playAs === "X" && outcome === "xWin") return true;
  if (playAs === "O" && outcome === "oWin") return true;
  return false;
};

export const startGame: GameStarter = ({
  mode, difficulty = 0, boardSize,
  gameStatusContext: {
    setGameMode, currentPlayer, switchCurrentPlayer, setNpcDifficulty, resetHistory
  }
}) => {
  resetHistory(boardSize);
  setNpcDifficulty(difficulty);
  if (currentPlayer !== "X") switchCurrentPlayer();
  setGameMode(mode);
};

export const npcStrategyRandom: NPCStrategy = ({ board, npcPlayAs }) => {
  const emptyCells: number[][] = [];

  for (let i=0; i<board.length; i++) for (let j=0; j<board[0].length; j++) {
    if (!board[i][j]) emptyCells.push([i, j]);
  }

  if (emptyCells.length === 0) {
    throw new Error("Error in computation. No valid moves can be made.");
  }
  const chosenIndex = Math.floor(Math.random() * emptyCells.length);
  const chosenCellCoords = emptyCells[chosenIndex];

  return { row: chosenCellCoords[0], col: chosenCellCoords[1], mark: npcPlayAs };
};

const checkCellWinnable = ({ board, row, col, playAs }: CellWinnableCheckInputs) => {
  if (board[row][col]) return null; // cell already filled
  const boardCopy = JSON.parse(JSON.stringify(board));
  const opponentPlayAs = reverseMark(playAs);

  boardCopy[row][col] = playAs;
  const simulatedSelfMove = checkMoveOutcome(boardCopy, { row, col, mark: playAs });
  if (winningOutcome(playAs, simulatedSelfMove.gameOutcome)) return playAs;

  boardCopy[row][col] = opponentPlayAs;
  const simulatedOpponentMove = checkMoveOutcome(boardCopy, { row, col, mark: opponentPlayAs });
  if (winningOutcome(opponentPlayAs, simulatedOpponentMove.gameOutcome)) return opponentPlayAs;

  return null;
};

export const getWinningCells = (wins: WinType[], lastMove: CellMove, boardSize: BoardSize) => {
  const winningCells: CellCoords[] = [];
  for (const w of wins) {
    switch (w) {
      case "rowWin":
        for (let i=0; i<boardSize; i++) winningCells.push({ row: lastMove.row, col: i });
        break;
      case "colWin":
        for (let i=0; i<boardSize; i++) winningCells.push({ row: i, col: lastMove.col });
        break;
      case "principDiagWin":
        for (let i=0; i<boardSize; i++) winningCells.push({ row: i, col: i });
        break;
      case "secondDiagWin":
        for (let i=0; i<boardSize; i++) winningCells.push({ row: i, col: boardSize-1-i });
        break;
    }
  }

  return winningCells;
};

export const npcStrategyTactical: NPCStrategy = ({ board, npcPlayAs }) => {
  const boardSize = board.length;
  let winnableOpponent: number[] | null = null, chosenCellCoords: number[] | null = null;

  // check winnable cells
  for (let row=0; row<board.length; row++) for (let col=0; col<board[0].length; col++) {
    const winnable: PlayerMark | null = checkCellWinnable({ board, row, col, playAs: npcPlayAs });
    if (winnable === npcPlayAs) {
      chosenCellCoords = [row, col]; // win game
      break;
    }
    if (winnable === reverseMark(npcPlayAs)) winnableOpponent = [row, col];
  }

  // if cell not chosen and if opponent about to win, stop them
  if (!chosenCellCoords && winnableOpponent) chosenCellCoords = winnableOpponent;

  // if cell not chosen, try to pick center
  const center = Math.floor(boardSize / 2);
  if (!chosenCellCoords && !board[center][center]) chosenCellCoords = [center, center];

  // return value
  if (chosenCellCoords) return { row: chosenCellCoords[0], col: chosenCellCoords[1], mark: npcPlayAs };

  // pick any cell
  return gc.npcStrategyRandom({ board, npcPlayAs });
};

export const makeNpcMove = (
  { board, npcDifficulty, handleCellSelect }: GameStatus,
  npcPlayAs: PlayerMark,
  npcStrategies: NpcStrategiesList = { 1: npcStrategyRandom, 2: npcStrategyTactical }
) => {
  const strategy = npcStrategies[npcDifficulty];

  if (!strategy || typeof strategy !== "function") {
    throw new Error("Invalid npcDifficulty entered.");
  }

  handleCellSelect(strategy({ board, npcPlayAs }));
};

const checkDiagWin: MoveOutcomeChecker = ({ board, currentRow, currentCol, currentPlayer }) => {
  if ((currentRow + currentCol) % (board.length-1) > 0) return []; // current cell not on diagonals

  const center = Math.floor(board.length / 2);
  if (board[center][center] !== currentPlayer) return [];

  // check principal diagonal
  let principalWin = true;
  for (let i=0; i<board.length; i++) {
    if (board[i][i] !== currentPlayer) {
      principalWin = false;
      break;
    }
  }

  // check secondary diagonal
  let secondaryWin = true;
  for (let i=0; i<board.length; i++) {
    if (board[i][board.length-1-i] !== currentPlayer) {
      secondaryWin = false;
      break;
    }
  }

  const wins: WinType[] = [];
  if (principalWin) wins.push("principDiagWin");
  if (secondaryWin) wins.push("secondDiagWin");
  return wins;
};

const checkRowWin: MoveOutcomeChecker = ({ board, currentPlayer, currentRow }) => {
  for (let col=0; col<board[0].length; col++) {
    if (board[currentRow][col] !== currentPlayer) return [];
  }
  return ["rowWin"];
};

const checkColWin: MoveOutcomeChecker = ({ board, currentPlayer, currentCol }) => {
  for (let row=0; row<board.length; row++) {
    if (board[row][currentCol] !== currentPlayer) return [];
  }
  return ["colWin"];
};

export const checkMoveOutcome: GameOutcomeChecker = (board: Board, currentMove: CellMove) => {
  const { row: currentRow, col: currentCol, mark: currentPlayer } = currentMove;
  const currentOutcomeStartingCell = { board, currentRow, currentCol, currentPlayer };

  const wins = [checkDiagWin, checkRowWin, checkColWin].flatMap(
    (checkWin) => checkWin(currentOutcomeStartingCell)
  );

  if (wins.length) {
    // displayWin(board, wins, currentMove);
    const gameOutcome = currentPlayer === "X" ? "xWin" : "oWin";
    return { gameOutcome, wins };
  }

  for (let i=0; i<board.length; i++) for (let j=0; j<board[0].length; j++) {
    if (!board[i][j]) return { gameOutcome: "none", wins: [] }; // game has not yet ended
  }

  return { gameOutcome: "draw", wins: [] };
};
