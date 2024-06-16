import React, { useContext } from "react";
import { GameStatusContext } from "../utils";
import { Button, ButtonGroup } from "react-bootstrap";
import { startGame } from "../utils/gameControl";

const ModePicker = () => {
  const gameStatusContext = useContext(GameStatusContext);

  return (<div className="center-children">
    <p>{gameStatusContext.gameMode === "none" ? "Start a" : "Play another"} round with:</p>
    <ButtonGroup>
      <Button variant="primary" onClick={() => startGame("NPC", gameStatusContext)}>An NPC</Button>
      <Button variant="primary" onClick={() => startGame("multiplayer", gameStatusContext)}
        tooltip-text="Score goes to Player 1 (X)"
      >
        Another player
      </Button>
    </ButtonGroup>
  </div>);
};

export default ModePicker;
