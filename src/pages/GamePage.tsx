import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../utils";
import { Button, ButtonGroup } from "react-bootstrap";
import { GamePanel } from "../components";
import "../styles/gamePanel.scss";
import { GameMode } from "../utils/types";

const GamePage = () => {
  const navigate = useNavigate();
  const gameContext = useContext(GameContext);
  const [gameMode, setGameMode] = useState<GameMode>("none");

  const GameModePicker = () => {
    return (<div>
      <p>{gameMode === "none" ? "Start a" : "Play another"} round with:</p>
      <ButtonGroup>
        <Button variant="primary" onClick={() => handleStart("NPC")}>An NPC</Button>
        <Button variant="primary" onClick={() => handleStart("multiplayer")} data-title="Score goes to Player 1 (X)" >
          Another player
        </Button>
      </ButtonGroup>
    </div>);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset your score? There is no undoing this action!")) {
      if (gameContext) gameContext.resetScore();
    };
  };
  const handleStart = (mode: GameMode) => {
    setGameMode(mode);
  };

  return (<>
    <p>Your current score is: {gameContext?.score}
      <span><Button onClick={handleReset}>Reset</Button></span>
    </p>
    { gameMode !== "none" && <GamePanel gameMode={gameMode} setGameMode={setGameMode} /> }
    { (gameMode === "none" || gameMode === "ended") && <GameModePicker />}
    <ButtonGroup>
      <Button variant="secondary" onClick={() => navigate("/")}>Home</Button>
      <Button variant="secondary" onClick={() => navigate("/settings")}>Settings</Button>
    </ButtonGroup>
  </>);
};

export default GamePage;
