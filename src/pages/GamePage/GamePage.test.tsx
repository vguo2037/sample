import { act, getByText, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import GamePage from "./GamePage";
import { HashRouter } from 'react-router-dom'
import { SettingsContext, GameStatusContext } from '../../utils';
import type { GameStatus, Settings, GameMode } from '../../utils/types';
import { createBoard } from '../../utils/contexts/gameStatus';
import { noop } from '../../utils/gameControl';
import { useState } from 'react';

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
  resetScore: mockResetScore,
  resetHistory: noop,
  switchCurrentPlayer: noop,
  handleCellSelect: noop,
  undoMove: noop,
  setGameMode: noop,
  setGameOutcome: noop,
  setNpcDifficulty: noop
} as GameStatus;

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
    
    const gamePanel = screen.getByTestId("test-gamepanel")
    expect(gamePanel).toBeInTheDocument();
    expect(gamePanel).toHaveStyle(`height: 0px`);
  });

  test('when mode === "multiplayer"', async () => {
    render(<TestRender gameStatusOverride={{ gameMode: "multiplayer" }} />, { wrapper: HashRouter });
  
    expect(screen.getByText("It is Player X's turn!")).toBeInTheDocument();
    expect(screen.getByText("Undo")).toBeInTheDocument();
    expect(screen.getByText("Restart")).toBeInTheDocument();
    
    const gamePanel = screen.getByTestId("test-gamepanel")
    expect(gamePanel).toBeInTheDocument();
    expect(gamePanel).not.toHaveStyle(`height: 0px`);
  });

  test('when mode === "NPC"', async () => {
    render(<TestRender gameStatusOverride={{ gameMode: "NPC" }} />, { wrapper: HashRouter });
  
    expect(screen.getByText("It's your (X) turn!")).toBeInTheDocument();
    expect(screen.getByText("Undo")).toBeInTheDocument();
    expect(screen.getByText("Restart")).toBeInTheDocument();
    
    const gamePanel = screen.getByTestId("test-gamepanel")
    expect(gamePanel).toBeInTheDocument();
    expect(gamePanel).not.toHaveStyle(`height: 0px`);
  });

  test('when mode === "ended"', async () => {
    render(<TestRender gameStatusOverride={{ gameMode: "ended" }} />, { wrapper: HashRouter });
  
    expect(screen.getByText(`MockName's current score is: ${MOCK_INITIAL_SCORE}`)).toBeInTheDocument();
    expect(screen.getByText("Play another round with:")).toBeInTheDocument();
    expect(screen.queryByText("Undo")).not.toBeInTheDocument();
    expect(screen.queryByText("turn")).not.toBeInTheDocument();
    
    const gamePanel = screen.getByTestId("test-gamepanel")
    expect(gamePanel).toBeInTheDocument();
    expect(gamePanel).not.toHaveStyle(`height: 0px`);
  });
});

test("Automatic NPC turns are played correctly", async () => {
  act(() => {
    render(<TestRender
      gameStatusOverride={{ gameMode: "NPC", currentPlayer: "X" }}
      settingsOverride={{ playerPlayAs: "O" }}
    />, { wrapper: HashRouter });
  });
  expect(screen.getByText("NPC (X) is thinking…")).toBeInTheDocument();
  function sleep(period: number) {
    return new Promise(resolve => setTimeout(resolve, period));
  }
  await act(async () => {
    await sleep(2000); // wait *just* a little longer than the timeout in the component
  });
  expect(screen.getByText("It's your (O) turn!")).toBeInTheDocument();
});

describe("Score changing functions are correctly called", () => {
  test("for resetting score", async () => {
    render(<TestRender />, { wrapper: HashRouter });

    const resetButton = screen.getByText("Reset");
    act(() => {
      resetButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(mockAddScore).toHaveBeenCalledTimes(0);
    expect(mockResetScore).toHaveBeenCalledTimes(1);
  });
  test("for adding score after winning", async () => {
    act(() => {
      render(<TestRender
        gameStatusOverride={{ gameMode: "ended", gameOutcome: "xWin" }}
      />, { wrapper: HashRouter });
    });
    expect(mockAddScore).toHaveBeenCalledTimes(1);
    expect(mockResetScore).toHaveBeenCalledTimes(0);
  });
  test("for not changing score after losing", async () => {
    act(() => {
      render(<TestRender
        gameStatusOverride={{ gameMode: "ended", gameOutcome: "oWin" }}
      />, { wrapper: HashRouter });
    });
    expect(mockAddScore).toHaveBeenCalledTimes(0);
    expect(mockResetScore).toHaveBeenCalledTimes(0);
  });
  test("for not changing score after draw", async () => {
    act(() => {
      render(<TestRender
        gameStatusOverride={{ gameMode: "ended", gameOutcome: "draw" }}
      />, { wrapper: HashRouter });
    });
    expect(mockAddScore).toHaveBeenCalledTimes(0);
    expect(mockResetScore).toHaveBeenCalledTimes(0);
  });
});
