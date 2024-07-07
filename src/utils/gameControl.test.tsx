import '@testing-library/jest-dom';
import { getWinningCells, startGame } from './gameControl';
import { act, render } from '@testing-library/react';
import { createBoard, GameStatusContext, useGameStatusValues } from './contexts/gameStatus';
import type { CellMove, GameStatus, GameStatusValues, WinType } from './types';
import { useEffect } from 'react';

// noop, reverseMark, winningOutcome not tested as they are trivial

test('startGame should change game settings correctly', async () => {
  const DEFAULT_SIZE = 3;
  const initialMockGameStatus: GameStatusValues = {
    gameMode: "ended",
    gameOutcome: "xWin",
    npcDifficulty: 1,
    currentPlayer: "O",
    score: 1,
    board: createBoard(DEFAULT_SIZE),
    pastMoves: [],
    wins: []
  };
  const updatedMockGameStatus: GameStatusValues = {
    ...initialMockGameStatus,
    gameMode: "NPC",
    gameOutcome: "none",
    npcDifficulty: 2,
    currentPlayer: "X",
  };

  const TestRender = ({ broadcastGSContext }: {
    broadcastGSContext: (gs: GameStatus) => void
  }) => {
    const gameStatusContext = useGameStatusValues(initialMockGameStatus);
    useEffect(() => {
      broadcastGSContext(gameStatusContext)
    }, [gameStatusContext]);
    return (<>
      <GameStatusContext.Provider value={gameStatusContext} />
    </>);
  };

  let gameStatusContext = {} as GameStatus;
  const broadcastGSContext = (value: GameStatus) => gameStatusContext = value;

  act(() => {
    render(<TestRender broadcastGSContext={broadcastGSContext} />);
  });

  act(() => {
    startGame({
      mode: updatedMockGameStatus.gameMode,
      difficulty: updatedMockGameStatus.npcDifficulty,
      gameStatusContext: (gameStatusContext as unknown as GameStatus),
      boardSize: DEFAULT_SIZE
    });
  });

  expect(gameStatusContext).toMatchObject(updatedMockGameStatus);
});

describe('getWinningCells should return the right winning cells for a move', () => {
  const boardSize = 5;
  const lastMove: CellMove = { row: 2, col: 2, mark: "X" };
  
  it('when it made a row win', () => {
    const wins: WinType[] = ['rowWin'];
    const winningCells = getWinningCells(wins, lastMove, boardSize);

    expect(winningCells).toEqual(expect.arrayContaining([
      { row: 2, col: 0 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
      { row: 2, col: 3 },
      { row: 2, col: 4 }
    ]));
  });

  it('when it made a column win', () => {
    const wins: WinType[] = ['colWin'];
    const winningCells = getWinningCells(wins, lastMove, boardSize);

    expect(winningCells).toEqual(expect.arrayContaining([
      { row: 0, col: 2 },
      { row: 1, col: 2 },
      { row: 2, col: 2 },
      { row: 3, col: 2 },
      { row: 4, col: 2 }
    ]));
  });

  it('when it made a principal diagonal win', () => {
    const wins: WinType[] = ['principDiagWin'];
    const winningCells = getWinningCells(wins, lastMove, boardSize);

    expect(winningCells).toEqual(expect.arrayContaining([
      { row: 0, col: 0 },
      { row: 1, col: 1 },
      { row: 2, col: 2 },
      { row: 3, col: 3 },
      { row: 4, col: 4 },
    ]));
  });

  it('when it made a secondary diagonal win', () => {
    const wins: WinType[] = ['secondDiagWin'];
    const winningCells = getWinningCells(wins, lastMove, boardSize);

    expect(winningCells).toEqual(expect.arrayContaining([
      { row: 0, col: 4 },
      { row: 1, col: 3 },
      { row: 2, col: 2 },
      { row: 3, col: 1 },
      { row: 4, col: 0 },
    ]));
  });

  it('when it made multiple types of wins', () => {
    const wins: WinType[] = ["rowWin", "colWin", "principDiagWin", "secondDiagWin"];
    const winningCells = getWinningCells(wins, lastMove, boardSize);

    expect(winningCells).toEqual(expect.arrayContaining([
      { row: 2, col: 2 },
      { row: 0, col: 4 },
      { row: 1, col: 3 },
      { row: 3, col: 1 },
      { row: 4, col: 0 },
      { row: 0, col: 0 },
      { row: 1, col: 1 },
      { row: 3, col: 3 },
      { row: 4, col: 4 },
      { row: 2, col: 0 },
      { row: 2, col: 1 },
      { row: 2, col: 3 },
      { row: 2, col: 4 },
      { row: 0, col: 2 },
      { row: 1, col: 2 },
      { row: 3, col: 2 },
      { row: 4, col: 2 }
    ]));
  });
});
