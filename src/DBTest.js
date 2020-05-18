import React from "react";
import { set, get, clear } from "idb-keyval";
import { Container, Row, Col, Button } from "react-bootstrap";

export default class DBTest extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "other user",
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
