// page for playing the actual game
// also handles NPC movement logic

import React, { useContext, useEffect } from "react";
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
  const isNpcTurn = gameMode === "NPC" && currentPlayer !== playerPlayAs;

  useEffect(() => {
    if (winningOutcome(playerPlayAs, gameOutcome)) addScore();
  }, [gameOutcome]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const npcPlayAs = reverseMark(playerPlayAs);

    const makeNpcTurn = async () => {
      // increase npc turn duration for realistic playing experience
      const delayTime = Math.random() * 1000 + 500;
      await new Promise(res => setTimeout(res, delayTime));

      makeNpcMove(gameStatusContext, npcPlayAs);
    };

    if (gameMode === "NPC" && currentPlayer === npcPlayAs) makeNpcTurn();
  }, [currentPlayer, gameMode]); // eslint-disable-line react-hooks/exhaustive-deps

  const undoDisabled = (
    isNpcTurn ||
    pastMoves.length === 0 ||
    (gameMode === "NPC" && pastMoves.length === 1 && pastMoves[0].mark !== currentPlayer)
  );

  return (<PageStyleWrapper>
    <header className="center-children">
      <p className="flex-row">{nickname}&apos;s current score is: {score}
        <span><Button variant="secondary" onClick={() => resetScore()}>Reset</Button></span>
      </p>
      { gameMode !== "none" && <TurnDisplayer /> }
    </header>

    <GamePanel />

    <footer className="center-children">
      { (gameMode === "none" || gameMode === "ended")
        ? <ModePicker />
        : <ButtonGroup>
            <Button variant="primary" disabled={undoDisabled} onClick={() => undoMove()}
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
