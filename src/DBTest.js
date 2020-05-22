import React from "react";
import { set, get, clear } from "idb-keyval";
import {
  Container,
  Row,
  Col,
  Button,
  InputGroup,
  FormControl,
  ListGroup,
  Form,
} from "react-bootstrap";
import { IoIosAddCircleOutline } from "react-icons/io";

export default class DBTest extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      dbChanged: false,
      items: [],
      addField: "",
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

  componentDidUpdate() {}

  render() {
    return (
      <div>
        <h1>Here we are, {this.state.name}</h1>
        {/* {this._renderButton()} */}
        <Button variant="primary" onClick={this._onClearDBClick}>
          Clear DB
        </Button>
        <hr />
        <Container>
          <Row>
            <Col md={{ span: 6, offset: 3 }} xs={{ span: 12 }}>
              <Form>
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Add Item"
                    aria-label="Add Item"
                    aria-describedby="basic-addon2"
                    onChange={this._handleAddChange}
                  />
                  <InputGroup.Append>
                    <Button
                      variant="secondary"
                      onClick={this._onAddClick}
                      type="submit"
                    >
                      <IoIosAddCircleOutline />
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              </Form>
            </Col>
          </Row>
          {this._renderList()}
        </Container>

        {/* <ListGroup>
          <ListGroup.Item>Cras justo odio</ListGroup.Item>
          <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
          <ListGroup.Item>Morbi leo risus</ListGroup.Item>
          <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
          <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
        </ListGroup> */}
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

  _renderList() {
    return (
      <Row>
        <Col md={{ span: 6, offset: 3 }} xs={{ span: 12 }}>
          <ListGroup>{this._renderListItems()}</ListGroup>
        </Col>
      </Row>
    );
  }

  _renderListItems() {
    return this.state.items.map((item) => {
      return <ListGroup.Item>{item}</ListGroup.Item>;
    });
  }

  _handleAddChange = (e) => {
    this.setState({ addField: e.target.value });
  };

  _onAddClick = (event) => {
    event.preventDefault();
    if (this.state.addField.length > 0) {
      let items = this.state.items;
      items.push(this.state.addField);
      this.setState(this.setState({ items }));
    }
  };

  ////

  _handleClick = () => {
    get("name").then((val) => {
      this.setState({ name: val });
    });
  };

  _onClearDBClick = () => {
    clear();
  };
}
