import React, { useEffect } from "react";
import "@testing-library/jest-dom";
import { act, render } from "@testing-library/react";
import { createBoard, GameStatusContext, useGameStatusValues } from "./contexts/gameStatus";
import type { Board, CellMove, GameStatus, GameStatusValues, NpcStrategiesList, WinType } from "./types";

import * as gameControl from "./gameControl";
const { checkMoveOutcome, getWinningCells, makeNpcMove, startGame, npcStrategyRandom, npcStrategyTactical } = gameControl;

// noop, reverseMark, winningOutcome are not tested as their codes are trivial

test("startGame should change game settings correctly", () => {
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

describe("getWinningCells should return the right winning cells for a move", () => {
  const boardSize = 5;
  const lastMove: CellMove = { row: 2, col: 2, mark: "X" };
  
  test("when it made a row win", () => {
    const wins: WinType[] = ["rowWin"];
    const winningCells = getWinningCells(wins, lastMove, boardSize);

    expect(winningCells).toEqual(expect.arrayContaining([
      { row: 2, col: 0 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
      { row: 2, col: 3 },
      { row: 2, col: 4 }
    ]));
  });

  test("when it made a column win", () => {
    const wins: WinType[] = ["colWin"];
    const winningCells = getWinningCells(wins, lastMove, boardSize);

    expect(winningCells).toEqual(expect.arrayContaining([
      { row: 0, col: 2 },
      { row: 1, col: 2 },
      { row: 2, col: 2 },
      { row: 3, col: 2 },
      { row: 4, col: 2 }
    ]));
  });

  test("when it made a principal diagonal win", () => {
    const wins: WinType[] = ["principDiagWin"];
    const winningCells = getWinningCells(wins, lastMove, boardSize);

    expect(winningCells).toEqual(expect.arrayContaining([
      { row: 0, col: 0 },
      { row: 1, col: 1 },
      { row: 2, col: 2 },
      { row: 3, col: 3 },
      { row: 4, col: 4 },
    ]));
  });

  test("when it made a secondary diagonal win", () => {
    const wins: WinType[] = ["secondDiagWin"];
    const winningCells = getWinningCells(wins, lastMove, boardSize);

    expect(winningCells).toEqual(expect.arrayContaining([
      { row: 0, col: 4 },
      { row: 1, col: 3 },
      { row: 2, col: 2 },
      { row: 3, col: 1 },
      { row: 4, col: 0 },
    ]));
  });

  test("when it made multiple types of wins", () => {
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

describe("makeNpcMove should call the correct npc strategy and make the calculated move", () => {
  const handleCellSelect = jest.fn();
  const board = createBoard(3);
  
  test("for a difficulty with existing strategy", () => {
    const mockStrategies = { 9: jest.fn() };
    mockStrategies[9].mockReturnValue({ row: 0, col: 0, mark: "X" });

    const handleCellSelect = jest.fn();
    const boardCopy = JSON.parse(JSON.stringify(board));

    expect(mockStrategies[9]).toHaveBeenCalledTimes(0);
    makeNpcMove(
      { board: boardCopy, npcDifficulty: 9, handleCellSelect } as unknown as GameStatus,
      "X",
      mockStrategies as NpcStrategiesList
    );
    expect(mockStrategies[9]).toHaveBeenCalledTimes(1);

    const expectedMove = expect.objectContaining({ row: 0, col: 0, mark: "X" });
    expect(handleCellSelect).toHaveBeenCalledWith(expectedMove);
  });
  test("for invalid difficulty", () => {
    const mockStrategies = {};
    const boardCopy = JSON.parse(JSON.stringify(board));

    expect(() => {
      makeNpcMove(
        { board: boardCopy, npcDifficulty: 2, handleCellSelect } as unknown as GameStatus,
        "X",
        mockStrategies as NpcStrategiesList
      );
    }).toThrow("Invalid npcDifficulty entered.");
  });
});

test("npcStrategyRandom should only make valid moves", () => {
  const boardSize = 3;
  const board: Board = new Array(boardSize).fill(Array(boardSize).fill("O"));

  for (let i=0; i<boardSize; i++) for (let j=0; j<boardSize; j++) {
    const boardCopy = JSON.parse(JSON.stringify(board)); 
    boardCopy[i][j] = null;

    const expectedCellMove = expect.objectContaining({ row: i, col: j, mark: "X" });

    const selectedCell = npcStrategyRandom({ board: boardCopy, npcPlayAs: "X" });
    expect(selectedCell).toMatchObject(expectedCellMove);
  }
});

describe("npcStrategyTactical", () => {
  const checkCorrectExpectedMove = (board: Board, expectCellCoords: number[]) => {
    const selectedCell = npcStrategyTactical({ board, npcPlayAs: "X" });
    const expectedCellMove = { row: expectCellCoords[0], col: expectCellCoords[1], mark: "X" };
    expect(selectedCell).toMatchObject(expect.objectContaining(expectedCellMove));
  };

  test("should play to make self win via row", () => {
    const board: Board = [
      [null, "O", "O"],
      [null, null, null],
      [null, "X", "X"]
    ];
    const expectedSelectedCell = [2, 0];
    checkCorrectExpectedMove(board, expectedSelectedCell);
  });

  test("should play to make self win via column", () => {
    const board: Board = [
      [null, "O", "X"],
      [null, "O", null],
      [null, null, "X"]
    ];
    const expectedSelectedCell = [1, 2];
    checkCorrectExpectedMove(board, expectedSelectedCell);
  });

  test("should play to make self win via principal diagonal", () => {
    const board: Board = [
      [null, null, null],
      [null, "X", null],
      [null, null, "X"]
    ];
    const expectedSelectedCell = [0, 0];
    checkCorrectExpectedMove(board, expectedSelectedCell);
  });

  test("should play to make self win via secondary diagonal", () => {
    const board: Board = [
      [null, null, "X"],
      [null, "X", null],
      [null, null, null]
    ];
    const expectedSelectedCell = [2, 0];
    checkCorrectExpectedMove(board, expectedSelectedCell);
  });

  test("if self cannot win, should play to block opponent win via row", () => {
    const board: Board = [
      [null, "O", "O"],
      [null, null, null],
      [null, null, "X"]
    ];
    const expectedSelectedCell = [0, 0];
    checkCorrectExpectedMove(board, expectedSelectedCell);
  });

  test("if self cannot win, should play to block opponent win via column", () => {
    const board: Board = [
      [null, "O", null],
      [null, "O", null],
      [null, null, "X"]
    ];
    const expectedSelectedCell = [2, 1];
    checkCorrectExpectedMove(board, expectedSelectedCell);
  });

  test("if self cannot win, should play to block opponent win via principal diagonal", () => {
    const board: Board = [
      [null, null, null],
      [null, "O", null],
      [null, null, "O"]
    ];
    const expectedSelectedCell = [0, 0];
    checkCorrectExpectedMove(board, expectedSelectedCell);
  });

  test("if self cannot win, should play to block opponent win via secondary diagonal", () => {
    const board: Board = [
      [null, null, "O"],
      [null, "O", null],
      [null, null, null]
    ];
    const expectedSelectedCell = [2, 0];
    checkCorrectExpectedMove(board, expectedSelectedCell);
  });

  test("if cannot make self win nor block opponent win, then make centre move", () => {
    const board: Board = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];
    const expectedSelectedCell = [1, 1];
    checkCorrectExpectedMove(board, expectedSelectedCell);
  });

  test("if cannot block opponent win, make self win, nor make centre move, then should make random move ", () => {
    const spyRandom = jest.spyOn(gameControl, "npcStrategyRandom");

    const board: Board = [
      [null, null, null],
      [null, "O", null],
      [null, null, null]
    ];
    
    expect(spyRandom).toHaveBeenCalledTimes(0);
    npcStrategyTactical({ board, npcPlayAs: "X" });
    expect(spyRandom).toHaveBeenCalledTimes(1);
  });
});

describe("checkMoveOutcome", () => {
  test("should detect row xWins", () => {
    const board: Board = [
      ["X", "X", "X"],
      ["O", "O", null],
      [null, null, null],
    ];
    const currentMove: CellMove = { row: 0, col: 2, mark: "X" };

    const result = checkMoveOutcome(board, currentMove);
    expect(result).toEqual(
      expect.objectContaining({ gameOutcome: "xWin", wins: ["rowWin"] })
    );
  });
  test("should detect column xWins", () => {
    const board: Board = [
      ["X", null, "X"],
      ["O", "O", "X"],
      [null, null, "X"],
    ];
    const currentMove: CellMove = { row: 0, col: 2, mark: "X" };

    const result = checkMoveOutcome(board, currentMove);
    expect(result).toEqual(
      expect.objectContaining({ gameOutcome: "xWin", wins: ["colWin"] })
    );
  });
  test("should detect primary diagonal xWins", () => {
    const board: Board = [
      ["X", null, "X"],
      ["O", "X", "O"],
      [null, null, "X"],
    ];
    const currentMove: CellMove = { row: 2, col: 2, mark: "X" };

    const result = checkMoveOutcome(board, currentMove);
    expect(result).toEqual(
      expect.objectContaining({ gameOutcome: "xWin", wins: ["principDiagWin"] })
    );
  });
  test("should detect secondary diagonal xWins", () => {
    const board: Board = [
      ["O", null, "X"],
      ["O", "X", "O"],
      ["X", null, "X"],
    ];
    const currentMove: CellMove = { row: 0, col: 2, mark: "X" };

    const result = checkMoveOutcome(board, currentMove);
    expect(result).toEqual(
      expect.objectContaining({ gameOutcome: "xWin", wins: ["secondDiagWin"] })
    );
  });
  test("should detect multiple xWins", () => {
    const board: Board = [
      ["X", null, "X", null, "X"],
      [null, "X", "X", "X", null],
      ["X", "X", "X", "X", "X"],
      [null, "X", "X", "X", null],
      ["X", null, "X", null, "X"],
    ];
    const currentMove: CellMove = { row: 2, col: 2, mark: "X" };

    const result = checkMoveOutcome(board, currentMove);
    expect(result).toEqual(
      expect.objectContaining({
        gameOutcome: "xWin",
        wins: expect.arrayContaining(["rowWin", "colWin", "principDiagWin", "secondDiagWin"])
      })
    );
  });
  test("should detect oWins", () => {
    const board: Board = [
      ["O", null, "O", null, "O"],
      [null, "O", "O", "O", null],
      ["O", "O", "O", "O", "O"],
      [null, "O", "O", "O", null],
      ["O", null, "O", null, "O"],
    ];
    const currentMove: CellMove = { row: 2, col: 2, mark: "O" };

    const result = checkMoveOutcome(board, currentMove);
    expect(result).toEqual(
      expect.objectContaining({
        gameOutcome: "oWin",
        wins: expect.arrayContaining(["rowWin", "colWin", "principDiagWin", "secondDiagWin"])
      })
    );
  });

  test("should return draw when the board is full with no winner", () => {
    const board: Board = [
      ["X", "O", "X"],
      ["X", "O", "O"],
      ["O", "X", "X"],
    ];
    const currentMove: CellMove = { row: 2, col: 2, mark: "X" };

    const result = checkMoveOutcome(board, currentMove);
    expect(result).toEqual(
      expect.objectContaining({ gameOutcome: "draw", wins: [], })
    );
  });

  test("should return none when the game is not yet finished", () => {
    const board: Board = [
      ["X", "O", "X"],
      ["X", "O", null],
      ["O", null, "X"],
    ];
    const currentMove: CellMove = { row: 1, col: 2, mark: "O" };

    const result = checkMoveOutcome(board, currentMove);
    expect(result).toEqual(
      expect.objectContaining({ gameOutcome: "none", wins: [] })
    );
  });
});
