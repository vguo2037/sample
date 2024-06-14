import { createContext, useState } from "react";

type Settings = {
  darkMode: boolean,
  setDarkMode: Function,
  nickname: string,
  setNickname: Function
};

export const SettingsContext = createContext<Settings | null>(null);
export const useSettingsValues = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>("");

  return { darkMode, setDarkMode, nickname, setNickname };
};
