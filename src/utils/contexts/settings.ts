import { createContext, useState } from "react";
import type { BoardSize, PlayerMark, Settings } from "../types";
import { noop } from "../gameControl";

const emptySettings: Settings = {
  darkMode: false, setDarkMode: noop,
  nickname: "Player", setNickname: noop,
  playerPlayAs: "X", setPlayerPlayAs: noop,
  boardSize: 3, setBoardSize: noop
};

export const SettingsContext = createContext<Settings>(emptySettings);
export const useSettingsValues = () => {
  const [darkMode, setDarkMode] = useState<boolean>(emptySettings.darkMode);
  const [nickname, setNickname] = useState<string>(emptySettings.nickname);
  const [playerPlayAs, setPlayerPlayAs] = useState<PlayerMark>(emptySettings.playerPlayAs);
  const [boardSize, setBoardSize] = useState<BoardSize>(3);

  return {
    darkMode, setDarkMode,
    nickname, setNickname,
    playerPlayAs, setPlayerPlayAs,
    boardSize, setBoardSize
  };
};
