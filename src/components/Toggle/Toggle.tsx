import React, { ChangeEventHandler } from 'react';
import "../../styles/toggle.scss";
import { Form } from 'react-bootstrap';

interface ToggleProps {
  value?: boolean,
  onChange: ChangeEventHandler<HTMLInputElement>,
  id?: string
};

const Toggle: React.FC<ToggleProps> = ({ value, onChange, id }) => {
  return (<div className="toggle-slider" id={id}>
    <Form.Control type="checkbox" className="toggle-input" checked={value} onChange={onChange} />
  </div>);
};

export default Toggle;
