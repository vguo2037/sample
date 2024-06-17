import React, { useContext, ChangeEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SettingsContext } from "../utils";
import { Button, ButtonGroup, Form } from "react-bootstrap";
import { NicknameSetter, StyleWrapper, Toggle } from "../components";

const SettingsPage = () => {
  const navigate = useNavigate();
  const {
    nickname, setNickname, darkMode, setDarkMode, playerPlayAs, setPlayerPlayAs
  } = useContext(SettingsContext);

  const [newNickname, setNewNickname] = useState(nickname);
  const [newDarkMode, setNewDarkMode] = useState(darkMode);
  const [newPlayerPlayAs, setNewPlayerPlayAs] = useState(playerPlayAs);

  const handleSave = () => {
    setNickname(newNickname);
    setDarkMode(newDarkMode);
    setPlayerPlayAs(newPlayerPlayAs);
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
          <NicknameSetter {...{newNickname, setNewNickname, changeNickname}} />
        </Form.Group>
        <Form.Group controlId="playerMark">
          <Form.Label>Play as</Form.Label>
          <Form.Check
            type="radio" label="Player 1 (X)" name="playAsRadio" id="playAsRadio-X"
            checked={newPlayerPlayAs === "X"} onChange={() => setNewPlayerPlayAs("X")}
          />
          <Form.Check
            type="radio" label="Player 2 (O)" name="playAsRadio" id="playAsRadio-O"
            checked={newPlayerPlayAs === "O"} onChange={() => setNewPlayerPlayAs("O")}
          />
        </Form.Group>
        <Form.Group controlId="darkMode" className="flex-row horizontal-group">
          <Form.Label>Dark mode?</Form.Label>
          <Toggle value={newDarkMode} onChange={changeDarkMode} id="dark-mode-toggle" />
        </Form.Group>
      </Form>
      <ButtonGroup>
        <Button variant="secondary" onClick={handleCancel}>Back</Button>
        <Button variant="success" onClick={handleSave}>Save</Button>
      </ButtonGroup>
    </StyleWrapper>
  </>);
};

export default SettingsPage;
