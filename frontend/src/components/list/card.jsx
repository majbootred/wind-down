import React, { Component } from "react";
import { Button, InputGroup, Form, FormGroup, Card } from "react-bootstrap";
import { FaCamera } from "react-icons/fa";

export default class ListCard extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Card>
        <Card.Img variant="bottom" src="http://placekitten.com/400/400" />
        <Card.Body>
          <Card.Title>Card Title</Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
          <FormGroup>
            <label htmlFor="myInput">
              <FaCamera />
            </label>
            <Form.Control
              id="myInput"
              style={{ display: "none" }}
              type={"file"}
            />
          </FormGroup>
          <Button variant="primary">Go somewhere</Button>
        </Card.Body>
        <Card.Footer className="text-muted">2 days ago</Card.Footer>
      </Card>
    );
  }
}
