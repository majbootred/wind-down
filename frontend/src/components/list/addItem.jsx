import React, { useState, useRef } from "react";
import { Button, InputGroup, FormControl, Form } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";

const AddItem = ({ onSubmitItem }) => {
  const [value, setValue] = useState("");
  const formRef = useRef(null);

  const _onSubmit = (e) => {
    e.preventDefault();
    onSubmitItem(value);
    formRef.current.reset();
    setValue("");
  };

  return (
    <Form ref={formRef}>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Add Item"
          aria-label="Add Item"
          onChange={(e) => setValue(e.target.value)}
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

export default AddItem;
