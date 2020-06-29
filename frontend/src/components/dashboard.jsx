import React from "react";
import { set, get, clear, keys } from "idb-keyval";
import { Container, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import NameInput from "./nameInput";
import Grid from "./list/grid";

export default class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      isAppInitialized: false,
      name: "",
      items: [],
      timestamp: undefined,
    };
    this.APIurl =
      process.env.NODE_ENV === `development`
        ? `https://localhost:443`
        : `https://${window.location.host}`;
  }

  componentDidMount() {
    keys().then((keys) => {
      //check for existing idb and load it
      if (keys.length !== 0) {
        get("list")
          .then((val) => {
            //check if idb list has items already (is initialized)
            if (val.items !== undefined) {
              //check for existing remote dataset and load if it's younger than the local one
              this._getDatasetFromRemoteDB(val.name)
                .then((data) => {
                  if (
                    data !== "offline" &&
                    data.length !== 0 &&
                    data.timestamp > val.timestamp
                  ) {
                    this.setState({
                      name: data.name,
                      items: data.items,
                      timestamp: data.timestamp,
                    });
                  } else {
                    //load local dataset to state
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
            console.error("idb get error", err);
          });
      } else {
        //otherwise set an idexed db
        let newEntry = {
          name: this.state.name,
          items: [],
          timestamp: Date.now(),
        };
        set("list", newEntry)
          .then(() => {
            newEntry["isAppInitialized"] = true;
            this.setState(newEntry);
          })
          .catch((err) => console.error("idb set error:", err));
      }
    });
  }

  componentDidUpdate() {
    if (this.state.isAppInitialized) {
      get("list").then((val) => {
        //check mongodb for entry with given name and if it's younger than idb entry
        this._getDatasetFromRemoteDB(val.name)
          .then((data) => {
            if (
              data !== "offline" &&
              data.length !== 0 &&
              data.timestamp > val.timestamp
            ) {
              this.setState({
                name: data.name,
                items: data.items,
                timestamp: data.timestamp,
              });
            }
          })
          .catch((error) => {
            console.error(error);
          });
        // save to local idb
        set("list", {
          name: this.state.name,
          items: this.state.items,
          timestamp: this.state.timestamp,
        })
          .then(() => {
            console.log("idb updated");
            // save to mongo dm
            this._saveCurrentDatasetToRemoteDB()
              .then((res) => {
                if (res === "offline") {
                  console.log("currently offline: no mongoDB update");
                } else {
                  console.log("mongoDB updated");
                }
              })
              .catch((error) => {
                console.error(error);
              });
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
          <Col>
            <h2>{this.state.name}</h2>
          </Col>
        </Row>
        {this._renderGrid()}
        <Row className="mt-3">
          <Col md={{ span: 3, offset: 3 }} xs={{ span: 12 }}>
            <Button variant="primary" onClick={this._onClearIDBClick}>
              delete locally
            </Button>
          </Col>
          <Col md={{ span: 3 }} xs={{ span: 12 }}>
            <Button variant="primary" onClick={this._onClearMongoDBClick}>
              delete locally and remote
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  _renderGrid() {
    if (this.state.name.length !== 0) {
      return (
        <Grid
          listItems={this.state.items}
          onListChange={(items) => {
            this._handleListChange(items);
          }}
        />
      );
    }
  }

  _handleNameSubmit = (name) => {
    if (name !== this.state.name) {
      //load from DB
      this._getDatasetFromRemoteDB(name)
        .then((data) => {
          if (data !== "offline" && data.length !== 0) {
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

  _handleListChange = (items) => {
    this.setState({ items, timestamp: new Date().getTime() });
  };

  _onClearIDBClick = () => {
    clear();
    window.location.reload();
  };

  _onClearMongoDBClick = () => {
    clear();
    this._deleteCurrentDatasetFromRemoteDB()
      .then((res) => {
        if (res === "offline") {
          console.log("currently offline: no mongoDB update");
        } else {
          console.log("entry deleted");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    window.location.reload();
  };

  // DB Helper
  _getDatasetFromRemoteDB(name) {
    if (navigator.onLine) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${this.APIurl}/getOne?name=${name}`)
          .then((res) => {
            resolve(res.data);
          })
          .catch((error) => {
            if (error.message === "Network Error") {
              resolve("offline");
            } else {
              reject(error);
            }
          });
      });
    } else {
      return new Promise((resolve) => {
        resolve("offline");
      });
    }
  }

  _saveCurrentDatasetToRemoteDB() {
    if (navigator.onLine && this.state.name.length !== 0) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${this.APIurl}/save`, {
            name: this.state.name,
            items: this.state.items,
            timestamp: this.state.timestamp,
          })
          .then((res) => {
            resolve(res.data);
          })
          .catch((error) => {
            if (error.message === "Network Error") {
              resolve("offline");
            } else {
              reject(error);
            }
          });
      });
    } else {
      return new Promise((resolve) => {
        resolve("offline");
      });
    }
  }

  _deleteCurrentDatasetFromRemoteDB() {
    if (navigator.onLine) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${this.APIurl}/deleteOne?name=${this.state.name}`)
          .then((res) => {
            resolve(res.data);
          })
          .catch((error) => {
            if (error.message === "Network Error") {
              resolve("offline");
            } else {
              reject(error);
            }
          });
      });
    } else {
      return new Promise((resolve) => {
        resolve("offline");
      });
    }
  }
}
