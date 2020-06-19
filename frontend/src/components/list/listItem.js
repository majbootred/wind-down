import React, { useState, useEffect } from "react";
import { Button, InputGroup, Form } from "react-bootstrap";
import { FaTrashAlt, FaPenFancy } from "react-icons/fa";

const ListItem = (props) => {
  // { key, value, onSubmit, onDelete }
  const [value, setValue] = useState(props.value);
  const [isReadOnly, setIsReadOnly] = useState(true);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const toggleIsReadOnly = () => setIsReadOnly(!isReadOnly);

  const _onKeyPress = (e) => {
    if (e.key === "Enter") {
      props.onSubmit(e.target.value);
      toggleIsReadOnly();
    }
  };

  const _onDelete = (e) => {
    e.preventDefault();
    props.onDelete();
  };

  let options = {};
  if (isReadOnly) {
    options["readOnly"] = "readOnly";
    options["plaintext"] = "plaintext";
  }

  return (
    <InputGroup className="mb-3">
      <Form.Control
        {...options}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyPress={(e) => _onKeyPress(e)}
      />
      <InputGroup.Append>
        <Button
          variant="secondary"
          type="submit"
          onClick={() => toggleIsReadOnly()}
        >
          <FaPenFancy />
        </Button>
      </InputGroup.Append>
      <InputGroup.Append>
        <Button variant="secondary" onClick={(e) => _onDelete(e)} type="submit">
          <FaTrashAlt />
        </Button>
      </InputGroup.Append>
    </InputGroup>
  );
};

export default ListItem;
