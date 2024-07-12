// context for the current app settings

import { createContext, useState } from "react";
import type { BoardSize, PlayerMark, Settings, SettingsValues } from "../types";
import { noop } from "../gameControl";

export const defaultSettingsValues: SettingsValues = {
  darkMode: false,
  nickname: "Player",
  playerPlayAs: "X",
  boardSize: 3
};

export const SettingsContext = createContext<Settings>({
  ...defaultSettingsValues,
  setDarkMode: noop,
  setNickname: noop,
  setPlayerPlayAs: noop,
  setBoardSize: noop
});

export const useSettingsValues = (initialSettings: SettingsValues) => {
  const [darkMode, setDarkMode] = useState<boolean>(initialSettings.darkMode);
  const [nickname, setNickname] = useState<string>(initialSettings.nickname);
  const [playerPlayAs, setPlayerPlayAs] = useState<PlayerMark>(initialSettings.playerPlayAs);
  const [boardSize, setBoardSize] = useState<BoardSize>(initialSettings.boardSize);

  return {
    darkMode, setDarkMode,
    nickname, setNickname,
    playerPlayAs, setPlayerPlayAs,
    boardSize, setBoardSize
  };
};
