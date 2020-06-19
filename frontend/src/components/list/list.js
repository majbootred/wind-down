import React from "react";
import { ListGroup } from "react-bootstrap";
import ListItem from "./listItem";

const List = (props) => {
  const { listItems, onListChange } = props;

  const _renderListItems = () => {
    return listItems.map((item, key) => {
      return (
        <ListItem
          key={key}
          value={item}
          onSubmit={(item) => _onListItemChange(item, key)}
          onDelete={() => _onListItemDelete(key)}
        />
      );
    });
  };

  const _onListItemChange = (value, index) => {
    let items = JSON.parse(JSON.stringify(listItems));
    items[index] = value;
    props.onListChange(items);
  };

  const _onListItemDelete = (index) => {
    let items = JSON.parse(JSON.stringify(listItems));
    items.splice(index, 1);
    onListChange(items);
  };

  return <ListGroup>{_renderListItems()}</ListGroup>;
};

export default List;
