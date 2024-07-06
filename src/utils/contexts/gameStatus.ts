import { createContext, useEffect, useRef, useState } from "react";
import type { GameMode, GameOutcome, PlayerMark, GameStatus, Board, CellMove, NPCDifficulty, WinType, BoardSize } from "../types";
import { checkMoveOutcome, noop } from "../gameControl";

const createBoard = (boardSize: BoardSize) => Array(boardSize).fill(Array(boardSize).fill(null));

const emptyGameStatus: GameStatus = { 
  score: 0, addScore: noop, resetScore: noop,
  currentPlayer: "X", switchCurrentPlayer: noop,
  gameMode: "none", setGameMode: noop,
  gameOutcome: "none", setGameOutcome: noop,
  board: createBoard(3), handleCellSelect: noop, resetHistory: noop,
  pastMoves: [], undoMove: noop,
  npcDifficulty: 0, setNpcDifficulty: noop,
  wins: []
};

export const GameStatusContext = createContext<GameStatus>(emptyGameStatus);

export const useGameStatusValues = () => {
  const [score, setScore] = useState<number>(emptyGameStatus.score);
  const [currentPlayer, setCurrentPlayer] = useState<PlayerMark>(emptyGameStatus.currentPlayer);
  const [gameMode, setGameMode] = useState<GameMode>(emptyGameStatus.gameMode);
  const [gameOutcome, setGameOutcome] = useState<GameOutcome>(emptyGameStatus.gameOutcome);
  const [board, setBoard] = useState<Board>(emptyGameStatus.board);
  const pastMoves = useRef<CellMove[]>(emptyGameStatus.pastMoves);
  const [npcDifficulty, setNpcDifficulty] = useState<NPCDifficulty>(emptyGameStatus.npcDifficulty);
  const [lastActionIsUndo, setLastActionIsUndo] = useState<boolean>(false);
  const wins = useRef<WinType[]>(emptyGameStatus.wins);

  const addScore = () => setScore(s => s + 1);
  const resetScore = () => {
    if (window.confirm("Are you sure you want to reset your score? There is no undoing this action!")) {
      setScore(0);
    };
  };

  const switchCurrentPlayer = () => {
    setCurrentPlayer(p => p === "X" ? "O" : "X");
  };

  const setBoardCell = (
    { row, col, mark }: Pick<CellMove, "row" | "col"> & { mark: null | PlayerMark }
  ) => {
    setBoard(board => {
      const boardCopy = JSON.parse(JSON.stringify(board)); 
      boardCopy[row][col] = mark;
      return boardCopy;
    });
  };
  const handleCellSelect = (move: CellMove) => {
    setBoardCell(move);
    pastMoves.current.push(move);
  };
  const resetHistory = (newBoardSize: BoardSize) => {
    setBoard(createBoard(newBoardSize));
    setCurrentPlayer("X");
    pastMoves.current = [];
    setLastActionIsUndo(false);
    setGameOutcome("none");
    setGameMode("none");
    wins.current = [];
  };

  useEffect(() => {
    if (!pastMoves.current.length) return;
    if (lastActionIsUndo) {
      setLastActionIsUndo(false);
      return;
    };

    const lastMove = pastMoves.current[pastMoves.current.length-1];
    const { gameOutcome, wins: moveWins } = checkMoveOutcome(board, lastMove);
    wins.current = moveWins;
    if (gameOutcome !== "none") {
      setGameMode("ended");
      setGameOutcome(gameOutcome);
    } else {
      switchCurrentPlayer();
    };
  }, [board]); // eslint-disable-line react-hooks/exhaustive-deps

  const undoMove = () => {
    if (pastMoves.current.length === 0) return;

    setLastActionIsUndo(true);

    const lastMove: CellMove = pastMoves.current.pop() as CellMove;
    setBoardCell({ row: lastMove.row, col: lastMove.col, mark: null });

    if (gameMode !== "NPC") {
      switchCurrentPlayer();
      return;
    }
    if (gameMode === "NPC" && pastMoves.current.length !== 0) {
      const lastPlayerMove = pastMoves.current.pop() as CellMove;
      setBoardCell({ row: lastPlayerMove.row, col: lastPlayerMove.col, mark: null });
    };
  };

  return {
    score, addScore, resetScore,
    currentPlayer, switchCurrentPlayer,
    gameMode, setGameMode,
    gameOutcome, setGameOutcome,
    board, handleCellSelect, resetHistory,
    pastMoves: pastMoves.current, undoMove,
    npcDifficulty, setNpcDifficulty,
    wins: wins.current,
  };
};
