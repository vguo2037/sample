import React, { useEffect, useRef } from "react";
import { act, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import GameCell from "./GameCell"
import { GameStatusContext, SettingsContext } from "../../utils";
import type { GameCellObject, GameStatus, Settings } from "../../utils/types";
import { createBoard } from "../../utils/contexts/gameStatus";

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

describe("GameCell rendering correctly", () => {
  test("During light mode", () => {
    render(<>
      <SettingsContext.Provider value={{ darkMode: false } as Settings}>
        <GameCell row={0} col={0} id={"mock-cell"} />
      </SettingsContext.Provider>
    </>);
    
    const gameCell = screen.getByRole("button");
    expect(gameCell).toHaveClass("bg-light");
    expect(gameCell).toHaveClass("text-dark");
  });
  test("During dark mode", () => {
    render(<>
      <SettingsContext.Provider value={{ darkMode: true } as Settings}>
        <GameCell row={0} col={0} id={"mock-cell"} />
      </SettingsContext.Provider>
    </>);
    
    const gameCell = screen.getByRole("button");
    expect(gameCell).toHaveClass("bg-dark");
    expect(gameCell).toHaveClass("text-light");
  });
  test("When unmarked", () => {
    render(<GameCell row={0} col={0} id={"mock-cell"} />);

    expect(screen.queryByText("ImCross")).not.toBeInTheDocument();
    expect(screen.queryByText("RiRadioButtonFill")).not.toBeInTheDocument();
  });
  test("When marked with X", () => {
    render(<>
      <GameStatusContext.Provider value={{...initialMockGameStatus, board: [["X"]]}}>
        <GameCell row={0} col={0} id={"mock-cell"} />
      </GameStatusContext.Provider>
    </>);

    expect(screen.queryByText("ImCross")).toBeInTheDocument();
    expect(screen.queryByText("RiRadioButtonFill")).not.toBeInTheDocument();
  });
  test("When marked with O", () => {
    render(<>
      <GameStatusContext.Provider value={{...initialMockGameStatus, board: [["O"]]}}>
        <GameCell row={0} col={0} id={"mock-cell"} />
      </GameStatusContext.Provider>
    </>);

    expect(screen.queryByText("ImCross")).not.toBeInTheDocument();
    expect(screen.queryByText("RiRadioButtonFill")).toBeInTheDocument();
  });
});

describe("GameCell handles user selection correctly", () => {
  test("When cell should be enabled", () => {
    render(<>
      <GameStatusContext.Provider value={{...initialMockGameStatus}}>
        <GameCell row={0} col={0} id={"mock-cell"} />
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

  describe("When cell should be disabled via internal logic", () => {
    test("(When cell is already marked)", () => {
      render(<>
        <GameStatusContext.Provider value={{...initialMockGameStatus, board: [["X"]]}}>
          <GameCell row={0} col={0} id={"mock-cell"} />
        </GameStatusContext.Provider>
      </>);
  
      const gameCell = screen.getByRole("button");
      act(() => {
        gameCell.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });
  
      expect(mockHandleCellSelect).toHaveBeenCalledTimes(0);
    });

    test("(When game has ended)", () => {
      render(<>
        <GameStatusContext.Provider value={{...initialMockGameStatus, gameMode: "ended"}}>
          <GameCell row={0} col={0} id={"mock-cell"} />
        </GameStatusContext.Provider>
      </>);
  
      const gameCell = screen.getByRole("button");
      act(() => {
        gameCell.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });
  
      expect(mockHandleCellSelect).toHaveBeenCalledTimes(0);
    });

    test("(When NPC is taking turn)", () => {
      render(<>
        <SettingsContext.Provider value={{ playerPlayAs: "X" } as Settings}>
          <GameStatusContext.Provider value={{
            ...initialMockGameStatus,
            gameMode: "NPC",
            currentPlayer: "O"
          }}>
            <GameCell row={0} col={0} id={"mock-cell"} />
          </GameStatusContext.Provider>
        </SettingsContext.Provider>
      </>);
  
      const gameCell = screen.getByRole("button");
      act(() => {
        gameCell.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });
  
      expect(mockHandleCellSelect).toHaveBeenCalledTimes(0);
    });
  });
});

test("GameCell handles being selected as winning cell correctly", () => {
  const TestRender = () => {
    const cellRef = useRef<(GameCellObject | null)>();
    useEffect(() => {
      cellRef.current?.setIsWinningCell(true);
    }, []);
    return <>
      <GameStatusContext.Provider value={{...initialMockGameStatus, board: [["O"]]}}>
        <GameCell
          row={0} col={0} id={"cell-0"} ref={obj => cellRef.current = obj} 
        />
      </GameStatusContext.Provider>
    </>
  };

  render(<TestRender />);
  expect(screen.getByRole("img")).toBeInTheDocument();
});
