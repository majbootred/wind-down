import React from "react";
import { set, get, clear, keys } from "idb-keyval";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import Spinner from "./spinner";
import Intro from "./intro";
import Grid from "./list/grid";
import LogoSmall from "./logo_small.png";

export default class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      APIurl:
        process.env.NODE_ENV === `development`
          ? `https://localhost:443`
          : `https://${window.location.host}`,
      isAppInitialized: false,
      name: "",
      items: [],
      timestamp: undefined,
      showIntro: true,
      showSpinner: false,
    };
  }

  componentDidMount() {
    keys().then((keys) => {
      //check for existing idb and load it
      if (keys.includes("list")) {
        get("list")
          .then((val) => {
            //check if idb list has already entries
            if (val.name !== "") {
              this.setState({ showIntro: false, showSpinner: true });
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
                      isAppInitialized: true,
                      showSpinner: false,
                    });
                  } else {
                    //load local dataset to state
                    this.setState({
                      name: val.name,
                      items: val.items,
                      timestamp: val.timestamp,
                      isAppInitialized: true,
                      showSpinner: false,
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
    if (this.state.isAppInitialized && this.state.name !== "") {
      get("list").then((val) => {
        //check if idb already has a name
        if (val.name !== 0) {
          //TODO: showSpinner
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
                  showIntro: false,
                });
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
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
      });
    }
  }

  render() {
    return (
      <Container style={{ marginTop: 20 }}>
        {this.state.showIntro ? (
          <Row className="justify-content-md-center">
            <Col md={{ span: 6 }} xs={{ span: 12 }}>
              <Intro onSubmitName={this._handleNameSubmit} />
            </Col>
          </Row>
        ) : this.state.showSpinner ? (
          <Row className="justify-content-md-center">
            <Col md={{ span: 6 }} xs={{ span: 12 }}>
              <Spinner />
            </Col>
          </Row>
        ) : (
          <>
            <Row>
              <Col className="d-flex align-items-end flex-column">
                <Button
                  onClick={() => {
                    this.setState({ showIntro: true });
                  }}
                >
                  <FaArrowLeft />
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <h2>
                  <Image src={LogoSmall} fluid className="mr-3" />
                  {this.state.name}
                </h2>
              </Col>
            </Row>
            <Grid
              listItems={this.state.items}
              onListChange={(items) => {
                this._handleListChange(items);
              }}
            />
            <Row>
              <Col>
                <hr />
              </Col>
            </Row>
            {/* <Row className="mt-3">
              <Col md={{ span: 2 }} xs={{ span: 12 }}>
                <Button variant="primary" onClick={this._onClearIDBClick}>
                  delete locally
                </Button>
                <Button variant="primary" onClick={this._onClearMongoDBClick}>
                  delete locally and remote
                </Button>
              </Col>
            </Row> */}
          </>
        )}
      </Container>
    );
  }

  _handleNameSubmit = (name) => {
    if (name !== this.state.name) {
      this.setState({ showIntro: false, showSpinner: true });
      //load from DB
      this._getDatasetFromRemoteDB(name)
        .then((data) => {
          if (data !== "offline" && data.length !== 0) {
            this.setState({
              name: data.name,
              items: data.items,
              timestamp: data.timestamp,
              showSpinner: false,
            });
          } else {
            //initialize new list in state
            this.setState({
              name: name,
              items: [],
              timestamp: new Date().getTime(),
              showSpinner: false,
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      this.setState({ showIntro: false });
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
          .get(`${this.state.APIurl}/getOne?name=${name}`)
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
          .post(`${this.state.APIurl}/save`, {
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
          .get(`${this.state.APIurl}/deleteOne?name=${this.state.name}`)
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
