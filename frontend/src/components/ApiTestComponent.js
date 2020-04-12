import React, { Component } from 'react';

class ApiTestComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: 'Sin respuesta',
    };
  }

  async ping() {
    const pingApiUrl = process.env.REACT_APP_BACKEND_URL + '/ping';
    const response = await fetch(pingApiUrl).then((res) => res.text());

    this.setState({
      response: response,
    });
  }

  render() {
    return (
      <div>
        <p>Respuesta del servidor: {this.state.response}</p>
        <button onClick={this.ping.bind(this)}>Actualizar</button>
      </div>
    );
  }
}

export default ApiTestComponent;
