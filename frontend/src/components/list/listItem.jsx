import React, { useState, useEffect } from "react";
import { Button, InputGroup, Form } from "react-bootstrap";
import { FaTrashAlt, FaPenFancy } from "react-icons/fa";

const ListItem = (props) => {
  // { key, value, onSubmit, onDelete }
  const [name, setName] = useState(props.value);
  const [image, setImage] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(true);

  useEffect(() => {
    setName(props.value.name);
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

  const _onFileSelect = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  let options = {};
  if (isReadOnly) {
    options["readOnly"] = "readOnly";
    options["plaintext"] = "plaintext";
  }

  let uploadControl = null;
  if (!isReadOnly) {
    uploadControl = (
      <Form.Control
        type="file"
        label="File"
        onChange={(e) => _onFileSelect(e)}
        encType="multipart/form-data"
      />
    );
  }

  return (
    <div>
      <img width="50px" src={image} />
      <InputGroup className="mb-3">
        {uploadControl}
        <Form.Control
          {...options}
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          <Button
            variant="secondary"
            onClick={(e) => _onDelete(e)}
            type="submit"
          >
            <FaTrashAlt />
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </div>
  );
};

export default ListItem;
