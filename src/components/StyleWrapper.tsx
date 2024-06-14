import React, { ReactNode, useContext } from 'react';
import { SettingsContext } from '../utils';

const StyleWrapper = ({ children }: { children: ReactNode }) => {
  const settingsContext = useContext(SettingsContext);
  const bgColor = settingsContext?.darkMode ? "bg-dark" : "bg-light";

  return <div className={`app ${bgColor}`}>{children}</div>;
};

export default StyleWrapper;
