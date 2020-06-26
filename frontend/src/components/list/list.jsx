import React from "react";
import { Row, Col, ListGroup } from "react-bootstrap";
import ListItem from "./listItem";
import AddItem from "./addItem";
const Item = require("../model");

// let item = Item.create({ name: "fu" });
// console.log(item);

const List = (props) => {
  const { listItems, onListChange } = props;

  const _onItemChange = (value, index) => {
    let items = [...listItems];
    //items[index] = value;
    items[index] = Item.create({ name: value });
    props.onListChange(items);
  };

  const _onItemDelete = (index) => {
    let items = [...listItems];
    items.splice(index, 1);
    onListChange(items);
  };

  const _onItemAdd = (value) => {
    if (value.length > 0) {
      let items = [...listItems];
      let newItem = Item.create({ name: value });
      items.push(newItem);
      onListChange(items);
    }
  };

  const _renderListItems = () => {
    return listItems.map((item, key) => {
      return (
        <ListItem
          key={key}
          value={item}
          onSubmit={(item) => _onItemChange(item, key)}
          onDelete={() => _onItemDelete(key)}
        />
      );
    });
  };

  return (
    <div>
      <Row>
        <Col md={{ span: 6, offset: 3 }} xs={{ span: 12 }}>
          <AddItem onSubmitItem={(item) => _onItemAdd(item)} />
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 6, offset: 3 }} xs={12}>
          <ListGroup>{_renderListItems()}</ListGroup>
        </Col>
      </Row>
    </div>
  );
};

export default List;
