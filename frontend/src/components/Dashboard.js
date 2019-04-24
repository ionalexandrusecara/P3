// Home.js

import React, { Component } from 'react';
import axios from 'axios';

export default class Dashboard extends Component {

    componentDidMount(){
        axios.post('api/users/getData')
                .then(res => {
                    console.log("GOOD");
                    console.log(res);
                })
                .catch(err => {
                    console.log(err);
                });
    }

    render() {
        return (
            <div>
                Dashboard Component
            </div>
        );
    }
}