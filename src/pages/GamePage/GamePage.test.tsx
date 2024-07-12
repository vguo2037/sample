import React, { useState } from "react";
import { act, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { HashRouter } from "react-router-dom"
import GamePage from "./GamePage";
import { SettingsContext, GameStatusContext } from "../../utils";
import type { GameStatus, Settings } from "../../utils/types";
import { createBoard } from "../../utils/contexts/gameStatus";
import { makeNpcMove } from "../../utils/gameControl";

jest.mock("../../utils/gameControl", () => ({
  ...jest.requireActual("../../utils/gameControl"),
  makeNpcMove: jest.fn()
}));

const MOCK_INITIAL_SCORE = 4;
const mockAddScore = jest.fn();
const mockResetScore = jest.fn();
const initialMockSettings = {
  nickname: "MockName",
  boardSize: 3,
  playerPlayAs: "X"
} as Settings;
const initialMockGameStatus = {
  score: MOCK_INITIAL_SCORE,
  pastMoves: [],
  board: createBoard(3),
  wins: [],
  gameMode: "none",
  currentPlayer: "X",
  gameOutcome: "none",
  npcDifficulty: 0,
  addScore: mockAddScore,
  resetScore: mockResetScore
} as unknown as GameStatus;

const TestRender = (
  { gameStatusOverride, settingsOverride }: {
    gameStatusOverride?: Partial<GameStatus>,
    settingsOverride?: Partial<Settings>
  }
) => {
  const [mockSettings] = useState<Settings>({...initialMockSettings, ...settingsOverride});
  const [mockGameStatus] = useState<GameStatus>({...initialMockGameStatus, ...gameStatusOverride});

  return (<>
    <SettingsContext.Provider value={ mockSettings }>
      <GameStatusContext.Provider value={ mockGameStatus }>
        <GamePage />
      </GameStatusContext.Provider>
    </SettingsContext.Provider>
  </>);
};

describe("GamePage displaying correctly", () => {
  test('when mode === "none"', async () => {
    render(<TestRender gameStatusOverride={{ gameMode: "none" }} />, { wrapper: HashRouter });
  
    expect(screen.getByText(`MockName's current score is: ${MOCK_INITIAL_SCORE}`)).toBeInTheDocument();
    expect(screen.getByText("Start a round with:")).toBeInTheDocument();
    expect(screen.queryByText("Undo")).not.toBeInTheDocument();
    expect(screen.queryByText("turn")).not.toBeInTheDocument();
    
    const gamePanelWrapper = screen.getByTestId("test-gamepanel");
    expect(gamePanelWrapper).toBeInTheDocument();
    expect(gamePanelWrapper).toHaveStyle("height: 0px");
  });

  test('when mode === "multiplayer"', async () => {
    render(<TestRender gameStatusOverride={{ gameMode: "multiplayer" }} />, { wrapper: HashRouter });
  
    expect(screen.getByText("It is Player X's turn!")).toBeInTheDocument();
    expect(screen.getByText("Undo")).toBeInTheDocument();
    expect(screen.getByText("Restart")).toBeInTheDocument();
    
    const gamePanelWrapper = screen.getByTestId("test-gamepanel")
    expect(gamePanelWrapper).toBeInTheDocument();
    expect(gamePanelWrapper).not.toHaveStyle("height: 0px");
  });

  test('when mode === "NPC"', async () => {
    render(<TestRender gameStatusOverride={{ gameMode: "NPC" }} />, { wrapper: HashRouter });
  
    expect(screen.getByText("It's your (X) turn!")).toBeInTheDocument();
    expect(screen.getByText("Undo")).toBeInTheDocument();
    expect(screen.getByText("Restart")).toBeInTheDocument();
    
    const gamePanelWrapper = screen.getByTestId("test-gamepanel")
    expect(gamePanelWrapper).toBeInTheDocument();
    expect(gamePanelWrapper).not.toHaveStyle("height: 0px");
  });

  test('when mode === "ended"', async () => {
    render(<TestRender gameStatusOverride={{ gameMode: "ended" }} />, { wrapper: HashRouter });
  
    expect(screen.getByText(`MockName's current score is: ${MOCK_INITIAL_SCORE}`)).toBeInTheDocument();
    expect(screen.getByText("Play another round with:")).toBeInTheDocument();
    expect(screen.queryByText("Undo")).not.toBeInTheDocument();
    expect(screen.queryByText("turn")).not.toBeInTheDocument();
    
    const gamePanelWrapper = screen.getByTestId("test-gamepanel")
    expect(gamePanelWrapper).toBeInTheDocument();
    expect(gamePanelWrapper).not.toHaveStyle("height: 0px");
  });
});

test("GamePage manages automatic NPC turns correctly", async () => {
  act(() => {
    render(<TestRender
      gameStatusOverride={{ gameMode: "NPC", currentPlayer: "X" }}
      settingsOverride={{ playerPlayAs: "O" }}
    />, { wrapper: HashRouter });
  });
  expect(makeNpcMove).toHaveBeenCalledTimes(0);
  
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
  });
  expect(makeNpcMove).toHaveBeenCalledTimes(1);
});

describe("GamePage manages score changing functions correctly", () => {
  test("for resetting score", () => {
    render(<TestRender />, { wrapper: HashRouter });

    const resetButton = screen.getByText("Reset");
    act(() => {
      resetButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(mockAddScore).toHaveBeenCalledTimes(0);
    expect(mockResetScore).toHaveBeenCalledTimes(1);
  });

  test("for adding score after winning", () => {
    act(() => {
      render(<TestRender
        gameStatusOverride={{ gameMode: "ended", gameOutcome: "xWin" }}
      />, { wrapper: HashRouter });
    });
    expect(mockAddScore).toHaveBeenCalledTimes(1);
    expect(mockResetScore).toHaveBeenCalledTimes(0);
  });

  test("for not changing score after losing", () => {
    act(() => {
      render(<TestRender
        gameStatusOverride={{ gameMode: "ended", gameOutcome: "oWin" }}
      />, { wrapper: HashRouter });
    });
    expect(mockAddScore).toHaveBeenCalledTimes(0);
    expect(mockResetScore).toHaveBeenCalledTimes(0);
  });

  test("for not changing score after draw", () => {
    act(() => {
      render(<TestRender
        gameStatusOverride={{ gameMode: "ended", gameOutcome: "draw" }}
      />, { wrapper: HashRouter });
    });
    expect(mockAddScore).toHaveBeenCalledTimes(0);
    expect(mockResetScore).toHaveBeenCalledTimes(0);
  });
});
