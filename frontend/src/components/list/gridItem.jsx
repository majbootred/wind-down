import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Col, Image } from "react-bootstrap";
import {
  FaTrashAlt,
  FaPenFancy,
  FaCheck,
  FaImage,
  FaPalette,
} from "react-icons/fa";
import { GithubPicker } from "react-color";

import { styles } from "./theme";
const Item = require("../model");

const GridItem = (props) => {
  const { key, item, onSubmit, onDelete } = props;

  const [date, setDate] = useState(item.date);
  const [color, setColor] = useState(item.color);
  const [img, setImg] = useState(item.img);
  const [value1, setValue1] = useState(item.items[0]);
  const [value2, setValue2] = useState(item.items[1]);
  const [value3, setValue3] = useState(item.items[2]);
  const [modalShow, setModalShow] = useState(false);
  const [colorPickerShow, setColorPickerShow] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);
  useEffect(() => {
    updateStates(item);
  }, [item]);

  const updateStates = (item) => {
    setDate(item.date);
    setColor(item.color);
    setImg(item.img);
    setValue1(item.items[0]);
    setValue2(item.items[1]);
    setValue3(item.items[2]);
  };

  const _handleModalClose = () => setModalShow(false);
  const _handleModalShow = () => setModalShow(true);
  const _toggleIsReadOnly = () => setIsReadOnly(!isReadOnly);
  const _toggleColorPicker = () => setColorPickerShow(!colorPickerShow);

  const _onDelete = (e) => {
    e.preventDefault();
    onDelete();
    _handleModalClose();
  };

  const _handleEditSubmit = (e) => {
    e.preventDefault();

    if (!isReadOnly) {
      _onSubmit(e);
    }

    _toggleIsReadOnly();
  };

  const _onSubmit = (e) => {
    e.preventDefault();
    let changedItem = Item.create({
      date,
      items: [value1, value2, value3],
      color,
      img,
    });
    onSubmit(changedItem);
  };

  const _onDateFocus = (e) => {
    e.currentTarget.type = "date";
    e.currentTarget.value = new Date(date).toISOString().substr(0, 10);
  };

  const _onColorPick = (pickedColor) => {
    setColor(pickedColor.hex);
    _toggleColorPicker();
  };

  const _onFileSelect = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      setImg(reader.result);
    };
    reader.readAsDataURL(file);
  };

  let inputFieldOptions = {};
  if (isReadOnly) {
    inputFieldOptions["readOnly"] = "readOnly";
    inputFieldOptions["plaintext"] = "plaintext";
  }

  const _renderHeader = () => {
    return isReadOnly ? (
      new Date(date).toLocaleDateString("de-DE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    ) : (
      <Form.Control
        type="text"
        name="date"
        placeholder={new Date(date).toLocaleDateString("de-DE", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        })}
        onFocus={_onDateFocus}
        onChange={(e) => {
          setDate(new Date(e.target.value));
        }}
      />
    );
  };

  const _renderColorPickerButton = () => {
    return (
      <>
        <Button variant="secondary" onClick={_toggleColorPicker}>
          <FaPalette />
        </Button>
        {colorPickerShow && !isReadOnly ? (
          <div style={{ position: "absolute", zIndex: 1000 }}>
            <GithubPicker
              color={color}
              colors={["#6C71C4", "#268BD2", "#859900", "#B58900", "#CB4B16"]}
              onChangeComplete={(pickedColor) => {
                _onColorPick(pickedColor);
              }}
            />
          </div>
        ) : null}
      </>
    );
  };

  const _renderImgButton = () => {
    return (
      <>
        <label htmlFor="upload-button" className="btn btn-secondary ml-2">
          <FaImage />
        </label>
        <input
          type="file"
          id="upload-button"
          style={{ display: "none" }}
          onChange={(e) => {
            _onFileSelect(e);
          }}
          encType="multipart/form-data"
        />
      </>
    );
  };

  return (
    <div>
      <div
        className={style("card")}
        style={{ backgroundColor: color }}
        onClick={_handleModalShow}
      >
        <span>
          {new Date(date).toLocaleDateString("de-DE", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          })}
        </span>
      </div>
      <Modal show={modalShow} onHide={_handleModalClose}>
        <Modal.Header style={{ backgroundColor: color, color: "#FDF6E3" }}>
          <Modal.Title>{_renderHeader()}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#FDF6E3" }}>
          <Form>
            {isReadOnly ? null : (
              <Form.Row>
                <Col>Drei schöne Dinge:</Col>
              </Form.Row>
            )}

            <Form.Row>
              <Col>
                <Form.Control
                  {...inputFieldOptions}
                  name="value1"
                  size="sm"
                  as="textarea"
                  rows="2"
                  value={value1}
                  onChange={(e) => {
                    setValue1(e.target.value);
                  }}
                  style={{ resize: "none" }}
                />
              </Col>
              <Col>
                <Form.Control
                  {...inputFieldOptions}
                  name="value2"
                  size="sm"
                  as="textarea"
                  rows="2"
                  value={value2}
                  onChange={(e) => {
                    setValue2(e.target.value);
                  }}
                  style={{ resize: "none" }}
                />
              </Col>
              <Col>
                <Form.Control
                  {...inputFieldOptions}
                  name="value2"
                  size="sm"
                  as="textarea"
                  rows="2"
                  value={value3}
                  onChange={(e) => {
                    setValue3(e.target.value);
                  }}
                  style={{ resize: "none" }}
                />
              </Col>
            </Form.Row>

            {isReadOnly ? null : (
              <Form.Row className="mt-2">
                <Col>
                  {_renderColorPickerButton()}
                  {_renderImgButton()}
                </Col>
              </Form.Row>
            )}
            <Form.Row>
              <Col>
                <Image src={img} fluid />
              </Col>
            </Form.Row>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: color, color: "#FDF6E3" }}>
          <Button variant="secondary" onClick={_handleEditSubmit}>
            {isReadOnly ? <FaPenFancy /> : <FaCheck />}
          </Button>
          <Button variant="secondary" onClick={_onDelete}>
            <FaTrashAlt />
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const style = styles({
  minify: ({ pad, color }) => `
      padding: ${pad.sm};
      background-color: ${color.dark};
      color: ${color.light};
    `,
  card: ({ shadow, color, pad, radius }) => `
      display: flex;
      flex-direction: column;
      border-radius: ${radius.sm};
      justify-content: center;
      align-items: center;
      transition: transform 100ms ease-in-out;
      width: 80px;
      height: 80px;

      span:last-of-type {
        color: #fff;
        padding: ${pad.sm};
      }

      &:hover,&:active {
        position: relative;
        transform:scale(1.25);
        z-index: 1000;
        box-shadow: ${shadow.lg};

        span:last-of-type {
          padding: ${pad.sm};
        }
      }
    `,
});

export default GridItem;
