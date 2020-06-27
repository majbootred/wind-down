import React from "react";
import { Row, Col } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import GridItem from "./gridItem";
import cardStyles from "./cardStyles";
const Item = require("../model");

const style = cardStyles;

const Grid = (props) => {
  const { listItems, onListChange } = props;

  const _onItemAdd = () => {
    let items = [...listItems];
    let newItem = Item.create({});
    items.push(newItem);
    onListChange(items);
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

  const _renderListItems = () => {
    return listItems.map((item, key) => {
      return (
        <Col className="mt-1" key={key} xs={4} md={1}>
          <GridItem
            id={key}
            item={item}
            onSubmit={(item) => _onItemChange(item, key)}
            onDelete={() => _onItemDelete(key)}
          />
        </Col>
      );
    });
  };

  return (
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
      {_renderListItems()}
    </Row>
  );
};

export default Grid;
