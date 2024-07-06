import React, { ChangeEventHandler, useRef, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { IoDiceSharp } from "react-icons/io5";
import { requestRandomNicknames } from "../../utils";

interface NicknameSetterProps {
  newNickname: string,
  setNewNickname: React.Dispatch<React.SetStateAction<string>>,
  changeNickname: ChangeEventHandler<HTMLInputElement>
};

const NicknameSetter: React.FC<NicknameSetterProps> = ({ newNickname, setNewNickname, changeNickname }) => {
  const randomNicknameStash = useRef(new Array<string>());
  const [requestingInProgress, setRequestingInProgress] = useState<boolean>(false);

  const fetchRandomNickname = async () => {
    setRequestingInProgress(true);
    if (randomNicknameStash.current.length === 0) {
      randomNicknameStash.current = await requestRandomNicknames();
    };

    setNewNickname(randomNicknameStash.current.pop() as string);
    setRequestingInProgress(false);
  };

  return (<div className="flex-row">
    <Form.Control type="text" value={newNickname} onChange={changeNickname} />
    <Button variant="link" size="lg" className="flex-row center-children icon-btn"
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
