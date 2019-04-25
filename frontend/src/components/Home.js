// Home.js

import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';

class Home extends Component {

    state = {
        redirect: false,
        url: ""
    }

    constructor() {
        super();
        this.renderRedirect = this.renderRedirect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.authenticate();
    }

    setRedirect = (redURL) => {
        if(!this.state.redirect){
            this.setState({
                redirect: true,
                url: redURL
              })
        }
      }

    renderRedirect = () => {
        if (this.state.redirect) {
          return <Redirect to={this.state.url} />
        }
      }

    authenticate = () => {
        console.log("Conner is a cunt");
        axios.post('api/users/login')
                .then(res => {
                    console.log("GOOD");
                    console.log(res.data);
                    window.location.href = res.data;
                })
                .catch(err => {
                    console.log("ERR");
                });
    }

    render() {
        return (
            <div className="container" style={{ marginTop: '50px', width: '700px'}}>
                <form onSubmit={ this.handleSubmit }>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">
                            Authenticate
                        </button>
                    </div>
                </form>
                {this.renderRedirect()}
            </div>
        );
    }
}

export default Home;