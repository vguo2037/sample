import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameStatusContext, SettingsContext } from "../utils";
import { Button, ButtonGroup } from "react-bootstrap";
import { GamePanel } from "../components";
import "../styles/gamePanel.scss";
import type { GameMode } from "../utils/types";
import { setupNewGame } from "../utils/gameControl";

const GamePage = () => {
  const navigate = useNavigate();
  const gameStatusContext = useContext(GameStatusContext);
  const {
    gameMode, setGameMode,
    score, resetScore,
    currentPlayer, switchCurrentPlayer
  } = gameStatusContext;
  const settingsContext = useContext(SettingsContext);

  const GameModePicker = () => {
    return (<div className="center-children">
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
      resetScore();
    };
  };
  const handleStart = (mode: GameMode) => {
    setGameMode(mode);
    setupNewGame(gameStatusContext);
  };

  return (<>
    <p className="flex-row">{settingsContext?.nickname}'s current score is: {score}
      <span><Button onClick={handleReset}>Reset</Button></span>
    </p>
    { gameMode !== "none" && gameMode !== "ended" && <p>It is Player {currentPlayer}'s turn!</p> }
    { gameMode !== "none" && <GamePanel /> }
    { (gameMode === "none" || gameMode === "ended") && <GameModePicker />}
    <ButtonGroup>
      <Button variant="secondary" onClick={() => navigate("/")}>Home</Button>
      <Button variant="secondary" onClick={() => navigate("/settings")}>Settings</Button>
    </ButtonGroup>
  </>);
};

export default GamePage;
