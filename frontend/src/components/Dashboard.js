// Home.js

import React, { Component } from 'react';
import axios from 'axios';
import ReleaseDate from './ReleaseDate';
import Valence from './Valence';
import Energy from './Energy';
import Acoustic from './Acoustic';
import RadarC from './RadarC';
import './stylesheet.css';
import Genres from './Genres';
import Pie from './Pie';

export default class Dashboard extends Component {

    constructor (props) {
        super(props);
        this.state = {
            value: "20",
            loaded: false,
            top_genres: [],
            top_release_dates: [],
            top_track_features: [],
            top_track_inst: [],
            top_tracks_popularity: [],
            top_track_acousticness: [],
            top_track_energy: [],
            top_track_valence: [],
            top_genres_copy: [],
            top_release_dates_copy: [],
            top_track_features_copy: [],
            top_track_inst_copy: [],
            top_tracks_popularity_copy: [],
            top_track_acousticness_copy: [],
            top_track_energy_copy: [],
            top_track_valence_copy: []
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
                        top_tracks_popularity: result.top_tracks_popularity,
                        top_track_acousticness: result.top_track_acousticness,
                        top_track_energy: result.top_track_energy,
                        top_track_valence: result.top_track_valence
                    });

                    this.handleNoOfSongsChange(20);

                  }
                );

    }

    handleNoOfSongsChange(val){
        const { top_genres, top_release_dates, top_track_features, top_track_inst, top_tracks_popularity,
                top_track_acousticness, top_track_energy, top_track_valence} = this.state;
        
        if(top_genres != undefined && top_release_dates != undefined && top_track_acousticness != undefined && top_track_energy != undefined && top_track_valence != undefined){
            this.setState({
                top_genres_copy: top_genres.slice(0, val),
                top_release_dates_copy: top_release_dates.slice(0, val),
                top_track_acousticness_copy: top_track_acousticness.slice(0, val),
                top_track_energy_copy: top_track_energy.slice(0, val),
                top_track_valence_copy: top_track_valence.slice(0, val)
            });
            console.log("aasd", this.state.top_genres_copy);
            console.log("aasddd", top_genres);
            console.log("val", val);
        }
    }

    handleChange(event) {
        this.setState({value: event.target.value});
        this.handleNoOfSongsChange(event.target.value);
      }
    
    handleSubmit(event) {
        alert('Your favorite flavor is: ' + this.state.value);
        event.preventDefault();
      }

    render() {
        const { loaded } = this.state;
        if(!loaded){
            return null; 
        }

        console.log("HHH", this.state.top_genres_copy)

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Pick the number of top songs you want to include:
                        <select value={this.state.value} onChange={this.handleChange}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                        </select>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <ReleaseDate data={this.state.top_release_dates_copy}></ReleaseDate>
                <Genres data={this.state.top_genres_copy}></Genres>
                <Valence data={this.state.top_track_valence_copy}></Valence>
                <Energy data={this.state.top_track_energy_copy}></Energy>
                <Acoustic data={this.state.top_track_acousticness_copy}></Acoustic>
                <Pie acoustic={this.state.top_track_acousticness} valence={this.state.top_track_valence} energy={this.state.top_track_energy}></Pie>
            </div>
        );
    }
}