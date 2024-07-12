import { createContext, useEffect, useRef, useState } from "react";
import type { GameMode, GameOutcome, PlayerMark, GameStatus, Board, CellMove, NPCDifficulty, WinType, BoardSize, GameStatusValues } from "../types";
import { checkMoveOutcome, noop } from "../gameControl";

export const createBoard = (boardSize: BoardSize) => Array(boardSize).fill(Array(boardSize).fill(null));

export const defaultGameStatus: GameStatusValues = {
  score: 0,
  currentPlayer: "X",
  gameMode: "none",
  gameOutcome: "none", 
  board: createBoard(3),
  pastMoves: [],
  npcDifficulty: 0,
  wins: []
};

export const GameStatusContext = createContext<GameStatus>({
  ...defaultGameStatus,
  addScore: noop, resetScore: noop,
  switchCurrentPlayer: noop,
  setGameMode: noop,
  setGameOutcome: noop,
  handleCellSelect: noop, resetHistory: noop,
  undoMove: noop,
  setNpcDifficulty: noop
});

export const useGameStatusValues = (initialGS: GameStatusValues) => {
  const [score, setScore] = useState<number>(initialGS.score);
  const [currentPlayer, setCurrentPlayer] = useState<PlayerMark>(initialGS.currentPlayer);
  const [gameMode, setGameMode] = useState<GameMode>(initialGS.gameMode);
  const [gameOutcome, setGameOutcome] = useState<GameOutcome>(initialGS.gameOutcome);
  const [board, setBoard] = useState<Board>(JSON.parse(JSON.stringify(initialGS.board)));
  const pastMoves = useRef<CellMove[]>(JSON.parse(JSON.stringify(initialGS.pastMoves)));
  const [npcDifficulty, setNpcDifficulty] = useState<NPCDifficulty>(initialGS.npcDifficulty);
  const wins = useRef<WinType[]>(JSON.parse(JSON.stringify(initialGS.wins)));
  const [lastActionIsUndo, setLastActionIsUndo] = useState<boolean>(false);

  const addScore = () => setScore(s => s + 1);
  const resetScore = () => {
    if (window.confirm("Are you sure you want to reset your score? There is no undoing this action!")) {
      setScore(0);
    }
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
    setLastActionIsUndo(false);
  };

  const resetHistory = (newBoardSize: BoardSize) => {
    setBoard(createBoard(newBoardSize));
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
    }

    const lastMove = pastMoves.current[pastMoves.current.length-1];
    if (lastMove.mark === currentPlayer) {
      switchCurrentPlayer();
    }

    const { gameOutcome, wins: moveWins } = checkMoveOutcome(board, lastMove);
    wins.current = moveWins;
    if (gameOutcome !== "none") {
      setGameMode("ended");
      setGameOutcome(gameOutcome);
    }
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
    }
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
