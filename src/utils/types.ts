export type SettingsValues = {
  darkMode: boolean,
  nickname: string,
  playerPlayAs: PlayerMark,
  boardSize: BoardSize
};
export type SettingsModifiers = {
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>,
  setNickname: React.Dispatch<React.SetStateAction<string>>,
  setPlayerPlayAs: React.Dispatch<React.SetStateAction<PlayerMark>>,
  setBoardSize: React.Dispatch<React.SetStateAction<BoardSize>>
};
export type Settings = SettingsValues & SettingsModifiers;

export type StyleOverride = Partial<SettingsValues> | undefined;

export type GameMode = "NPC" | "multiplayer" | "ended" | "none";
export type PlayerMark = "X" | "O";
export type GameOutcome = "xWin" | "oWin" | "draw" | "none";
export type Board = Array<Array<PlayerMark | null>>;
export type NPCDifficulty = 0 | 1 | 2;
export type BoardSize = 3 | 5 | 7;

export type GameStatusValues = {
  score: number,
  currentPlayer: PlayerMark,
  gameMode: GameMode,
  gameOutcome: GameOutcome,
  board: Board,
  pastMoves: CellMove[],
  npcDifficulty: NPCDifficulty,
  wins: WinType[]
};
export type GameStatusModifiers = {
  addScore: () => void,
  resetScore: () => void,
  switchCurrentPlayer: () => void,
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>,
  setGameOutcome: React.Dispatch<React.SetStateAction<GameOutcome>>,
  handleCellSelect: (move: CellMove) => void,
  resetHistory: (newBoardSize: BoardSize) => void,
  undoMove: () => void,
  setNpcDifficulty: React.Dispatch<React.SetStateAction<NPCDifficulty>>
};
export type GameStatus = GameStatusValues & GameStatusModifiers;

export type CellCoords = {
  row: number,
  col: number
};

export type CellMove = CellCoords & {
  mark: Exclude<PlayerMark, undefined>
};

export type GameStarter = ({
  mode, gameStatusContext, difficulty, boardSize
}: {
  mode: GameMode,
  difficulty?: NPCDifficulty,
  gameStatusContext: GameStatus,
  boardSize: BoardSize
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

export type NpcStrategies = Partial<{
  [difficulty in NPCDifficulty]: (input: NPCStrategyInput) => number[];
}>;
