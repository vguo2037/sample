import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import TurnDisplayer from './TurnDisplayer'
import { GameStatusContext, SettingsContext } from '../../utils';
import type { GameStatus, Settings } from '../../utils/types';

const TestRender = ({ settingsOverride, gameStatusOverride }: {
  settingsOverride?: Partial<Settings>,
  gameStatusOverride?: Partial<GameStatus>
}) => {
  return (<>
    <SettingsContext.Provider value={{...settingsOverride} as Settings}>
      <GameStatusContext.Provider value={{...gameStatusOverride} as GameStatus}>
        <TurnDisplayer />
      </GameStatusContext.Provider>
    </SettingsContext.Provider>
  </>);
}

const runTest = ({ settingsOverride, gameStatusOverride, expectedText }: {
  settingsOverride?: Partial<Settings>,
  gameStatusOverride?: Partial<GameStatus>
  expectedText: string
}) => {
  render(<TestRender
    settingsOverride={settingsOverride}
    gameStatusOverride={gameStatusOverride}
  />);
  expect(screen.getByText(expectedText)).toBeInTheDocument();
};

describe("TurnDisplayer renders correctly", () => {
  describe("For a round with an NPC", () => {
    test("When it is player's turn", async () => {
      runTest({
        settingsOverride: { playerPlayAs: "O" },
        gameStatusOverride: { gameMode: "NPC", currentPlayer: "O" },
        expectedText: "It's your (O) turn!"
      });
    });
    test("When it is NPC's turn", async () => {
      runTest({
        settingsOverride: { playerPlayAs: "O" },
        gameStatusOverride: { gameMode: "NPC", currentPlayer: "X" },
        expectedText: "NPC (X) is thinking…"
      });
    });
  });
  describe("For a multiplayer round", () => {
    test("When it is player X's turn", async () => {
      runTest({
        gameStatusOverride: { gameMode: "multiplayer", currentPlayer: "X" },
        expectedText: "It is Player X's turn!"
      });
    });
    test("When it is player O's turn", async () => {
      runTest({
        gameStatusOverride: { gameMode: "multiplayer", currentPlayer: "O" },
        expectedText: "It is Player O's turn!"
      });
    });
  });
  describe("When game has ended", () => {
    test("(When player has won game)", async () => {
      runTest({
        settingsOverride: { playerPlayAs: "O", nickname: "MockNickname" },
        gameStatusOverride: { gameMode: "ended", gameOutcome: "oWin" },
        expectedText: "MockNickname wins!"
      });
    });
    test("(When player has lost game)", async () => {
      runTest({
        settingsOverride: { playerPlayAs: "O", nickname: "MockNickname" },
        gameStatusOverride: { gameMode: "ended", gameOutcome: "xWin" },
        expectedText: "MockNickname loses!"
      });
    });
    test("(When game has ended in a draw)", async () => {
      runTest({
        gameStatusOverride: { gameMode: "ended", gameOutcome: "draw" },
        expectedText: "It's a draw!"
      });
    });
  });
});
