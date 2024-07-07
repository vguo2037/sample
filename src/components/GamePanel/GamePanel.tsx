import React, { useContext, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { GameCell } from "..";
import { GameStatusContext, SettingsContext } from "../../utils";
import type { CellCoords, GameCellObject, WinType } from "../../utils/types";
import { getWinningCells } from "../../utils/gameControl";

const GamePanel = () => {
  const { gameMode, gameOutcome, pastMoves, wins, currentPlayer } = useContext(GameStatusContext);
  const { boardSize, playerPlayAs } = useContext(SettingsContext);
  const cellRefs = useRef<(GameCellObject | null)[]>([]);
  const panelStyle = gameMode === "none"
    ? { height: 0 }
    : { height: "fit-content" }
  ;
  const winningCells = useRef<CellCoords[]>([]);

  const isNpcTurn = gameMode === "NPC" && currentPlayer !== playerPlayAs;
  const disabled = isNpcTurn || gameMode === "ended";

  useEffect(() => {
    if (gameOutcome === "oWin" || gameOutcome === "xWin") {
      const lastMove = pastMoves[pastMoves.length - 1];
      winningCells.current = getWinningCells(wins as WinType[], lastMove, boardSize);
    }
  }, [gameMode, gameOutcome, pastMoves, wins, boardSize])

  const animateWinningCells = useCallback((winningCells: CellCoords[]) => {
    if (!winningCells) return;
    for (const c of winningCells) {
      const idx = c.row * boardSize + c.col;
      cellRefs.current[idx]?.setIsWinningCell(true);
    }
  }, [boardSize]);

  const clearWinningCells = useCallback(() => {
    for (let i=0; i<boardSize*boardSize; i++) cellRefs.current[i]?.setIsWinningCell(false);
  }, [boardSize]);

  useEffect(() => {
    if (wins.length === 0) clearWinningCells();
    else animateWinningCells(winningCells.current);
  }, [wins.length, winningCells, animateWinningCells, clearWinningCells]);

  // const gridTemplateAreas = `${("'" + (". ".repeat(boardSize)) + "' ").repeat(boardSize)}`

  return (<motion.div
    className="game-grid-wrapper"
    data-testid="test-gamepanel"
    // required prevent replays of mounting/unmounting animation on page changes
    initial={panelStyle} animate={panelStyle}
    transition={{ type: "tween" }}
  >
    <div className={`game-grid board-size-${boardSize}`}>
    {/* <div className={"game-grid"} style={{ gridTemplateAreas }}> */}
      {Array.from(Array(boardSize*boardSize).keys()).map(i => {
        const [row, col] = [Math.floor(i / boardSize), i % boardSize];
        return <GameCell disabled={disabled} key={`cell-${row}-${col}`}
          row={row} col={col} id={`cell-${row}-${col}`} ref={obj => cellRefs.current[i] = obj} 
        />
      })}
    </div>
  </motion.div>);
};

export default GamePanel;
