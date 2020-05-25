import React from "react";
import ReactDOM from "react-dom";
import { set, get, clear, keys } from "idb-keyval";
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
import { FaPlus, FaTrashAlt, FaPenFancy } from "react-icons/fa";

export default class DBTest extends React.Component {
  constructor() {
    super();
    this.id = "maj";
    this.state = {
      id: "",
      isAppInitialized: false,
      items: [],
      addField: "",
      changeFieldIndex: undefined,
    };
  }

  componentDidMount() {
    keys().then((keys) => {
      console.log(keys);
      if (keys.length !== 0) {
        get("list")
          .then((val) => {
            if (val.items !== undefined) {
              this.setState({
                items: val.items,
                isAppInitialized: true,
              });
            } else {
              this.setState({ isAppInitialized: true });
            }
          })
          .catch((err) => {
            console.error("get error", err);
          });
      } else {
        set("list", { id: this.id })
          .then(() => {
            this.setState({ id: this.id, isAppInitialized: true });
          })
          .catch((err) => console.error("set error:", err));
      }
    });
  }

  componentDidUpdate() {
    if (this.state.isAppInitialized) {
      get("list").then((val) => {
        if (val.id === this.id) {
          set("list", {
            id: this.id,
            items: this.state.items,
          })
            .then(() => {
              console.log("idb updated");
            })
            .catch((err) => {
              console.error("update error", err);
            });
        }
      });
    }
  }

  render() {
    return (
      <div>
        <hr />
        <Container>
          <Row>
            <Col md={{ span: 6, offset: 3 }} xs={{ span: 12 }}>
              <Form ref={(form) => (this.messageForm = form)}>
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Add Item"
                    aria-label="Add Item"
                    onChange={this._handleAddFieldChange}
                  />
                  <InputGroup.Append>
                    <Button
                      variant="secondary"
                      onClick={this._onAddClick}
                      type="submit"
                    >
                      <FaPlus />
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              </Form>
            </Col>
          </Row>
          {this._renderList()}
          <Row>
            <Col md={{ span: 6, offset: 3 }} xs={{ span: 12 }}>
              <Button variant="primary" onClick={this._onClearDBClick}>
                Clear DB
              </Button>
            </Col>
          </Row>
        </Container>
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
        <Col md={{ span: 6, offset: 3 }} xs={12}>
          <ListGroup>{this._renderListItems()}</ListGroup>
        </Col>
      </Row>
    );
  }

  _renderListItems() {
    return this.state.items.map((item, index) => {
      let options = {};
      if (this.state.changeFieldIndex !== index) {
        options["readOnly"] = "readOnly";
        options["plaintext"] = "plaintext";
      }
      return (
        <InputGroup className="mb-3">
          <Form.Control
            {...options}
            value={item}
            onChange={this._handleFieldChange(index)}
            onKeyPress={this._handleSubmitFieldChange}
          />
          <InputGroup.Append>
            <Button
              variant="secondary"
              type="submit"
              onClick={this._onChangeClick(index)}
            >
              <FaPenFancy />
            </Button>
          </InputGroup.Append>
          <InputGroup.Append>
            <Button
              variant="secondary"
              onClick={this._onDeleteClick(index)}
              type="submit"
            >
              <FaTrashAlt />
            </Button>
          </InputGroup.Append>
        </InputGroup>
      );
    });
  }

  _handleAddFieldChange = (e) => {
    this.setState({ addField: e.target.value });
  };

  _onAddClick = (e) => {
    e.preventDefault();
    if (this.state.addField.length > 0) {
      let items = this.state.items;
      items.push(this.state.addField);
      this.setState(this.setState({ items }));
      ReactDOM.findDOMNode(this.messageForm).reset();
    }
  };

  _onChangeClick = (index) => () => {
    this.setState({
      changeFieldIndex: index,
    });
  };

  _onDeleteClick = (index) => () => {
    let items = JSON.parse(JSON.stringify(this.state.items));
    items.splice(index, 1);
    this.setState({ items: items });
  };

  _handleFieldChange = (index) => (e) => {
    let items = JSON.parse(JSON.stringify(this.state.items));
    items[index] = e.target.value;
    this.setState({ items: items });
  };

  _handleSubmitFieldChange = (e) => {
    if (e.key === "Enter") {
      this.setState({ changeFieldIndex: undefined });
    }
  };

  _onClearDBClick = () => {
    clear();
  };
}
