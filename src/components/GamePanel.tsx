import React, { useContext } from 'react';
import GameCell from './GameCell';
import type { CellMove, PlayerTurn } from '../utils/types';
import { Button, ButtonGroup } from 'react-bootstrap';
import { GameStatusContext, SettingsContext } from '../utils';

const GamePanel = () => {
  const {
    gameMode, setGameMode,
    addScore,
    switchCurrentPlayer,
  } = useContext(GameStatusContext);
  const settingsContext = useContext(SettingsContext);
  const backLineColor = settingsContext?.darkMode ? "bg-light" : "bg-dark";

  const handleRestart = () => {
    setGameMode("none");
  };
  const handleWin = () => {
    addScore();
    setGameMode("ended");
  };
  const handleLose = () => {
    setGameMode("ended");
  };
  const handleCellSelect = (move: CellMove) => {
    switchCurrentPlayer();
  }

  return (<div className="center-children">
    <div className={`game-grid ${backLineColor}`}>
      {[0, 1, 2].map(row => {
        return [0, 1, 2].map(col => (
          <GameCell
            row={row} col={col} id={`cell-${row}-${col}`}
            cellSelect={(player: Exclude<PlayerTurn, undefined>) => handleCellSelect({row, col, player})}
          />
        ));
      })}
    </div>
    { gameMode !== "ended" && <>
      <ButtonGroup>
        <Button variant="success" onClick={handleWin}>Win</Button>
        <Button variant="primary" onClick={handleRestart}>Restart</Button>
        <Button variant="danger" onClick={handleLose}>Lose</Button>
      </ButtonGroup>
    </> }
  </div>
  );
};

export default GamePanel;
