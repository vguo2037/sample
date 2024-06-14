import React from "react";
import { useNavigate } from "react-router-dom";
// import { GameContext } from "../utils";
import { Button, ButtonGroup } from "react-bootstrap";

const GamePage = () => {
  const navigate = useNavigate();
  // const gameContext = useContext(GameContext);

  return (<>
    <ButtonGroup>
      <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
      <Button variant="secondary" onClick={() => navigate(-1)}>Save</Button>
    </ButtonGroup>
  </>);
};

export default GamePage;
