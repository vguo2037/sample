import React, { useState } from 'react';
import './styles/App.scss';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { SettingsContext, useSettingsValues, GameStatusContext, useGameStatusValues } from "./utils";
import { GamePage, LandingPage, SettingsPage } from './pages';
import { GlobalStyleWrapper } from './components';
import { StyleOverride } from './utils/types';

const App = () => {
  const settingsValues = useSettingsValues();
  const gameValues = useGameStatusValues();
  const [globalStyleOverride, setGlobalStyleOverride] = useState<StyleOverride>();

  const router = createHashRouter(
    [
      {
        path: "/",
        children : [
          { path: "/", element: <LandingPage /> },
          { path: "settings", element: <SettingsPage setGlobalStyleOverride={setGlobalStyleOverride} /> },
          { path: "game", element: <GamePage /> }
        ]
      }
    ]
  );

  return (
    <SettingsContext.Provider value={settingsValues}>
      <GameStatusContext.Provider value={gameValues}>
        <GlobalStyleWrapper override={globalStyleOverride}>
          <RouterProvider router={router} />
        </GlobalStyleWrapper>
      </GameStatusContext.Provider>
    </SettingsContext.Provider>
  );
}

export default App;
