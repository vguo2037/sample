import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameStatusContext, SettingsContext } from "../utils";
import { Button, ButtonGroup } from "react-bootstrap";
import { GamePanel, ModePicker, TurnDisplayer } from "../components";
import "../styles/gamePanel.scss";
import { makeNpcMove } from "../utils/gameControl";

const GamePage = () => {
  const navigate = useNavigate();
  const gameStatusContext = useContext(GameStatusContext);
  const {
    gameMode, setGameMode,
    score, resetScore,
    pastMoves, undoMove,
    currentPlayer
  } = gameStatusContext;
  const settingsContext = useContext(SettingsContext);
  const [isNpcTurn, setIsNpcTurn] = useState<boolean>(false);

  useEffect(() => {
    const makeNpcTurn = async () => {
      setIsNpcTurn(true);

      const delayTime = Math.random() * 1000 + 500;
      await new Promise(res => setTimeout(res, delayTime)); // delay for realism

      makeNpcMove(gameStatusContext);
      setIsNpcTurn(false);
    };

    if (gameMode === "NPC" && currentPlayer === "O") makeNpcTurn();
  }, [currentPlayer]); // eslint-disable-line react-hooks/exhaustive-deps

  return (<>
    <p className="flex-row">{settingsContext?.nickname}'s current score is: {score}
      <span><Button variant="secondary" onClick={() => resetScore()}>Reset</Button></span>
    </p>
    <TurnDisplayer isNpcTurn={isNpcTurn} />
    { gameMode !== "none" && <div className="center-children">
      <GamePanel disabled={isNpcTurn || gameMode === "ended"} />
      { gameMode !== "ended" && <>
        <ButtonGroup>
          <Button variant="primary" disabled={isNpcTurn || pastMoves.length===0} onClick={() => undoMove()}
          >
            Undo
          </Button>
          <Button variant="primary" disabled={isNpcTurn} onClick={() => setGameMode("none")}>Restart</Button>
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
