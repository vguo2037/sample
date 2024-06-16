import React from 'react';
import './styles/App.scss';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { SettingsContext, useSettingsValues, GameStatusContext, useGameStatusValues } from "./utils";
import { GamePage, LandingPage, SettingsPage } from './pages';
import { StyleWrapper } from './components';

const App = () => {
  const settingsValues = useSettingsValues();
  const gameValues = useGameStatusValues();

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
      <GameStatusContext.Provider value={gameValues}>
        <StyleWrapper>
          <RouterProvider router={router} />
        </StyleWrapper>
      </GameStatusContext.Provider>
    </SettingsContext.Provider>
  );
}

export default App;
