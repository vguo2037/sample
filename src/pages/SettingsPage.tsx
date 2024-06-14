import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SettingsContext } from "../utils";
import { Button } from "react-bootstrap";

// page to display account information and initiate payment
const SettingsPage = () => {
  const navigate = useNavigate();
  const settingsContext = useContext(SettingsContext);

  return (<>
    <Button onClick={() => navigate(-1)}>Return</Button>
    <Button onClick={() => navigate(-1)}>Save</Button>
  </>);
};

export default SettingsPage;
