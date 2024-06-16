import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SettingsContext } from "../utils";
import { Button, ButtonGroup } from "react-bootstrap";

const LandingPage = () => {
  const navigate = useNavigate();
  const settingsContext = useContext(SettingsContext);

  return (<>
    <p className="title">Welcome {settingsContext?.nickname}!</p>
    <p>Click <i>Play</i> for a round—or a couple rounds—of tic-tac-toe.</p>
    <ButtonGroup>
      <Button variant="secondary" onClick={() => navigate("/settings")}>Settings</Button>
      <Button variant="success" onClick={() => navigate("/game")}>Play</Button>
    </ButtonGroup>
  </>);
};

export default LandingPage;
