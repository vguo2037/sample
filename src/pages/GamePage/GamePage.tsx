import React, { useContext, useEffect, useState } from "react";
import "../../styles/gamePanel.scss";
import { useNavigate } from "react-router-dom";
import { Button, ButtonGroup } from "react-bootstrap";
import { GameStatusContext, SettingsContext } from "../../utils";
import { GamePanel, ModePicker, PageStyleWrapper, TurnDisplayer } from "../../components";
import { makeNpcMove, reverseMark, winningOutcome } from "../../utils/gameControl";

const GamePage = () => {
  const navigate = useNavigate();
  const gameStatusContext = useContext(GameStatusContext);
  const {
    gameMode, setGameMode,
    gameOutcome,
    score, addScore, resetScore,
    pastMoves, undoMove,
    currentPlayer
  } = gameStatusContext;
  const { nickname, playerPlayAs } = useContext(SettingsContext);
  const [isNpcTurn, setIsNpcTurn] = useState<boolean>(false);

  useEffect(() => {
    if (winningOutcome(playerPlayAs, gameOutcome)) addScore();
  }, [gameOutcome]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const npcPlayAs = reverseMark(playerPlayAs);

    const makeNpcTurn = async () => {
      setIsNpcTurn(true);

      const delayTime = Math.random() * 1000 + 500;
      await new Promise(res => setTimeout(res, delayTime)); // delay for realism

      makeNpcMove(gameStatusContext, npcPlayAs);
      setIsNpcTurn(false);
    };

    if (gameMode === "NPC" && currentPlayer === npcPlayAs) makeNpcTurn();
  }, [currentPlayer, gameMode]); // eslint-disable-line react-hooks/exhaustive-deps

  return (<PageStyleWrapper>
    <header className="center-children">
      <p className="flex-row">{nickname}'s current score is: {score}
        <span><Button variant="secondary" onClick={() => resetScore()}>Reset</Button></span>
      </p>
      { gameMode !== "none" && <TurnDisplayer isNpcTurn={isNpcTurn} /> }
    </header>

    <GamePanel disabled={isNpcTurn || gameMode === "ended"} />

    <footer className="center-children">
      { (gameMode === "none" || gameMode === "ended")
        ? <ModePicker />
        : <ButtonGroup>
            <Button variant="primary" disabled={isNpcTurn || pastMoves.length===0} onClick={() => undoMove()}
            >
              Undo
            </Button>
            <Button variant="primary" disabled={isNpcTurn} onClick={() => setGameMode("none")}>Restart</Button>
          </ButtonGroup>
      }
      <ButtonGroup>
        <Button variant="secondary" onClick={() => navigate("/")}>Home</Button>
        <Button variant="secondary" onClick={() => navigate("/settings")}>Settings</Button>
      </ButtonGroup>
    </footer>
  </PageStyleWrapper>);
};

export default GamePage;
