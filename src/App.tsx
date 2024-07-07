import React, { useState } from "react";
import type { StyleOverride } from "./utils/types";
import "./styles/App.scss";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { SettingsContext, useSettingsValues, GameStatusContext, useGameStatusValues, defaultSettingsValues, defaultGameStatus } from "./utils";
import { GamePage, LandingPage, SettingsPage } from "./pages";
import { GlobalStyleWrapper } from "./components";

const App = () => {
  const settingsValues = useSettingsValues(defaultSettingsValues);
  const gameValues = useGameStatusValues(defaultGameStatus);
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
