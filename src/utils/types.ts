export type Settings = {
  darkMode: boolean,
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>,
  nickname: string,
  setNickname: React.Dispatch<React.SetStateAction<string>>,
  playerPlayAs: PlayerMark,
  setPlayerPlayAs: React.Dispatch<React.SetStateAction<PlayerMark>>,
  boardSize: BoardSize,
  setBoardSize: React.Dispatch<React.SetStateAction<BoardSize>>
};

export type StyleOverride = Pick<Settings, "darkMode"> | undefined;

export type GameMode = "NPC" | "multiplayer" | "ended" | "none";
export type PlayerMark = "X" | "O";
export type GameOutcome = "xWin" | "oWin" | "draw" | "none";
export type Board = Array<Array<PlayerMark | null>>;
export type NPCDifficulty = 0 | 1 | 2;
export type BoardSize = 3 | 5 | 7;

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
  resetHistory: (newBoardSize: BoardSize) => void,
  pastMoves: Array<CellMove>,
  undoMove: () => void
  npcDifficulty: NPCDifficulty,
  setNpcDifficulty: React.Dispatch<React.SetStateAction<NPCDifficulty>>,
  wins: WinType[],
};

export type CellCoords = {
  row: number,
  col: number
};

export type CellMove = CellCoords & {
  mark: Exclude<PlayerMark, undefined>
};

export type GameStarter = ({
  mode, gameStatusContext, difficulty
}: {
  mode: GameMode,
  difficulty?: NPCDifficulty,
  gameStatusContext: GameStatus
}) => void;

export type OutcomeStartingCell = {
  currentRow: number,
  currentCol: number,
  currentPlayer: PlayerMark,
  board: Board
};

export type WinType = "rowWin" | "colWin" | "principDiagWin" | "secondDiagWin";

export type MoveOutcomeChecker = (
  outcomeStartingCell: OutcomeStartingCell
) => WinType[];

export type GameOutcomeChecker = (
  board: Board,
  { row, col, mark }: CellMove
) => {
  gameOutcome: GameOutcome;
  wins: WinType[];
};

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

export type GameCellObject = {
  setIsWinningCell: React.Dispatch<React.SetStateAction<boolean>>
};
