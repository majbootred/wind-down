import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Col,
  Image,
  CloseButton,
  Alert,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  FaTrashAlt,
  FaPenFancy,
  FaCheck,
  FaImage,
  FaPalette,
} from "react-icons/fa";
import { GithubPicker } from "react-color";

import cardStyles from "./cardStyles";
const Item = require("../model");
const style = cardStyles;

const GridItem = (props) => {
  const { id, item, dates, onSubmit, onDelete } = props;

  const [date, setDate] = useState(item.date);
  const [color, setColor] = useState(item.color);
  const [img, setImg] = useState(item.img);
  const [value1, setValue1] = useState(item.items[0]);
  const [value2, setValue2] = useState(item.items[1]);
  const [value3, setValue3] = useState(item.items[2]);
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
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

  const _handleModalClose = () => setShowModal(false);
  const _handleModalShow = () => setShowModal(true);
  const _toggleIsReadOnly = () => setIsReadOnly(!isReadOnly);
  const _toggleColorPicker = () => setShowColorPicker(!showColorPicker);

  const _onDelete = (e) => {
    e.preventDefault();
    onDelete();
    _handleModalClose();
  };

  const _handleEditSubmit = (e) => {
    e.preventDefault();
    if (!isReadOnly) {
      const dateExists = dates.some((x) => x === date);
      if (dateExists) {
        setShowAlert(true);
      } else {
        _onSubmit(e);
        _toggleIsReadOnly();
      }
    } else {
      _toggleIsReadOnly();
    }
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
    _handleModalClose();
  };

  // const _onDateFocus = (e) => {
  //   e.currentTarget.type = "date";
  //   e.currentTarget.value = new Date(date).toISOString().substr(0, 10);
  // };

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
        type="date"
        name="date"
        value={new Date(date).toISOString().substr(0, 10)}
        placeholder={new Date(date).toLocaleDateString("de-DE", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        })}
        // onFocus={_onDateFocus}
        onChange={(e) => {
          setDate(new Date(e.target.value).toISOString());
        }}
      />
    );
  };

  const _renderColorPickerButton = () => {
    return (
      <>
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id={`tooltip-colorPicker`}>Mood color of the day</Tooltip>
          }
        >
          <Button
            className="mb-2"
            variant="secondary"
            onClick={_toggleColorPicker}
          >
            <FaPalette />
          </Button>
        </OverlayTrigger>

        {showColorPicker && !isReadOnly ? (
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
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id={`tooltip-imagePicker`}>Photo of the day</Tooltip>
          }
        >
          <label htmlFor="upload-button" className="btn btn-secondary ml-2">
            <FaImage />
          </label>
        </OverlayTrigger>

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
    <>
      <div
        id={id}
        className={style("card")}
        style={{ backgroundColor: color }}
        onClick={_handleModalShow}
      >
        <span>
          {new Date(date).toLocaleDateString("de-DE", {
            year: "2-digit",
            month: "numeric",
            day: "numeric",
          })}
        </span>
      </div>
      <Modal show={showModal} onHide={_handleModalClose}>
        <Modal.Header style={{ backgroundColor: color, color: "#FDF6E3" }}>
          <Modal.Title>{_renderHeader()}</Modal.Title>
          <CloseButton
            style={{ color: "#FDF6E3" }}
            onClick={_handleModalClose}
          />
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#FDF6E3" }}>
          <Form>
            <Form.Row>
              <Col>
                <Alert
                  show={showAlert && !isReadOnly}
                  variant="warning"
                  onClose={() => setShowAlert(false)}
                  dismissible
                >
                  You already have a card for this day
                </Alert>
              </Col>
            </Form.Row>
            {isReadOnly ? null : (
              <Form.Row>
                <Col>Three nice things that happened today:</Col>
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
    </>
  );
};

export default GridItem;
