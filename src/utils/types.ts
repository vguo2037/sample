export type Settings = {
  darkMode: boolean,
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>,
  nickname: string,
  setNickname: React.Dispatch<React.SetStateAction<string>>
};

export type GameMode = "NPC" | "multiplayer" | "ended" | "none";
export type PlayerMark = "X" | "O";
export type GameOutcome = "win" | "lose" | "draw" | "none";
export type Board = Array<Array<PlayerMark | null>>;

export type GameStatus = {
  score: number,
  addScore: () => void,
  resetScore: () => void,
  currentPlayer: PlayerMark,
  switchCurrentPlayer: () => void,
  gameMode: GameMode,
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>,
  gameOutcome: GameOutcome,
  setGameOutcome: React.Dispatch<React.SetStateAction<GameOutcome>>,
  board: Board,
  handleCellSelect: (move: CellMove) => void,
  resetHistory: () => void,
  pastMoves: Array<CellMove>,
  undoMove: () => void
};

export type CellMove = {
  row: number,
  col: number,
  mark: Exclude<PlayerMark, undefined>
};

export type OutcomeStartingCell = {
  currentRow: number,
  currentCol: number,
  currentPlayer: PlayerMark,
  board: Board
};

export type GameOutcomeChecker = (
  board: Board,
  { row, col, mark }: CellMove
) => GameOutcome;
