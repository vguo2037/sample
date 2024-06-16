import React, { useContext } from 'react';
import GameCell from './GameCell';
import type { GameMode } from '../utils/types';
import { Button, ButtonGroup } from 'react-bootstrap';
import { GameContext } from '../utils';

interface GamePanelProps {
  gameMode: GameMode;
  setGameMode: Function;
}

const GamePanel: React.FC<GamePanelProps> = ({ gameMode, setGameMode }) => {
  const gameContext = useContext(GameContext);

  const handleRestart = () => {
    setGameMode("none");
  };
  const handleWin = () => {
    if (gameContext) gameContext.addScore();
    setGameMode("ended");
  };
  const handleLose = () => {
    setGameMode("ended");
  };

  return (<div>
    <div className='game-grid'>
      {[0, 1, 2].map(row => {
        return [0, 1, 2].map(col => <GameCell row={row} col={col} id={`cell-${row}-${col}`} />);
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
