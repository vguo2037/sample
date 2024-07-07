import React from "react";
import { act, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import ModePicker from "./ModePicker"
import { SettingsContext } from "../../utils";
import type { GameStatus, Settings } from "../../utils/types";
import { createBoard, GameStatusContext } from "../../utils/contexts/gameStatus";
import { startGame } from "../../utils/gameControl";

jest.mock("../../utils/gameControl", () => ({
  startGame: jest.fn()
}));

const mockResetHistory = jest.fn();
const initialMockSettings = {
  nickname: "MockName",
  boardSize: 3,
  playerPlayAs: "X"
} as Settings;
const initialMockGameStatus = {
  board: createBoard(3),
  gameMode: "none",
  currentPlayer: "X",
  resetHistory: mockResetHistory
} as unknown as GameStatus;

const TestRender = () => {
  return (<>
    <SettingsContext.Provider value={initialMockSettings}>
      <GameStatusContext.Provider value={initialMockGameStatus}>
        <ModePicker />
      </GameStatusContext.Provider>
    </SettingsContext.Provider>
  </>)
};

describe("ModePicker renders correctly", () => {
  test("On initial load", async () => {
    render(<TestRender />);
    expect(screen.getByText("An NPC")).toBeInTheDocument();
    expect(screen.getByText("Another player")).toBeInTheDocument();
    expect(screen.queryByText("Easy")).not.toBeInTheDocument();
    expect(screen.queryByText("Hard")).not.toBeInTheDocument();
  });
  test("When user selects NPC mode dropdown", async () => {
    render(<TestRender />);
    const dropdownTrigger = screen.getByText("An NPC");
    act(() => {
      dropdownTrigger.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(await screen.findByText("Easy")).toBeInTheDocument();
    expect(await screen.findByText("Hard")).toBeInTheDocument();
  });
});

describe("ModePicker handles game reset & starting logic correctly", () => {
  test("When selecting easy NPC mode", async () => {
    render(<TestRender />);

    const dropdownTrigger = screen.getByText("An NPC");
    act(() => {
      dropdownTrigger.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const easyNPCStart = screen.getByText("Easy");
    await act(async () => {
      easyNPCStart.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(startGame).toHaveBeenCalledTimes(1);

    const startGameConditions = expect.objectContaining({
      mode: "NPC", difficulty: 1, gameStatusContext: initialMockGameStatus
    });
    expect(startGame).toHaveBeenCalledWith(startGameConditions);
  });
  test("When selecting hard NPC mode", async () => {
    render(<TestRender />);

    const dropdownTrigger = screen.getByText("An NPC");
    act(() => {
      dropdownTrigger.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const easyNPCStart = screen.getByText("Hard");
    await act(async () => {
      easyNPCStart.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(startGame).toHaveBeenCalledTimes(1);

    const startGameConditions = expect.objectContaining({
      mode: "NPC", difficulty: 2, gameStatusContext: initialMockGameStatus
    });
    expect(startGame).toHaveBeenCalledWith(startGameConditions);
  });
  test("When selecting multiplayer mode", async () => {
    render(<TestRender />);

    const dropdownTrigger = screen.getByText("Another player");
    act(() => {
      dropdownTrigger.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(startGame).toHaveBeenCalledTimes(1);

    const startGameConditions = expect.objectContaining({
      mode: "multiplayer",
      gameStatusContext: initialMockGameStatus
    });
    expect(startGame).toHaveBeenCalledWith(startGameConditions);
  });
});
