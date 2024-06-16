import React, { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { IoDiceSharp } from "react-icons/io5";
import { requestRandomNicknames } from "../utils";

interface NicknameSetterProps {
  newNickname?: string,
  setNewNickname: Function,
  changeNickname: ChangeEventHandler<HTMLInputElement>
};

const NicknameSetter: React.FC<NicknameSetterProps> = ({ newNickname, setNewNickname, changeNickname }) => {
  const randomNicknameStash = useRef(new Array<string>());
  const [requestingInProgress, setRequestingInProgress] = useState<boolean>(false);

  const fetchRandomNickname = async () => {
    setRequestingInProgress(true);
    if (randomNicknameStash.current.length === 0) {
      randomNicknameStash.current = await requestRandomNicknames();
      console.log("randomNicknameStash.current", randomNicknameStash.current);
    };
    setNewNickname(randomNicknameStash.current.pop());
    setRequestingInProgress(false);
  };

  return (<div className="flex-row">
    <Form.Control type="text" value={newNickname} onChange={changeNickname} />
    <Button variant="link" size="lg" className="flex-row center-children" style={{ minWidth: 64, height: 36 }}
      onClick={fetchRandomNickname} disabled={requestingInProgress}
    >
      { requestingInProgress
        ? <Spinner size="sm" />
        : <IoDiceSharp size={28} />
      }
    </Button>
  </div>);
};

export default NicknameSetter;
