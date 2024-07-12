import React from "react";
import { act, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import GamePanel from "./GamePanel"
import { GameStatusContext, SettingsContext } from "../../utils";
import type { BoardSize, GameStatus, Settings } from "../../utils/types";
import { createBoard } from "../../utils/contexts/gameStatus";

const initialMockGameStatus = {
  pastMoves: [],
  board: createBoard(3),
  wins: [],
  gameMode: "none",
  currentPlayer: "X",
  gameOutcome: "none",
  npcDifficulty: 0,
} as unknown as GameStatus;

const TestRender = ({ boardSize, gameStatusOverride }: {
  boardSize: BoardSize, gameStatusOverride?: Partial<GameStatus>
}) => {
  return (<>
    <SettingsContext.Provider value={{ boardSize } as Settings}>
      <GameStatusContext.Provider value={{...initialMockGameStatus, ...gameStatusOverride, board: createBoard(boardSize)}}>
        <GamePanel />
      </GameStatusContext.Provider>
    </SettingsContext.Provider>
  </>);
};
describe("GamePanel renders with the right number of cells", () => {
  const testPanelSize = (boardSize: BoardSize) => {
    render(<TestRender boardSize={boardSize} />);
    const gamePanelWrapper = screen.getByTestId("test-gamepanel");
    expect(gamePanelWrapper.children[0].childElementCount).toBe(boardSize * boardSize);
  };
  test("when boardSize === 3", () => testPanelSize(3));
  test("when boardSize === 5", () => testPanelSize(5));
  test("when boardSize === 7", () => testPanelSize(7));
});

test("GamePanel coordinates win displays correctly", () => {
  act(() => {
    render(<>
      <TestRender boardSize={5} gameStatusOverride={{
        wins: ["principDiagWin", "rowWin"],
        pastMoves: [{ row: 1, col: 1, mark: "X" }],
        gameOutcome: "xWin"
      }} />
    </>);
  })
  expect(screen.queryAllByTestId("winning-cell").length).toBe(9);
});
