import React, { useState, useRef } from "react";
import { Button, InputGroup, FormControl, Form, Image } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
import Logo from "./logo.png";

const Intro = ({ onSubmitName }) => {
  const [name, setName] = useState("");
  const formRef = useRef(null);

  const _onSubmit = (e) => {
    e.preventDefault();
    onSubmitName(name);
    formRef.current.reset();
  };

  return (
    <>
      <center>
        <Image src={Logo} fluid />
      </center>
      <p className="mt-2">
        Wind Down is an app to reflect on your day - wherever you want.
        <br />
        It asks you about three nice things that happend. You can choose a mood
        color and a picture of the day. <br />
        Over the time you'll create a beautiful grid of mood colors.
      </p>
      <p>
        <em>
          Enter the name of your personal diary or start with a new one by
          giving it a secret name:
        </em>
      </p>
      <Form ref={formRef}>
        <InputGroup className="mb-3">
          <FormControl
            placeholder=""
            aria-label=""
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
    </>
  );
};

export default Intro;
