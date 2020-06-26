import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import GridItem from "./gridItem";
const Item = require("../model");

const Grid = (props) => {
  const { listItems, onListChange } = props;

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
        <Col key={key} xs={12} md={1}>
          <GridItem
            key={key}
            item={item}
            onSubmit={(item) => _onItemChange(item, key)}
            onDelete={() => _onItemDelete(key)}
          />
        </Col>
      );
    });
  };

  return <Row>{_renderListItems()}</Row>;
};

export default Grid;
