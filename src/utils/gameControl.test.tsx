import '@testing-library/jest-dom';
import { checkMoveOutcome, getWinningCells, makeNpcMove, startGame } from './gameControl';
import { act, render } from '@testing-library/react';
import { createBoard, GameStatusContext, useGameStatusValues } from './contexts/gameStatus';
import type { Board, BoardSize, CellMove, GameStatus, GameStatusValues, NPCDifficulty, WinType } from './types';
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
  
  test('when it made a row win', () => {
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

  test('when it made a column win', () => {
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

  test('when it made a principal diagonal win', () => {
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

  test('when it made a secondary diagonal win', () => {
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

  test('when it made multiple types of wins', () => {
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

describe("makeNpcMove", () => {
  const handleCellSelect = jest.fn();
  
  beforeEach(() => {
    handleCellSelect.mockClear();
  });
  
  const testValidMoves = (npcDifficulty: NPCDifficulty, boardSize: BoardSize) => {
    const board: Board = new Array(boardSize).fill(Array(boardSize).fill("O"));
    expect(handleCellSelect).toHaveBeenCalledTimes(0);

    for (let i=0; i<boardSize; i++) for (let j=0; j<boardSize; j++) {
      const boardCopy = JSON.parse(JSON.stringify(board)); 
      boardCopy[i][j] = null;

      const expectedMove: CellMove = expect.objectContaining({
        row: i, col: j, mark: "X"
      });

      makeNpcMove(
        { board: boardCopy, npcDifficulty, handleCellSelect } as unknown as GameStatus,
        "X"
      );

      expect(handleCellSelect).toHaveBeenCalledTimes(1);
      expect(handleCellSelect).toHaveBeenLastCalledWith(expectedMove);

      handleCellSelect.mockClear();
    };
  };
  
  test("should make valid moves for difficulty 1 (Easy)", async () => {
    testValidMoves(1, 3);
  });

  test("should make valid moves for difficulty 2 (Hard)", async () => {
    testValidMoves(2, 3);
  });

  // TODO
  describe("should play for wins for difficulty 2 (Hard)", () => {
    test("(play for row wins)", async () => {});
    test("(play for column wins)", async () => {});
    test("(play for primary diagonal wins)", async () => {});
    test("(play for secondary diagonal wins)", async () => {});
  });
});

describe('checkMoveOutcome', () => {
  test("should detect row xWins", async () => {
    const board: Board = [
      ['X', 'X', 'X'],
      ['O', 'O', null],
      [null, null, null],
    ];
    const currentMove: CellMove = { row: 0, col: 2, mark: 'X' };

    const result = checkMoveOutcome(board, currentMove);
    expect(result).toEqual(
      expect.objectContaining({ gameOutcome: "xWin", wins: ["rowWin"] })
    );
  });
  test("should detect column xWins", async () => {
    const board: Board = [
      ['X', null, 'X'],
      ['O', 'O', 'X'],
      [null, null, 'X'],
    ];
    const currentMove: CellMove = { row: 0, col: 2, mark: 'X' };

    const result = checkMoveOutcome(board, currentMove);
    expect(result).toEqual(
      expect.objectContaining({ gameOutcome: "xWin", wins: ["colWin"] })
    );
  });
  test("should detect primary diagonal xWins", async () => {
    const board: Board = [
      ['X', null, 'X'],
      ['O', 'X', 'O'],
      [null, null, 'X'],
    ];
    const currentMove: CellMove = { row: 2, col: 2, mark: 'X' };

    const result = checkMoveOutcome(board, currentMove);
    expect(result).toEqual(
      expect.objectContaining({ gameOutcome: "xWin", wins: ["principDiagWin"] })
    );
  });
  test("should detect secondary diagonal xWins", async () => {
    const board: Board = [
      ['O', null, 'X'],
      ['O', 'X', 'O'],
      ["X", null, 'X'],
    ];
    const currentMove: CellMove = { row: 0, col: 2, mark: 'X' };

    const result = checkMoveOutcome(board, currentMove);
    expect(result).toEqual(
      expect.objectContaining({ gameOutcome: "xWin", wins: ["secondDiagWin"] })
    );
  });
  test("should detect multiple xWins", async () => {
    const board: Board = [
      ["X", null, "X", null, "X"],
      [null, "X", "X", "X", null],
      ["X", "X", "X", "X", "X"],
      [null, "X", "X", "X", null],
      ["X", null, "X", null, "X"],
    ];
    const currentMove: CellMove = { row: 2, col: 2, mark: 'X' };

    const result = checkMoveOutcome(board, currentMove);
    expect(result).toEqual(
      expect.objectContaining({
        gameOutcome: "xWin",
        wins: expect.arrayContaining(["rowWin", "colWin", "principDiagWin", "secondDiagWin"])
      })
    );
  });
  test("should detect oWins", async () => {
    const board: Board = [
      ["O", null, "O", null, "O"],
      [null, "O", "O", "O", null],
      ["O", "O", "O", "O", "O"],
      [null, "O", "O", "O", null],
      ["O", null, "O", null, "O"],
    ];
    const currentMove: CellMove = { row: 2, col: 2, mark: 'O' };

    const result = checkMoveOutcome(board, currentMove);
    expect(result).toEqual(
      expect.objectContaining({
        gameOutcome: "oWin",
        wins: expect.arrayContaining(["rowWin", "colWin", "principDiagWin", "secondDiagWin"])
      })
    );
  });

  test('should return draw when the board is full with no winner', () => {
    const board: Board = [
      ['X', 'O', 'X'],
      ['X', 'O', 'O'],
      ['O', 'X', 'X'],
    ];
    const currentMove: CellMove = { row: 2, col: 2, mark: 'X' };

    const result = checkMoveOutcome(board, currentMove);
    expect(result).toEqual(
      expect.objectContaining({ gameOutcome: 'draw', wins: [], })
    );
  });

  test('should return none when the game is not yet finished', () => {
    const board: Board = [
      ['X', 'O', 'X'],
      ['X', 'O', null],
      ['O', null, 'X'],
    ];
    const currentMove: CellMove = { row: 1, col: 2, mark: 'O' };

    const result = checkMoveOutcome(board, currentMove);
    expect(result).toEqual(
      expect.objectContaining({ gameOutcome: 'none', wins: [] })
    );
  });
});
