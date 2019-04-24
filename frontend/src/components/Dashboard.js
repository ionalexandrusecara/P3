// Home.js

import React, { Component } from 'react';
import axios from 'axios';
import ReleaseDate from './ReleaseDate';

export default class Dashboard extends Component {

    componentDidMount(){
        fetch('/api/users/data', {// Use proxy
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            }
          })
            .then(result => result.json())// Parse the response
            .then((result) => {
                console.log(result);
              }
            );
    }

    render() {
        return (
            <div>
                Dashboard Component
                <ReleaseDate></ReleaseDate>
            </div>
        );
    }
}