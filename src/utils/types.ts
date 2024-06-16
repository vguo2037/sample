export type Settings = {
  darkMode: boolean,
  setDarkMode: Function,
  nickname: string,
  setNickname: Function
};

export type GameStatistics = {
  score: number,
  addScore: Function,
  resetScore: Function
};

export type GameMode = "none" | "NPC" | "multiplayer" | "ended";
