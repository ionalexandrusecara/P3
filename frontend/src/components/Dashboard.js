// Home.js

import React, { Component } from 'react';
import axios from 'axios';
import ReleaseDate from './ReleaseDate';

export default class Dashboard extends Component {

    constructor (props) {
        super(props);
        this.state = {
            loaded: false,
            top_genres: [],
            top_release_dates: [],
            top_track_features: [],
            top_track_inst: [],
            top_tracks_popularity: []
        }
    }

    sleep = (seconds) => {
        var e = new Date().getTime() + (seconds * 1000);
        while (new Date().getTime() <= e) {}
    }

    componentDidMount(){
        this.sleep(5);
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
                        loaded:true,
                        top_genres: result.top_genres,
                        top_release_dates: result.top_release_dates_count,
                        top_track_features: result.top_track_feature,
                        top_track_inst: result.top_track_inst,
                        top_tracks_popularity: result.top_tracks_popularity
                    });
                    console.log(this.state.top_genres);
                  }
                );
>>>>>>> 372c01c3771121e584d312790a27d255050c88b7
    }

    render() {
        const { loaded } = this.state;
        if(!loaded){
            return null; 
        }
        return (
            <div>
                <ReleaseDate></ReleaseDate>
            </div>
        );
    }
}