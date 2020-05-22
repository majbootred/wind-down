import React from "react";
import { set, get, clear } from "idb-keyval";
import { Container, Row, Col, Button, ListGroup } from "react-bootstrap";

export default class DBTest extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      dbChanged: false,
    };
  }

  componentDidMount() {
    set("name", "maj")
      .then(() => {
        this.setState({ dbChanged: true });
        console.log("It worked!");
      })
      .catch((err) => console.log("It failed!", err));
  }

  render() {
    return (
      <div>
        <h1>Here we are, {this.state.name}</h1>
        {this._renderButton()}
        <Button variant="primary" onClick={this._clearDB}>
          Clear DB
        </Button>
        <ListGroup>
          <ListGroup.Item>Cras justo odio</ListGroup.Item>
          <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
          <ListGroup.Item>Morbi leo risus</ListGroup.Item>
          <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
          <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
        </ListGroup>
      </div>
    );
  }

  _renderButton() {
    if (this.state.dbChanged) {
      return (
        <Button variant="primary" onClick={this._handleClick}>
          Get Name From DB
        </Button>
      );
    }
    return;
  }

  _clearDB = () => {
    clear();
  };

  _handleClick = () => {
    get("name").then((val) => {
      this.setState({ name: val });
    });
  };
}
