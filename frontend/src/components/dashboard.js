/* eslint-disable react/no-find-dom-node */
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
  Form,
} from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import NameInput from "./nameInput";
import List from "./list/list";

export default class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      isAppInitialized: false,
      name: "",
      items: [],
      timestamp: undefined,
      addField: "",
      changeFieldIndex: undefined,
    };
  }

  componentDidMount() {
    //check for existing indexeddb and load it
    keys().then((keys) => {
      if (keys.length !== 0) {
        get("list")
          .then((val) => {
            if (val.items !== undefined) {
              //check for existing remote dataset and load if it's younger than the local one
              this._getDatasetFromRemoteDB(val.name)
                .then((data) => {
                  if (data.length !== 0 && data.timestamp > val.timestamp) {
                    this.setState({
                      name: data.name,
                      items: data.items,
                      timestamp: data.timestamp,
                    });
                  } else {
                    //load local dataset
                    this.setState({
                      name: val.name,
                      items: val.items,
                      timestamp: val.timestamp,
                      isAppInitialized: true,
                    });
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
            } else {
              this.setState({ isAppInitialized: true });
            }
          })
          .catch((err) => {
            console.error("get error", err);
          });
      } else {
        //otherwise set an idexed db
        set("list", { name: this.state.name })
          .then(() => {
            this.setState({ name: this.state.name, isAppInitialized: true });
          })
          .catch((err) => console.error("set error:", err));
      }
    });
  }

  componentDidUpdate() {
    if (this.state.isAppInitialized) {
      get("list").then((val) => {
        // TODO: Check in MongoDB if list with given name exits
        //  if (val.name === this.state.name) {
        set("list", {
          name: this.state.name,
          items: this.state.items,
          timestamp: this.state.timestamp,
        })
          .then(() => {
            console.log("idb updated");
          })
          .catch((err) => {
            console.error("update error", err);
          });
        //  }
      });
    }
  }

  render() {
    return (
      <Container style={{ marginTop: 20 }}>
        <Row>
          <Col md={{ span: 6, offset: 3 }} xs={{ span: 12 }}>
            <NameInput onSubmitName={this._handleNameSubmit} />
            <hr />
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 6, offset: 3 }} xs={{ span: 12 }}>
            <h1>{this.state.name}</h1>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 6, offset: 3 }} xs={{ span: 12 }}>
            {this._renderAddField()}
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 6, offset: 3 }} xs={12}>
            <List
              listItems={this.state.items}
              onListChange={(items) => {
                this._handleListChange(items);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 6, offset: 3 }} xs={{ span: 12 }}>
            <Button variant="primary" onClick={this._onClearDBClick}>
              Clear DB
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  _renderAddField() {
    if (this.state.name.length !== 0) {
      return (
        <Form ref={(form) => (this.form = form)}>
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
      );
    }
  }

  _handleNameSubmit = (name) => {
    if (name !== this.state.name) {
      //load from DB
      this._getDatasetFromRemoteDB(name)
        .then((data) => {
          if (data.length !== 0) {
            this.setState({
              name: data.name,
              items: data.items,
              timestamp: data.timestamp,
            });
          } else {
            //initialize new list in state
            this.setState({
              name: name,
              items: [],
              timestamp: new Date().getTime(),
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  _handleAddFieldChange = (e) => {
    this.setState({ addField: e.target.value });
  };

  _onAddClick = (e) => {
    e.preventDefault();
    if (this.state.addField.length > 0) {
      let items = this.state.items;
      items.push(this.state.addField);
      this.setState(this.setState({ items, timestamp: new Date().getTime() }));
      ReactDOM.findDOMNode(this.form).reset();
    }
  };

  _handleListChange = (items) => {
    this.setState({ items, timestamp: new Date().getTime() });
  };

  _onClearDBClick = () => {
    clear();
    window.location.reload();
  };

  // Helper
  _getDatasetFromRemoteDB(name) {
    return new Promise((resolve, reject) => {
      axios
        .get(`https://localhost:443/getOne?name=${name}`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  _saveCurrentDatasetToRemoteDB() {
    return new Promise((resolve, reject) => {
      axios
        .post(`https://localhost:443/save`, {
          name: this.state.name,
          items: this.state.items,
          timestamp: this.state.timestamp,
        })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
