import React from 'react';
import './styles/App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SettingsContext, useSettingsValues, GameContext, useGameValues } from "./utils";
import { GamePage, LandingPage, SettingsPage } from './pages';
import { StyleWrapper } from './components';

const App = () => {
  const settingsValues = useSettingsValues();
  const gameValues = useGameValues();

  return (
    <SettingsContext.Provider value={settingsValues}>
      <GameContext.Provider value={gameValues}>
        <StyleWrapper>
          <BrowserRouter basename={process.env.PUBLIC_URL} > 
            <Routes>
              <Route index path="/" element={<LandingPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/game" element={<GamePage />} />
            </Routes>
          </BrowserRouter>
          </StyleWrapper>
      </GameContext.Provider>
    </SettingsContext.Provider>
  );
}

export default App;
