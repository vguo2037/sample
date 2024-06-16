import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GameStatusContext, SettingsContext } from "../utils";
import { Button, ButtonGroup } from "react-bootstrap";
import { GamePanel, TurnDisplayer } from "../components";
import "../styles/gamePanel.scss";
import type { GameMode } from "../utils/types";
import { handleLose, handleWin, setupNewGame } from "../utils/gameControl";

const GamePage = () => {
  const navigate = useNavigate();
  const gameStatusContext = useContext(GameStatusContext);
  const {
    gameMode, setGameMode,
    score, resetScore,
    undoMove
  } = gameStatusContext;
  const settingsContext = useContext(SettingsContext);

  const ModePicker = () => {
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

  const handleStart = (mode: GameMode) => {
    setGameMode(mode);
    setupNewGame(gameStatusContext);
  };

  return (<>
    <p className="flex-row">{settingsContext?.nickname}'s current score is: {score}
      <span><Button onClick={() => resetScore()}>Reset</Button></span>
    </p>
    <TurnDisplayer />
    { gameMode !== "none" && <div className="center-children">
      <GamePanel />
      { gameMode !== "ended" && <>
        <ButtonGroup>
          <Button variant="success" onClick={() => handleWin(gameStatusContext)}>Win</Button>
          <Button variant="primary" onClick={() => undoMove()}>Undo</Button>
          <Button variant="primary" onClick={() => setGameMode("none")}>Restart</Button>
          <Button variant="danger" onClick={() => handleLose(gameStatusContext)}>Lose</Button>
        </ButtonGroup>
      </> }
    </div> }
    { (gameMode === "none" || gameMode === "ended") && <ModePicker />}
    <ButtonGroup>
      <Button variant="secondary" onClick={() => navigate("/")}>Home</Button>
      <Button variant="secondary" onClick={() => navigate("/settings")}>Settings</Button>
    </ButtonGroup>
  </>);
};

export default GamePage;
