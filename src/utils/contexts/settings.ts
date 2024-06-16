import { createContext, useState } from "react";
import type { Settings } from "../types";

export const SettingsContext = createContext<Settings | undefined>(undefined);
export const useSettingsValues = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>("Player");

  return { darkMode, setDarkMode, nickname, setNickname };
};
