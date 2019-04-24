// Home.js

import React, { Component } from 'react';
import axios from 'axios';
import ReleaseDate from './ReleaseDate';

export default class Dashboard extends Component {

    constructor (props) {
        super(props);
        this.state = {
            top_genres: [],
            top_release_dates: [],
            top_track_features: [],
            top_track_inst: [],
            top_tracks_popularity: []
        }
    }

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
                this.setState({
                    top_genres: result.top_genres,
                    top_release_dates: result.top_release_dates_count,
                    top_track_features: result.top_track_feature,
                    top_track_inst: result.top_track_inst,
                    top_tracks_popularity: result.top_tracks_popularity
                });
                console.log("topgenres",this.state.top_genres);
              }
            );
    }

    render() {
        return (
            <div>
                <ReleaseDate></ReleaseDate>
            </div>
        );
    }
}