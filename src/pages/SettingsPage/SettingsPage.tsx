import React, { useContext, ChangeEventHandler, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameStatusContext, SettingsContext } from "../../utils";
import { Button, ButtonGroup, Form } from "react-bootstrap";
import { NicknameSetter, PageStyleWrapper, Toggle } from "../../components";
import { BoardSize, type PlayerMark, type StyleOverride } from "../../utils/types";

interface SettingsPageProps {
  setGlobalStyleOverride: React.Dispatch<React.SetStateAction<StyleOverride>>;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ setGlobalStyleOverride }) => {
  const navigate = useNavigate();
  const {
    nickname, setNickname,
    darkMode, setDarkMode,
    playerPlayAs, setPlayerPlayAs,
    boardSize, setBoardSize
  } = useContext(SettingsContext);
  const { resetHistory } = useContext(GameStatusContext);

  const [newNickname, setNewNickname] = useState<string>(nickname);
  const [newDarkMode, setNewDarkMode] = useState<boolean>(darkMode);
  const [newPlayerPlayAs, setNewPlayerPlayAs] = useState<PlayerMark>(playerPlayAs);
  const [newBoardSize, setNewBoardSize] = useState<BoardSize>(boardSize);

  const handleSave = () => {
    setNickname(newNickname);
    setDarkMode(newDarkMode);
    setPlayerPlayAs(newPlayerPlayAs);
    resetHistory(newBoardSize);
    setBoardSize(newBoardSize);
    navigate(-1);
  };
  const handleCancel = () => navigate(-1);

  const handleChangeDarkMode: ChangeEventHandler<HTMLInputElement> = (e) => {
    setNewDarkMode(e.target.checked);
  };

  const handleChangePlayerMark: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newPlayerMark = e.target.value as PlayerMark;
    setNewPlayerPlayAs(newPlayerMark);
  };

  const handleChangeBoardSize: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newBoardSize = Number.parseInt(e.target.value) as BoardSize;
    setNewBoardSize(newBoardSize);
  };

  useEffect(() => {
    setGlobalStyleOverride({ darkMode: newDarkMode });
    return () => setGlobalStyleOverride(undefined);
  }, [newDarkMode, setGlobalStyleOverride]);

  return (<PageStyleWrapper>
    <h1>Settings</h1>
    <Form onSubmit={handleSave}>
      <Form.Group controlId="nickname">
        <Form.Label>Nickname</Form.Label>
        <NicknameSetter newNickname={newNickname} setNewNickname={setNewNickname} />
      </Form.Group>
      <Form.Group controlId="playerMark" data-testid="form-playerMark">
        <p>Play as</p>
        <Form.Check value="X"
          type="radio" label="Player 1 (X)" name="playAsRadio" id="playAsRadio-X"
          checked={newPlayerPlayAs === "X"} onChange={handleChangePlayerMark}
        />
        <Form.Check value="O"
          type="radio" label="Player 2 (O)" name="playAsRadio" id="playAsRadio-O"
          checked={newPlayerPlayAs === "O"} onChange={handleChangePlayerMark}
        />
      </Form.Group>
      <Form.Group controlId="boardSize" data-testid="form-boardSize">
        <p>Board size</p>
        <Form.Check value={3}
          type="radio" label="3" name="boardSizeRadio" id="boardSizeRadio-3"
          checked={newBoardSize === 3} onChange={handleChangeBoardSize}
        />
        <Form.Check value={5}
          type="radio" label="5" name="boardSizeRadio" id="boardSizeRadio-5"
          checked={newBoardSize === 5} onChange={handleChangeBoardSize}
        />
        <Form.Check value={7}
          type="radio" label="7" name="boardSizeRadio" id="boardSizeRadio-7"
          checked={newBoardSize === 7} onChange={handleChangeBoardSize}
        />
      </Form.Group>
      <Form.Group controlId="darkMode" className="flex-row horizontal-group" data-testid="form-darkMode">
        <Form.Label>Dark mode?</Form.Label>
        <Toggle value={newDarkMode} onChange={handleChangeDarkMode} id="input-dark-mode" />
      </Form.Group>
    </Form>
    <ButtonGroup>
      <Button variant="secondary" onClick={handleCancel}>Back</Button>
      <Button variant="success" onClick={handleSave}>Save</Button>
    </ButtonGroup>
  </PageStyleWrapper>);
};

export default SettingsPage;
