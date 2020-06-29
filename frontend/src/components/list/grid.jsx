import React, { useState } from "react";
import { Row, Col, Alert } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import GridItem from "./gridItem";
import cardStyles from "./cardStyles";
const Item = require("../model");

const style = cardStyles;

const Grid = (props) => {
  const { listItems, onListChange } = props;
  const [showAlert, setShowAlert] = useState(false);
  const dates = listItems.map((item) => item.date);

  const _onItemAdd = () => {
    let items = [...listItems];
    const newItem = Item.create({});
    const dateExists = dates.some((x) => x === newItem.date);
    if (dateExists) {
      setShowAlert(true);
    } else {
      items.push(newItem);
      onListChange(items);
    }
  };
  const _onItemChange = (value, index) => {
    let items = [...listItems];
    items[index] = Item.create(value);
    props.onListChange(items);
  };

  const _onItemDelete = (index) => {
    let items = [...listItems];
    items.splice(index, 1);
    onListChange(items);
  };

  const _renderGridItems = () => {
    listItems.sort(function (a, b) {
      return new Date(a.date) - new Date(b.date);
    });
    return listItems.map((item, key) => {
      let datesWithoutCurrent = [...dates];
      let indexOfCurrentDate = datesWithoutCurrent.findIndex(
        (x) => x === item.date
      );
      datesWithoutCurrent.splice(indexOfCurrentDate, 1);
      return (
        <Col className="mt-1" key={key} xs={4} md={1}>
          <GridItem
            id={key}
            item={item}
            dates={datesWithoutCurrent}
            onSubmit={(item) => _onItemChange(item, key)}
            onDelete={() => _onItemDelete(key)}
          />
        </Col>
      );
    });
  };

  return (
    <>
      <Row>
        <Col>
          <Alert
            show={showAlert}
            variant="light"
            onClose={() => setShowAlert(false)}
            dismissible
          >
            You already have a card for today
          </Alert>
        </Col>
      </Row>
      <Row>
        <Col className="mt-1" xs={4} md={1}>
          <div
            className={style("card")}
            style={{ backgroundColor: "#B58900" }}
            onClick={_onItemAdd}
          >
            <span>
              <FaPlus />
            </span>
          </div>
        </Col>
        {_renderGridItems()}
      </Row>
    </>
  );
};

export default Grid;
