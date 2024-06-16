import { createContext, useRef, useState } from "react";
import type { GameMode, GameOutcome, PlayerTurn, GameStatus, Board, CellMove } from "../types";
import { noop } from "../gameControl";

const emptyGameStatus: GameStatus = { 
  score: 0, addScore: noop, resetScore: noop,
  currentPlayer: "X", switchCurrentPlayer: noop,
  gameMode: "none", setGameMode: noop,
  gameOutcome: "none", setGameOutcome: noop,
  board: Array(3).fill(Array(3).fill(null)), handleCellSelect: noop, resetBoard: noop,
  pastMoves: [], undoMove: noop
};

export const GameStatusContext = createContext<GameStatus>(emptyGameStatus);

export const useGameStatusValues = () => {
  const [score, setScore] = useState<number>(emptyGameStatus.score);
  const [currentPlayer, setCurrentPlayer] = useState<PlayerTurn>(emptyGameStatus.currentPlayer);
  const [gameMode, setGameMode] = useState<GameMode>(emptyGameStatus.gameMode);
  const [gameOutcome, setGameOutcome] = useState<GameOutcome>(emptyGameStatus.gameOutcome);
  const [board, setBoard] = useState<Board>(emptyGameStatus.board);
  const pastMoves = useRef<Array<CellMove>>(emptyGameStatus.pastMoves);

  const addScore = () => setScore(s => s + 1);
  const resetScore = () => {
    if (window.confirm("Are you sure you want to reset your score? There is no undoing this action!")) {
      setScore(0);
    };
  };

  const switchCurrentPlayer = () => {
    if (currentPlayer !== "X") setCurrentPlayer("X");
    else setCurrentPlayer("O");
  };

  const setBoardCell = (
    {row, col, player}: Pick<CellMove, "row" | "col"> & { player: null | PlayerTurn }
  ) => {
    setBoard(board => {
      const boardCopy = JSON.parse(JSON.stringify(board)); 
      boardCopy[row][col] = player;
      return boardCopy;
    });
  };
  const handleCellSelect = (move: CellMove) => {
    switchCurrentPlayer();
    setBoardCell(move);
    pastMoves.current.push(move);
  };
  const resetBoard = () => {
    setBoard(emptyGameStatus.board);
  };

  const undoMove = () => {
    if (pastMoves.current.length === 0) return;

    const lastMove: CellMove = pastMoves.current.pop() as CellMove;
    setBoardCell({ row: lastMove.row, col: lastMove.col, player: null });

    if (gameMode === "NPC" && pastMoves.current.length !== 0) {
      const lastPlayerMove = pastMoves.current.pop() as CellMove;
      setBoardCell({ row: lastPlayerMove.row, col: lastPlayerMove.col, player: null });
    };
  };

  return {
    score, addScore, resetScore,
    currentPlayer, switchCurrentPlayer,
    gameMode, setGameMode,
    gameOutcome, setGameOutcome,
    board, handleCellSelect, resetBoard,
    pastMoves: pastMoves.current, undoMove
  };
};
