import React, { useContext, ChangeEventHandler, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SettingsContext } from "../utils";
import { Button, ButtonGroup, Form } from "react-bootstrap";
import { Toggle } from "../components";
import { Settings } from "../utils/contexts/settings";

const SettingsPage = () => {
  const navigate = useNavigate();
  const settingsContext = useContext(SettingsContext);

  const origSettings = useRef<Settings>();
  useEffect(() => { origSettings.current = settingsContext; }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    navigate(-1);
  };
  const handleCancel = () => {
    settingsContext?.setNickname(origSettings.current?.nickname);
    settingsContext?.setDarkMode(origSettings.current?.darkMode);
    navigate(-1);
  };

  const changeNickname: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    if (settingsContext) settingsContext.setNickname(e.target.value);
  };
  const changeDarkMode: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (settingsContext) settingsContext.setDarkMode(e.target.checked);
  };

  return (<>
    <h1>Settings</h1>
    <Form onSubmit={handleSave}>
      <Form.Group controlId="nickname">
        <Form.Label>Nickname</Form.Label>
        <Form.Control type="text" value={settingsContext?.nickname} onChange={changeNickname} />
      </Form.Group>
      <Form.Group controlId="darkMode">
        <Form.Label>Dark mode?</Form.Label>
        <Toggle value={settingsContext?.darkMode} onChange={changeDarkMode} />
      </Form.Group>
    </Form>
    <ButtonGroup>
      <Button variant="secondary" onClick={handleCancel}>Back</Button>
      <Button variant="secondary" onClick={handleSave}>Save</Button>
    </ButtonGroup>
  </>);
};

export default SettingsPage;
