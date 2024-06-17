import { createContext, useState } from "react";
import { PlayerMark, type Settings } from "../types";
import { noop } from "../gameControl";

const emptySettings: Settings = {
  darkMode: false, setDarkMode: noop,
  nickname: "Player", setNickname: noop,
  playerPlayAs: "X", setPlayerPlayAs: noop
};

export const SettingsContext = createContext<Settings>(emptySettings);
export const useSettingsValues = () => {
  const [darkMode, setDarkMode] = useState<boolean>(emptySettings.darkMode);
  const [nickname, setNickname] = useState<string>(emptySettings.nickname);
  const [playerPlayAs, setPlayerPlayAs] = useState<PlayerMark>(emptySettings.playerPlayAs);

  return { darkMode, setDarkMode, nickname, setNickname, playerPlayAs, setPlayerPlayAs };
};
