// style wrapper for overal app
// accounts for temporary display (override) of styling via settings page

import React, { useContext } from "react";
import { AnimatePresence } from "framer-motion"; 
import { SettingsContext } from "../../utils";

interface StyleWrapperProps {
  children: React.ReactNode,
  override?: { [key:string]: unknown }
}

const GlobalStyleWrapper: React.FC<StyleWrapperProps> = ({ children, override }) => {
  const settingsContext = useContext(SettingsContext);
  const darkModeUsed = override?.darkMode ?? settingsContext?.darkMode;
  const bgColor = darkModeUsed ? "bg-dark" : "bg-light";
  const textColor = darkModeUsed ? "text-light" : "text-dark";
  const overridePadding = override ? "override-padding" : "";

  return <div
    data-bs-theme={darkModeUsed ? "dark" : "light"}
    className={`app center-children ${bgColor} ${textColor} ${overridePadding}`}
  >
    <AnimatePresence>
      {children}
    </AnimatePresence>
  </div>;
};

export default GlobalStyleWrapper;
