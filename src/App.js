import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Nav, Container, Row, Col } from "react-bootstrap";

import Home from "./Home";
import DBTest from "./DBTest";

export default function App() {
  return (
    <div className="App">
      <Router>
        <Container>
          <Row>
            <Col>
              {" "}
              <Nav>
                <Nav.Item>
                  <Nav.Link as={Link} to="/">
                    Home
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/indexeddb-test">
                    IndexedDB-Test
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
          </Row>
          <Row>
            <Col>
              <Switch>
                <Route exact path="/">
                  <Home name="User" />
                </Route>
                <Route path="/indexeddb-test">
                  <DBTest />
                </Route>
              </Switch>
            </Col>
          </Row>
        </Container>
      </Router>
    </div>
  );
}
