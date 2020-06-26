import React from "react";
import { Row, Col, ListGroup } from "react-bootstrap";
import ListItem from "./listItem";
import AddItem from "./addItem";

const List = (props) => {
  const { listItems, onListChange } = props;

  const _onItemChange = (value, index) => {
    let items = JSON.parse(JSON.stringify(listItems));
    items[index] = value;
    props.onListChange(items);
  };

  const _onItemDelete = (index) => {
    let items = JSON.parse(JSON.stringify(listItems));
    items.splice(index, 1);
    onListChange(items);
  };

  const _onItemAdd = (value) => {
    if (value.length > 0) {
      //let items = JSON.parse(JSON.stringify(listItems));
      let items = [...listItems];
      items.push(value);
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
