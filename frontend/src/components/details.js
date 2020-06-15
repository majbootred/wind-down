import React, { Component } from 'react'
import axios from 'axios'

export default class Details extends Component {
  constructor() {
    super()
    this.state = {
      data: [],
      buttonClicked: false,
    }
    this.getAll = this.getAll.bind(this)
  }

  componentDidMount() {
    axios.get('https://localhost:443/getAll').then((res) => {
      this.setState({
        data: res.data,
      })
    })
  }

  getAll() {
    if (!this.state.buttonClicked) {
      this.setState({
        buttonClicked: true,
      })
    }
  }

  render() {
    return (
      <div className="container-fluid" style={{ marginTop: '30px' }}>
        <div className="row">
          <div className="col-xs-12" style={{ textAlign: 'center' }}>
            <button
              className="btn btn-primary"
              style={{ position: 'absolute', marginLeft: '50%' }}
              onClick={this.getAll}
            >
              Click
            </button>
            <div
              className="container-fluid"
              style={{
                position: 'absolute',
                textAlign: 'center',
                marginTop: '50px',
              }}
            >
              {this.state.buttonClicked
                ? this.state.data.map((data) => {
                    return (
                      <React.Fragment>
                        <p>
                          {' '}
                          <b>name</b> : {data.name}
                        </p>
                        <p>
                          <b>items</b> : {data.items}
                        </p>
                        <p>
                          <b>timestamp</b> : {data.timestamp}
                        </p>
                        <hr />
                      </React.Fragment>
                    )
                  })
                : null}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
