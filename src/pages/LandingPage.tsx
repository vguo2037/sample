import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SettingsContext } from "../utils";
import { Button, ButtonGroup } from "react-bootstrap";

// page to display account information and initiate payment
const LandingPage = () => {
  const navigate = useNavigate();
  const settingsContext = useContext(SettingsContext);

  return (<>
    <p className="title">Welcome!</p>
    <ButtonGroup>
      <Button variant="secondary" onClick={() => navigate("/settings")}>Settings</Button>
      <Button variant="secondary" onClick={() => navigate("/game")}>Play</Button>
    </ButtonGroup>
  </>);
};

export default LandingPage;
