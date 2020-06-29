import React, { useState, useRef } from "react";
import { Button, InputGroup, FormControl, Form } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";

const NameInput = ({ onSubmitName }) => {
  const [name, setName] = useState("");
  const formRef = useRef(null);

  const _onSubmit = (e) => {
    e.preventDefault();
    onSubmitName(name);
    formRef.current.reset();
  };

  return (
    <Form ref={formRef}>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Provide an already existing name or create a new list"
          aria-label="Provide an already existing name or create a new list"
          onChange={(e) => setName(e.target.value)}
        />
        <InputGroup.Append>
          <Button
            variant="secondary"
            onClick={(name) => _onSubmit(name)}
            type="submit"
          >
            <FaArrowRight />
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </Form>
  );
};

export default NameInput;
