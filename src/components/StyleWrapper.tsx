import React, { useContext } from 'react';
import { SettingsContext } from '../utils';

interface StyleWrapperProps {
  children: React.ReactNode,
  override?: { [key:string]: any }
};

const StyleWrapper: React.FC<StyleWrapperProps> = ({ children, override }) => {
  const settingsContext = useContext(SettingsContext);
  const darkModeUsed = override?.darkMode ?? settingsContext?.darkMode;
  const bgColor = darkModeUsed ? "bg-dark" : "bg-light";
  const overridePadding = override ? "override-padding" : "";

  return <div className={`app ${bgColor} ${overridePadding}`}>{children}</div>;
};

export default StyleWrapper;
