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

  return <div className={`app ${bgColor}`}>{children}</div>;
};

export default StyleWrapper;
