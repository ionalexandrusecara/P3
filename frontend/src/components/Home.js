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
            <div>
                <h1 align="center">
                    What does your music taste say about your character?
                </h1>
                <h2 align="center">
                    High valence shows happiness. 
                    <br></br>
                    High energy shows cheerfulness. 
                    <br></br>
                    High accousticness shows confidence.
                    <br></br>
                    Old songs show nostalgia while new songs show trendiness.
                </h2>
                <p align="center">
                    The dashboard offers 5 charts:
                    <br></br>
                    • 1 line chart to display all the release dates of your top songs 
                    <br></br>
                    • 1 pie chart to show the average valence, energy and accousticness of your songs
                    <br></br>
                    • 3 barcharts displaying the levels of Valence, Energy and Acousticness
                </p>
                <p align="center">
                <form onSubmit={ this.handleSubmit }>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">
                            Authenticate
                        </button>
                    </div>
                </form>
                </p>
                {this.renderRedirect()}
            </div>
        );
    }
}

export default Home;