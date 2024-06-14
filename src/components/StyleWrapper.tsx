import React, { useContext } from 'react';
import { SettingsContext } from '../utils';

interface StyleWrapperProps {
  children: React.ReactNode
};

const StyleWrapper: React.FC<StyleWrapperProps> = ({ children }) => {
  const settingsContext = useContext(SettingsContext);
  const bgColor = settingsContext?.darkMode ? "bg-dark" : "bg-light";

  return <div className={`app ${bgColor}`}>{children}</div>;
};

export default StyleWrapper;
