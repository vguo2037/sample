import React, { useContext, forwardRef, useRef, useEffect, useCallback } from 'react';
import GameCell from './GameCell';
import { motion } from "framer-motion";
import { GameStatusContext } from '../utils';
import { CellCoords, GameCellObject } from '../utils/types';

interface GamePanelProps {
  disabled: boolean
};

const GamePanel = forwardRef<unknown, GamePanelProps>(({ disabled }, ref) => {
  const { gameMode, winningCells } = useContext(GameStatusContext);
  const cellRefs = useRef<(GameCellObject | null)[]>([]);
  const panelStyle = gameMode === "none"
    ? { height: 0 }
    : { height: "fit-content" }
  ;

  const animateWinningCells = useCallback((winningCells: CellCoords[]) => {
    console.debug("displayWin");

    if (!winningCells) return;
    for (const c of winningCells) {
      const idx = c.row * 3 + c.col;
      cellRefs.current[idx]?.setIsWinningCell(true);
    }
  }, []);

  const clearWinningCells = useCallback(() => {
    for (let i=0; i<9; i++) cellRefs.current[i]?.setIsWinningCell(false);
  }, []);

  useEffect(() => {
    if (winningCells.length === 0) clearWinningCells();
    else animateWinningCells(winningCells);
  }, [winningCells.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (<motion.div
    // required prevent replays of mounting/unmounting animation on page changes
    initial={panelStyle} animate={panelStyle}
    transition={{ type: "tween" }}
  >
    <div className={"game-grid"}>
      {Array.from(Array(9).keys()).map(i => {
        const [row, col] = [Math.floor(i / 3), i % 3];
        return <GameCell disabled={disabled} key={`cell-${row}-${col}`}
          row={row} col={col} id={`cell-${row}-${col}`} ref={obj => cellRefs.current[i] = obj} 
        />
      })}
    </div>
  </motion.div>);
});

export default GamePanel;
