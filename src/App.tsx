import React from 'react';
import './styles/App.scss';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { SettingsContext, useSettingsValues, GameContext, useGameValues } from "./utils";
import { GamePage, LandingPage, SettingsPage } from './pages';
import { StyleWrapper } from './components';

const App = () => {
  const settingsValues = useSettingsValues();
  const gameValues = useGameValues();

  const router = createHashRouter(
    [
      {
        path: "/",
        children : [
          { path: "/", element: <LandingPage /> },
          { path: "settings", element: <SettingsPage /> },
          { path: "game", element: <GamePage /> }
        ]
      }
    ]
  );

  return (
    <SettingsContext.Provider value={settingsValues}>
      <GameContext.Provider value={gameValues}>
        <StyleWrapper>
          <RouterProvider router={router} />
        </StyleWrapper>
      </GameContext.Provider>
    </SettingsContext.Provider>
  );
}

export default App;
