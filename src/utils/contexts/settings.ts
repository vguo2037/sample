import { createContext, useState } from "react";

export type Settings = {
  darkMode: boolean,
  setDarkMode: Function,
  nickname: string,
  setNickname: Function
};

export const SettingsContext = createContext<Settings | undefined>(undefined);
export const useSettingsValues = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>("");

  return { darkMode, setDarkMode, nickname, setNickname };
};
