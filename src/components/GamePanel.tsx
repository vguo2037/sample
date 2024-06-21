import React, { useContext } from 'react';
import GameCell from './GameCell';
import { motion } from "framer-motion";
import { GameStatusContext } from '../utils';

interface GamePanelProps {
  disabled: boolean
};

const GamePanel: React.FC<GamePanelProps> = ({ disabled }) => {
  const { gameMode } = useContext(GameStatusContext);
  const panelStyle = gameMode === "none"
    ? { height: 0 }
    : { height: "fit-content" }
  ;

  return (<motion.div
    // required to prevent replays of mounting/unmounting animation when game mode doesn't change across pages
    initial={panelStyle}
    animate={panelStyle}
    transition={{ type: "tween" }}
  >
    <div className={"game-grid"}>
      {[0, 1, 2].map(row => {
        return [0, 1, 2].map(col => (
          <GameCell disabled={disabled} key={`cell-${row}-${col}`}
            row={row} col={col} id={`cell-${row}-${col}`}
          />
        ));
      })}
    </div>
  </motion.div>);
};

export default GamePanel;
