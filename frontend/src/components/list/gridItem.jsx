import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Col } from "react-bootstrap";
import { FaTrashAlt, FaPenFancy } from "react-icons/fa";
import { styles } from "./theme";
const Item = require("../model");

const GridItem = (props) => {
  const { key, item, onSubmit, onDelete } = props;
  const [modalShow, setModalShow] = useState(false);
  const [date, setDate] = useState(item.date);
  const [color, setColor] = useState(item.color);
  const [img, setImg] = useState(item.img);
  const [value1, setValue1] = useState(item.items[0]);
  const [value2, setValue2] = useState(item.items[1]);
  const [value3, setValue3] = useState(item.items[2]);
  const handleClose = () => setModalShow(false);
  const handleShow = () => setModalShow(true);

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

  const _onDelete = (e) => {
    e.preventDefault();
    onDelete();
    handleClose();
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

  return (
    <div>
      <div className={style("card")} onClick={handleShow}>
        <span>
          {new Date(date).toLocaleDateString("de-DE", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          })}
        </span>
      </div>
      <Modal show={modalShow} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {new Date(date).toLocaleDateString("de-DE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Row>
              <Col>
                <Form.Control
                  name="value1"
                  size="sm"
                  placeholder="1"
                  as="textarea"
                  rows="3"
                  value={value1}
                  onChange={(e) => {
                    setValue1(e.target.value);
                  }}
                />
              </Col>
              <Col>
                <Form.Control
                  name="value2"
                  size="sm"
                  placeholder="2"
                  as="textarea"
                  rows="3"
                  value={value2}
                  onChange={(e) => {
                    setValue2(e.target.value);
                  }}
                />
              </Col>
              <Col>
                <Form.Control
                  name="value2"
                  size="sm"
                  placeholder="3"
                  as="textarea"
                  rows="3"
                  value={value3}
                  onChange={(e) => {
                    setValue3(e.target.value);
                  }}
                />
              </Col>
            </Form.Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            <FaPenFancy />
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
      background: ${color.dark};
      border-radius: ${radius.lg};
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
        background: ${color.light};
        transform:scale(1.25);
        z-index: 1000;
        box-shadow: ${shadow.lg};

        span:last-of-type {
          color: ${color.dark};
          padding: ${pad.sm};
        }
      }
    `,
});

export default GridItem;
