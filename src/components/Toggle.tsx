import React, { ChangeEventHandler } from 'react';
import "../styles/toggle.scss";
import { Form } from 'react-bootstrap';

interface ToggleProps {
  value?: boolean,
  onChange: ChangeEventHandler<HTMLInputElement>
};

const Toggle: React.FC<ToggleProps> = ({ value, onChange }) => {
  return (<label className="slider">
    <Form.Control type="checkbox" className="toggleInput" checked={value} onChange={onChange} />
  </label>);
};

export default Toggle;
