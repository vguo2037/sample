export type Settings = {
  darkMode: boolean,
  setDarkMode: Function,
  nickname: string,
  setNickname: Function
};

export type GameMode = "NPC" | "multiplayer" | "ended" | "none";

export type PlayerTurn = "X" | "O";

export type GameOutcome = "win" | "lose" | "draw" | "none";

export type GameStatus = {
  score: number,
  addScore: Function,
  resetScore: Function,
  currentPlayer: PlayerTurn,
  switchCurrentPlayer: Function,
  gameMode: GameMode,
  setGameMode: Function,
  gameOutcome: GameOutcome,
  setGameOutcome: Function
};

export type CellMove = {
  row: number,
  col: number,
  player: Exclude<PlayerTurn, undefined>
};
