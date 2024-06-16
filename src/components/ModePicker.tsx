import React, { useContext } from "react";
import { GameStatusContext } from "../utils";
import { Button, ButtonGroup } from "react-bootstrap";

interface ModePickerProps {
  handleStart: Function
}

const ModePicker: React.FC<ModePickerProps> = ({ handleStart }) => {
  const { gameMode } = useContext(GameStatusContext);

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

export default ModePicker;
