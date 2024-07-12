// tests for the context's value initialisation and exposed functions

import React, { useContext, useEffect } from "react";
import { act, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { useSettingsValues, SettingsContext } from "./settings"
import type { SettingsValues } from "../types";

const initialSettings: SettingsValues = {
  darkMode: true,
  nickname: "MockNickname",
  playerPlayAs: "O",
  boardSize: 5
};
const updatedSettings: SettingsValues = {
  darkMode: false,
  nickname: "MockUpdate",
  playerPlayAs: "X",
  boardSize: 7
};

const TestRenderWrapper = ({ children }: {
  children: React.ReactNode
}) => {
  const settingsContext = useSettingsValues(initialSettings);
  return (<SettingsContext.Provider value={settingsContext}>
    {children}
  </SettingsContext.Provider>);
};

const TestRender = ({ updatedSettings }: {
  updatedSettings?: SettingsValues
}) => {
  const {
    darkMode, nickname, playerPlayAs, boardSize,
    setDarkMode, setNickname, setPlayerPlayAs, setBoardSize
  } = useContext(SettingsContext);
  
  useEffect(() => {
    if (!updatedSettings) return;

    const {
      darkMode: updatedDarkMode,
      nickname: updatedNickname,
      playerPlayAs: updatedPlayerPlayAs,
      boardSize: updatedBoardSize
    } = updatedSettings;

    setDarkMode(updatedDarkMode);
    setNickname(updatedNickname);
    setPlayerPlayAs(updatedPlayerPlayAs);
    setBoardSize(updatedBoardSize);
  }, [updatedSettings]);

  return (<>
    <div>darkMode: {JSON.stringify(darkMode)}</div>
    <div>nickname: {nickname}</div>
    <div>playerPlayAs: {playerPlayAs}</div>
    <div>boardSize: {boardSize}</div>
  </>);
};

test("useSettingsValues's functions render initial context values correctly", () => {
  render(<TestRenderWrapper>
    <TestRender />
  </TestRenderWrapper>);

  const {
    darkMode: expectedDarkMode,
    nickname: expectedNickname,
    playerPlayAs: expectedPlayerPlayAs,
    boardSize: expectedBoardSize
  } = initialSettings;

  expect(screen.getByText(`darkMode: ${expectedDarkMode}`)).toBeInTheDocument();
  expect(screen.getByText(`nickname: ${expectedNickname}`)).toBeInTheDocument();
  expect(screen.getByText(`playerPlayAs: ${expectedPlayerPlayAs}`)).toBeInTheDocument();
  expect(screen.getByText(`boardSize: ${expectedBoardSize}`)).toBeInTheDocument();
});

test("useSettingsValues's functions modify context values correctly", () => {
  act(() => {
    render(<TestRenderWrapper>
      <TestRender updatedSettings={updatedSettings} />
    </TestRenderWrapper>);
  });

  const {
    darkMode: expectedDarkMode,
    nickname: expectedNickname,
    playerPlayAs: expectedPlayerPlayAs,
    boardSize: expectedBoardSize
  } = updatedSettings;

  expect(screen.getByText(`darkMode: ${expectedDarkMode}`)).toBeInTheDocument();
  expect(screen.getByText(`nickname: ${expectedNickname}`)).toBeInTheDocument();
  expect(screen.getByText(`playerPlayAs: ${expectedPlayerPlayAs}`)).toBeInTheDocument();
  expect(screen.getByText(`boardSize: ${expectedBoardSize}`)).toBeInTheDocument();
});
