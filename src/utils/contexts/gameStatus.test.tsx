// tests for the context's value initialisation and exposed functions

import React, { useContext } from "react";
import { act, GetByText, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useGameStatusValues, GameStatusContext, createBoard } from "./gameStatus";
import type {
  Board,
  BoardSize,
  CellMove,
  GameMode,
  GameOutcome,
  GameStatusValues,
  NPCDifficulty,
  WinType,
} from "../types";
import { checkMoveOutcome, reverseMark } from "../gameControl";

global.confirm = jest.fn();

const initialBoard: Board = [
  ["O", "X", "O"],
  ["O", "O", "X"],
  ["X", "X", null],
];
const initialPastMoves: CellMove[] = [
  { row: 0, col: 1, mark: "X" },
  { row: 1, col: 1, mark: "O" },
  { row: 2, col: 1, mark: "X" },
  { row: 0, col: 2, mark: "O" },
  { row: 1, col: 2, mark: "X" },
  { row: 1, col: 0, mark: "O" },
  { row: 2, col: 0, mark: "X" },
  { row: 0, col: 0, mark: "O" },
];
const initialGameStatus: GameStatusValues = {
  score: 4,
  currentPlayer: "X",
  gameMode: "NPC",
  gameOutcome: "none",
  board: JSON.parse(JSON.stringify(initialBoard)),
  pastMoves: JSON.parse(JSON.stringify(initialPastMoves)),
  npcDifficulty: 2,
  wins: [],
};

const TestRenderWrapper = ({ children, gsOverride }: {
  children: React.ReactNode,
  gsOverride?: Partial<GameStatusValues>
}) => {
  const gameStatusContext = useGameStatusValues({...initialGameStatus, ...gsOverride});
  return (
    <GameStatusContext.Provider value={gameStatusContext}>
      {children}
    </GameStatusContext.Provider>
  );
};

const TestValuesRender = () => {
  const {
    score,
    currentPlayer,
    gameMode,
    gameOutcome,
    board,
    pastMoves,
    npcDifficulty,
    wins,
  } = useContext(GameStatusContext);

  return (
    <>
      <div>score: {score}</div>
      <div>currentPlayer: {currentPlayer}</div>
      <div>gameMode: {gameMode}</div>
      <div>gameOutcome: {gameOutcome}</div>
      <div>board: {JSON.stringify(board)}</div>
      <div>pastMoves: {JSON.stringify(pastMoves)}</div>
      <div>npcDifficulty: {npcDifficulty}</div>
      <div>wins: {JSON.stringify(wins)}</div>
    </>
  );
};

type TestFunctionsRenderProps = {
  updatedGameMode?: GameMode;
  updatedGameOutcome?: GameOutcome;
  nextCellMove?: CellMove;
  boardSize?: BoardSize;
  updatedNpcDifficulty?: NPCDifficulty;
};

const TestFunctionsRender: React.FC<TestFunctionsRenderProps> = ({
  updatedGameMode,
  updatedGameOutcome,
  nextCellMove,
  boardSize,
  updatedNpcDifficulty,
}) => {
  const {
    addScore,
    resetScore,
    switchCurrentPlayer,
    setGameMode,
    setGameOutcome,
    handleCellSelect,
    resetHistory,
    undoMove,
    setNpcDifficulty,
  } = useContext(GameStatusContext);

  const handleSetGameMode = () => {
    if (updatedGameMode === undefined) return;
    setGameMode(updatedGameMode);
  };

  const handleSetGameOutcome = () => {
    if (updatedGameOutcome === undefined) return;
    setGameOutcome(updatedGameOutcome);
  };

  const handleHandleCellSelect = () => {
    if (nextCellMove === undefined) return;
    handleCellSelect(nextCellMove);
  };

  const handleResetHistory = () => {
    if (boardSize === undefined) return;
    resetHistory(boardSize);
  };

  const handleSetNpcDifficulty = () => {
    if (updatedNpcDifficulty === undefined) return;
    setNpcDifficulty(updatedNpcDifficulty);
  };

  return (
    <>
      <button onClick={addScore}>addScore</button>
      <button onClick={resetScore}>resetScore</button>
      <button onClick={switchCurrentPlayer}>switchCurrentPlayer</button>
      <button onClick={handleSetGameMode}>setGameMode</button>
      <button onClick={handleSetGameOutcome}>setGameOutcome</button>
      <button onClick={handleHandleCellSelect}>handleCellSelect</button>
      <button onClick={handleResetHistory}>resetHistory</button>
      <button onClick={undoMove}>undoMove</button>
      <button onClick={handleSetNpcDifficulty}>setNpcDifficulty</button>
    </>
  );
};

test("useGameStatusValues's functions render initial context values correctly", () => {
  render(
    <TestRenderWrapper>
      <TestValuesRender />
    </TestRenderWrapper>,
  );

  const {
    score: expectedScore,
    currentPlayer: expectedCurrentPlayer,
    gameMode: expectedGameMode,
    gameOutcome: expectedGameOutcome,
    board: expectedBoard,
    pastMoves: expectedPastMoves,
    npcDifficulty: expectedNpcDifficulty,
    wins: expectedWins,
  } = initialGameStatus;

  expect(screen.getByText(`score: ${expectedScore}`)).toBeInTheDocument();
  expect(
    screen.getByText(`currentPlayer: ${expectedCurrentPlayer}`),
  ).toBeInTheDocument();
  expect(screen.getByText(`gameMode: ${expectedGameMode}`)).toBeInTheDocument();
  expect(
    screen.getByText(`gameOutcome: ${expectedGameOutcome}`),
  ).toBeInTheDocument();
  expect(screen.getByText(`board: ${JSON.stringify(expectedBoard)}`)).toBeInTheDocument();
  expect(
    screen.getByText(`pastMoves: ${JSON.stringify(expectedPastMoves)}`),
  ).toBeInTheDocument();
  expect(
    screen.getByText(`npcDifficulty: ${expectedNpcDifficulty}`),
  ).toBeInTheDocument();
  expect(screen.getByText(`wins: ${JSON.stringify(expectedWins)}`)).toBeInTheDocument();
});

describe("useGameStatusValues's functions modify context values correctly", () => {
  test("addScore should increment current score by one", () => {
    render(
      <TestRenderWrapper>
        <TestValuesRender />
        <TestFunctionsRender />
      </TestRenderWrapper>,
    );

    const addScoreButton = screen.getByText("addScore");
    act(() => {
      addScoreButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const { score: initialScore } = initialGameStatus;
    const expectedScore = initialScore + 1;
    expect(screen.getByText(`score: ${expectedScore}`)).toBeInTheDocument();
  });

  describe("resetScore", () => {
    let resetScoreButton: ReturnType<GetByText<HTMLElement>>;

    beforeEach(() => {
      render(
        <TestRenderWrapper>
          <TestValuesRender />
          <TestFunctionsRender />
        </TestRenderWrapper>,
      );
  
      const addScoreButton = screen.getByText("addScore");
      act(() => {
        addScoreButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });

      resetScoreButton = screen.getByText("resetScore");
    });

    const initialScore = initialGameStatus.score + 1; // ensures score > 0

    test("should not modify score if user cancells operation", () => {
      (confirm as jest.Mock).mockReturnValueOnce(false);

      act(() => {
        resetScoreButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });

      expect(confirm).toHaveBeenCalledTimes(1);
      expect(screen.getByText(`score: ${initialScore}`)).toBeInTheDocument();
    });

    test("should modify score if user confirms operation", () => {
      (confirm as jest.Mock).mockReturnValueOnce(true);
      
      act(() => {
        resetScoreButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });

      expect(confirm).toHaveBeenCalledTimes(1);
      expect(screen.getByText("score: 0")).toBeInTheDocument();
    });
  });

  test("switchCurrentPlayer", () => {
    render(
      <TestRenderWrapper>
        <TestValuesRender />
        <TestFunctionsRender />
      </TestRenderWrapper>,
    );

    const switchCurrentPlayerButton = screen.getByText("switchCurrentPlayer");
    act(() => {
      switchCurrentPlayerButton.dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      );
    });

    const { currentPlayer: initialCurrentPlayer } = initialGameStatus;
    const expectedCurrentPlayer = reverseMark(initialCurrentPlayer);
    expect(
      screen.getByText(`currentPlayer: ${expectedCurrentPlayer}`),
    ).toBeInTheDocument();
  });

  test("setGameMode", () => {
    const expectedGameMode = "none";

    render(
      <TestRenderWrapper>
        <TestValuesRender />
        <TestFunctionsRender updatedGameMode={expectedGameMode} />
      </TestRenderWrapper>,
    );

    const setGameModeButton = screen.getByText("setGameMode");
    act(() => {
      setGameModeButton.dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      );
    });
  });

  test("setGameOutcome", () => {
    const expectedGameOutcome = "draw";

    render(
      <TestRenderWrapper>
        <TestValuesRender />
        <TestFunctionsRender updatedGameOutcome={expectedGameOutcome} />
      </TestRenderWrapper>,
    );

    const setGameOutcomeButton = screen.getByText("setGameOutcome");
    act(() => {
      setGameOutcomeButton.dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      );
    });

    expect(
      screen.getByText(`gameOutcome: ${expectedGameOutcome}`),
    ).toBeInTheDocument();
  });

  test("handleCellSelect", () => {
    // given current initialGameStatus, game will end with an "xWin" after this move
    const nextCellMove: CellMove = { row: 2, col: 2, mark: "X" };

    render(
      <TestRenderWrapper>
        <TestValuesRender />
        <TestFunctionsRender nextCellMove={nextCellMove} />
      </TestRenderWrapper>,
    );

    const handleCellSelectButton = screen.getByText("handleCellSelect");
    act(() => {
      handleCellSelectButton.dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      );
    });

    // expect board to render chosen cell with new move mark
    const expectedBoard = JSON.parse(JSON.stringify(initialBoard));
    expectedBoard[nextCellMove.row][nextCellMove.col] = nextCellMove.mark;
    expect(screen.getByText(`board: ${JSON.stringify(expectedBoard)}`)).toBeInTheDocument();

    // expect new move to be added to pastMoves
    const expectedPastMoves = JSON.parse(JSON.stringify(initialPastMoves));
    expectedPastMoves.push(nextCellMove);
    expect(screen.getByText(`pastMoves: ${JSON.stringify(expectedPastMoves)}`)).toBeInTheDocument();

    // expect gameOutcome & wins to be updated (if a game-ending move is made)
    const { gameOutcome: expectedGameOutcome, wins: expectedWins } =
      checkMoveOutcome(expectedBoard, nextCellMove);
    expect(
      screen.getByText(`gameOutcome: ${expectedGameOutcome}`),
    ).toBeInTheDocument();
    expect(screen.getByText(`wins: ${JSON.stringify(expectedWins)}`)).toBeInTheDocument();

    // expect gameMode to change (if a game-ending move is made)
    const expectedGameMode = "ended";
    expect(screen.getByText(`gameMode: ${expectedGameMode}`)).toBeInTheDocument();
  });

  test("resetHistory", () => {
    const updatedBoardSize = 5;
    render(
      <TestRenderWrapper>
        <TestValuesRender />
        <TestFunctionsRender boardSize={updatedBoardSize} />
      </TestRenderWrapper>,
    );

    const resetHistoryButton = screen.getByText("resetHistory");
    act(() => {
      resetHistoryButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    // expect gameOutcome to be reset to "none"
    const expectedGameOutcome = "none";
    expect(screen.getByText(`gameOutcome: ${expectedGameOutcome}`)).toBeInTheDocument();

    // expect pastMoves to be cleared
    const expectedPastMoves: CellMove[] = [];
    expect(screen.getByText(`pastMoves: ${JSON.stringify(expectedPastMoves)}`)).toBeInTheDocument();

    // expect wins to be cleared
    const expectedWins: WinType[] = [];
    expect(screen.getByText(`wins: ${JSON.stringify(expectedWins)}`)).toBeInTheDocument();

    // expect board to be reset to a clean board of the right boardSize
    const expectedBoard = createBoard(updatedBoardSize);
    expect(screen.getByText(`board: ${JSON.stringify(expectedBoard)}`)).toBeInTheDocument();
  });

  test("undoMove during NPC mode, when there are ≥2 moves on the board", () => {
    render(
      <TestRenderWrapper>
        <TestValuesRender />
        <TestFunctionsRender />
      </TestRenderWrapper>,
    );

    const undoMoveButton = screen.getByText("undoMove");
    act(() => {
      undoMoveButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    // expect the last 2 moves from pastMoves to have been removed
    const expectedPastMoves: CellMove[] = [
      { row: 0, col: 1, mark: "X" },
      { row: 1, col: 1, mark: "O" },
      { row: 2, col: 1, mark: "X" },
      { row: 0, col: 2, mark: "O" },
      { row: 1, col: 2, mark: "X" },
      { row: 1, col: 0, mark: "O" },
    ];
    expect(screen.getByText(`pastMoves: ${JSON.stringify(expectedPastMoves)}`)).toBeInTheDocument();

    // expect the last 2 moves on the board to have been cleared
    const expectedBoard = [
      [null, "X", "O"],
      ["O", "O", "X"],
      [null, "X", null],
    ];
    expect(screen.getByText(`board: ${JSON.stringify(expectedBoard)}`)).toBeInTheDocument();
  });

  test("undoMove during NPC mode, when there is only 1 move on the board", () => {
    const initialBoard: Board = [
      [null, null, "X"],
      [null, null, null],
      [null, null, null],
    ];
    const initialPastMoves: CellMove[] = [{ row: 0, col: 2, mark: "X" }];
    
    render(
      <TestRenderWrapper gsOverride={{
        board: initialBoard,
        pastMoves: initialPastMoves
      }} >
        <TestValuesRender />
        <TestFunctionsRender />
      </TestRenderWrapper>,
    );

    const undoMoveButton = screen.getByText("undoMove");
    act(() => {
      undoMoveButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    // expect the last move from pastMoves to have been removed
    const expectedPastMoves: CellMove[] = [];
    expect(screen.getByText(`pastMoves: ${JSON.stringify(expectedPastMoves)}`)).toBeInTheDocument();

    // expect the last move on the board to have been cleared
    const expectedBoard = createBoard(3);
    expect(screen.getByText(`board: ${JSON.stringify(expectedBoard)}`)).toBeInTheDocument();
  });

  test("undoMove during multiplayer mode", () => {
    render(
      <TestRenderWrapper gsOverride={{ gameMode: "multiplayer" }}>
        <TestValuesRender />
        <TestFunctionsRender />
      </TestRenderWrapper>,
    );

    const undoMoveButton = screen.getByText("undoMove");
    act(() => {
      undoMoveButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    // expect the last 2 moves from pastMoves to have been removed
    const expectedPastMoves: CellMove[] = [
      { row: 0, col: 1, mark: "X" },
      { row: 1, col: 1, mark: "O" },
      { row: 2, col: 1, mark: "X" },
      { row: 0, col: 2, mark: "O" },
      { row: 1, col: 2, mark: "X" },
      { row: 1, col: 0, mark: "O" },
      { row: 2, col: 0, mark: "X" },
    ];
    expect(screen.getByText(`pastMoves: ${JSON.stringify(expectedPastMoves)}`)).toBeInTheDocument();

    // expect the last 2 moves on the board to have been cleared
    const expectedBoard = [
      [null, "X", "O"],
      ["O", "O", "X"],
      ["X", "X", null],
    ];
    expect(screen.getByText(`board: ${JSON.stringify(expectedBoard)}`)).toBeInTheDocument();
  });

  test("setNpcDifficulty", () => {
    const expectedNpcDifficulty = 0;

    render(
      <TestRenderWrapper>
        <TestValuesRender />
        <TestFunctionsRender updatedNpcDifficulty={expectedNpcDifficulty} />
      </TestRenderWrapper>,
    );

    const setNpcDifficultyButton = screen.getByText("setNpcDifficulty");
    act(() => {
      setNpcDifficultyButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(screen.getByText(`npcDifficulty: ${expectedNpcDifficulty}`)).toBeInTheDocument();
  });
});
