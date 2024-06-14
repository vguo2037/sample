import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SettingsContext } from "../utils";
import { Button } from "react-bootstrap";

// page to display account information and initiate payment
const LandingPage = () => {
  const navigate = useNavigate();
  const settingsContext = useContext(SettingsContext);

  return (<>
    <Button onClick={() => navigate("settings")}>Settings</Button>
    <Button onClick={() => navigate("game")}>Play</Button>
  </>);
};

export default LandingPage;
