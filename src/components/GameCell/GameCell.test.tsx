import React, { useEffect, useRef } from 'react';
import { act, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import GameCell from './GameCell'
import { GameStatusContext, SettingsContext } from '../../utils';
import type { GameCellObject, GameStatus, Settings } from '../../utils/types';
import { createBoard } from '../../utils/contexts/gameStatus';

const mockSwitchCurrentPlayer = jest.fn();
const mockHandleCellSelect = jest.fn();
const initialMockGameStatus = {
  pastMoves: [],
  board: createBoard(3),
  wins: [],
  gameMode: "none",
  currentPlayer: "X",
  gameOutcome: "none",
  npcDifficulty: 0,
  switchCurrentPlayer: mockSwitchCurrentPlayer,
  handleCellSelect: mockHandleCellSelect
} as unknown as GameStatus;

jest.mock("react-icons/im", () => ({
  "ImCross": () => <span>ImCross</span>
}));
jest.mock("react-icons/ri", () => ({
  "RiRadioButtonFill": () => <span>RiRadioButtonFill</span>
}));

describe('GameCell rendering correctly', () => {
  test("During light mode", async () => {
    render(<>
      <SettingsContext.Provider value={{ darkMode: false } as Settings}>
        <GameCell row={0} col={0} id={"mock-cell"} disabled={false} />
      </SettingsContext.Provider>
    </>);
    
    const gameCell = screen.getByRole("button");
    expect(gameCell).toHaveClass("bg-light");
    expect(gameCell).toHaveClass("text-dark");
  });
  test("During dark mode", async () => {
    render(<>
      <SettingsContext.Provider value={{ darkMode: true } as Settings}>
        <GameCell row={0} col={0} id={"mock-cell"} disabled={false} />
      </SettingsContext.Provider>
    </>);
    
    const gameCell = screen.getByRole("button");
    expect(gameCell).toHaveClass("bg-dark");
    expect(gameCell).toHaveClass("text-light");
  });
  test("When unmarked", async () => {
    render(<GameCell row={0} col={0} id={"mock-cell"} disabled={false} />);

    expect(screen.queryByText("ImCross")).not.toBeInTheDocument();
    expect(screen.queryByText("RiRadioButtonFill")).not.toBeInTheDocument();
  });
  test("When marked with X", async () => {
    render(<>
      <GameStatusContext.Provider value={{...initialMockGameStatus, board: [["X"]]}}>
        <GameCell row={0} col={0} id={"mock-cell"} disabled={false} />
      </GameStatusContext.Provider>
    </>);

    expect(screen.queryByText("ImCross")).toBeInTheDocument();
    expect(screen.queryByText("RiRadioButtonFill")).not.toBeInTheDocument();
  });
  test("When marked with O", async () => {
    render(<>
      <GameStatusContext.Provider value={{...initialMockGameStatus, board: [["O"]]}}>
        <GameCell row={0} col={0} id={"mock-cell"} disabled={false} />
      </GameStatusContext.Provider>
    </>);

    expect(screen.queryByText("ImCross")).not.toBeInTheDocument();
    expect(screen.queryByText("RiRadioButtonFill")).toBeInTheDocument();
  });
});

describe("GameCell handles user selection correctly", () => {
  test("When cell should be enabled", async () => {
    render(<>
      <GameStatusContext.Provider value={{...initialMockGameStatus}}>
        <GameCell row={0} col={0} id={"mock-cell"} disabled={false} />
      </GameStatusContext.Provider>
    </>);

    const gameCell = screen.getByRole("button");
    act(() => {
      gameCell.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const expectedMove = expect.objectContaining({ "row": 0, "col": 0, "mark": "X" });

    expect(mockHandleCellSelect).toHaveBeenCalledTimes(1);
    expect(mockHandleCellSelect).toHaveBeenCalledWith(expectedMove);
  });
  test("When cell should be disabled via props", async () => {
    render(<>
      <GameStatusContext.Provider value={{...initialMockGameStatus}}>
        <GameCell row={0} col={0} id={"mock-cell"} disabled={true} />
      </GameStatusContext.Provider>
    </>);

    const gameCell = screen.getByRole("button");
    act(() => {
      gameCell.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(mockHandleCellSelect).toHaveBeenCalledTimes(0);
  });
  describe("When cell should be disabled via internal logic", () => {
    test("(When cell is already marked)", async () => {
      render(<>
        <GameStatusContext.Provider value={{...initialMockGameStatus, board: [["X"]]}}>
          <GameCell row={0} col={0} id={"mock-cell"} disabled={false} />
        </GameStatusContext.Provider>
      </>);
  
      const gameCell = screen.getByRole("button");
      act(() => {
        gameCell.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });
  
      expect(mockHandleCellSelect).toHaveBeenCalledTimes(0);
    });
    test("(When game has ended)", async () => {
      render(<>
        <GameStatusContext.Provider value={{...initialMockGameStatus, gameMode: "ended"}}>
          <GameCell row={0} col={0} id={"mock-cell"} disabled={false} />
        </GameStatusContext.Provider>
      </>);
  
      const gameCell = screen.getByRole("button");
      act(() => {
        gameCell.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });
  
      expect(mockHandleCellSelect).toHaveBeenCalledTimes(0);
    });
  });
});

test("GameCell handles being selected as winning cell correctly", async () => {
  const TestRender = () => {
    const cellRef = useRef<(GameCellObject | null)>();
    useEffect(() => {
      cellRef.current?.setIsWinningCell(true);
    }, []);
    return <>
      <GameStatusContext.Provider value={{...initialMockGameStatus, board: [["O"]]}}>
        <GameCell disabled={false}
          row={0} col={0} id={`cell-0`} ref={obj => cellRef.current = obj} 
        />
      </GameStatusContext.Provider>
    </>
  };

  render(<TestRender />);
  expect(screen.getByRole("img")).toBeInTheDocument();
});
