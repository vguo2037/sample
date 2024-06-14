import React, { useContext, ChangeEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SettingsContext } from "../utils";
import { Button, ButtonGroup, Form } from "react-bootstrap";
import { StyleWrapper, Toggle } from "../components";

const SettingsPage = () => {
  const navigate = useNavigate();
  const settingsContext = useContext(SettingsContext);

  const [newNickname, setNewNickname] = useState(settingsContext?.nickname);
  const [newDarkMode, setNewDarkMode] = useState(settingsContext?.darkMode);

  const handleSave = () => {
    settingsContext?.setNickname(newNickname);
    settingsContext?.setDarkMode(newDarkMode);
    navigate(-1);
  };
  const handleCancel = () => navigate(-1);

  const changeNickname: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setNewNickname(e.target.value);
  };
  const changeDarkMode: ChangeEventHandler<HTMLInputElement> = (e) => {
    setNewDarkMode(e.target.checked);
  };

  return (<>
    <StyleWrapper override={{darkMode: newDarkMode}}>
      <h1>Settings</h1>
      <Form onSubmit={handleSave}>
        <Form.Group controlId="nickname">
          <Form.Label>Nickname</Form.Label>
          <Form.Control type="text" value={newNickname} onChange={changeNickname} />
        </Form.Group>
        <Form.Group controlId="darkMode">
          <Form.Label>Dark mode?</Form.Label>
          <Toggle value={newDarkMode} onChange={changeDarkMode} />
        </Form.Group>
      </Form>
      <ButtonGroup>
        <Button variant="secondary" onClick={handleCancel}>Back</Button>
        <Button variant="secondary" onClick={handleSave}>Save</Button>
      </ButtonGroup>
    </StyleWrapper>
  </>);
};

export default SettingsPage;
