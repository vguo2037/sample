import React, { useContext } from "react";
import { GameStatusContext, SettingsContext } from "../utils";
import { Button, ButtonGroup, Dropdown, DropdownButton } from "react-bootstrap";
import { startGame } from "../utils/gameControl";
import { NPCDifficulty } from "../utils/types";

const ModePicker = () => {
  const gameStatusContext = useContext(GameStatusContext);
  const { boardSize } = useContext(SettingsContext);
  const { nickname, playerPlayAs } = useContext(SettingsContext);

  const handleNPCSelect = (difficulty: NPCDifficulty) => {
    startGame({
      mode: "NPC", boardSize, gameStatusContext, difficulty, playerPlayAs
    });
  };

  return (<div className="center-children">
    <p>{gameStatusContext.gameMode === "none" ? "Start a" : "Play another"} round with:</p>
    <ButtonGroup>
      <DropdownButton
        as={ButtonGroup}
        variant="primary"
        drop="down-centered"
        title="An NPC"
        tooltip-text="Select difficulty"
      >
        <Dropdown.Item
          as="button" eventKey="difficulty-1"
          onClick={() => handleNPCSelect(1)}
        >
          Easy
        </Dropdown.Item>
        <Dropdown.Item
          as="button" eventKey="difficulty-2"
          onClick={() => handleNPCSelect(2)}
        >
          Hard
        </Dropdown.Item>
      </DropdownButton>
      <Button variant="primary" onClick={() => startGame({
        mode: "multiplayer", boardSize, gameStatusContext, playerPlayAs
      })}
        tooltip-text={`Score is tracked for ${nickname} (${playerPlayAs})`}
      >
        Another player
      </Button>
    </ButtonGroup>
  </div>);
};

export default ModePicker;
