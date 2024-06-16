import { createContext, useState } from "react";
import type { Settings } from "../types";
import { noop } from "../gameControl";

export const SettingsContext = createContext<Settings>({
  darkMode: false, setDarkMode: noop,
  nickname: "Player", setNickname: noop
});
export const useSettingsValues = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>("Player");

  return { darkMode, setDarkMode, nickname, setNickname };
};
