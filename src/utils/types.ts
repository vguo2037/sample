export type Settings = {
  darkMode: boolean,
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>,
  nickname: string,
  setNickname: React.Dispatch<React.SetStateAction<string>>,
  playerPlayAs: PlayerMark,
  setPlayerPlayAs: React.Dispatch<React.SetStateAction<PlayerMark>>
};

export type StyleOverride = Pick<Settings, "darkMode"> | undefined;

export type GameMode = "NPC" | "multiplayer" | "ended" | "none";
export type PlayerMark = "X" | "O";
export type GameOutcome = "xWin" | "oWin" | "draw" | "none";
export type Board = Array<Array<PlayerMark | null>>;
export type NPCDifficulty = 0 | 1 | 2;

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
  npcDifficulty: NPCDifficulty,
  setNpcDifficulty: React.Dispatch<React.SetStateAction<NPCDifficulty>>
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

export type NPCStrategyInput = {
  board: Board,
  npcPlayAs: PlayerMark
};

export type CellWinnableCheckInputs = {
  board: Board,
  row: number,
  col: number,
  playAs: PlayerMark
};