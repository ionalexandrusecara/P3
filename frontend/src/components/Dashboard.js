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

        var val = localStorage.getItem('value');

        if(val == undefined){
            val = 20;
        }


        this.state = {
            value: val,
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
                    console.log("LALA");
                    this.handleNoOfSongsChange();

                  }
                );

    }

    handleNoOfSongsChange(){
        const { top_genres, top_release_dates, top_track_features, top_track_inst, top_tracks_popularity,
                top_track_acousticness, top_track_energy, top_track_valence, value} = this.state;
        
        if(top_genres != undefined && top_release_dates != undefined && top_track_acousticness != undefined && top_track_energy != undefined && top_track_valence != undefined){
            this.setState({
                top_genres_copy: top_genres.slice(0, value),
                top_release_dates_copy: top_release_dates.slice(0, value),
                top_track_acousticness_copy: top_track_acousticness.slice(0, value),
                top_track_energy_copy: top_track_energy.slice(0, value),
                top_track_valence_copy: top_track_valence.slice(0, value)
            });
        }
        console.log("handleNoOfSongsChange");
    }

    handleChange(event) {
        this.setState({value: event.target.value});
        localStorage.setItem('value', event.target.value);

        console.log("daddy", localStorage.getItem('value'));
      }
    
    handleSubmit(event) {
        window.location.reload();
      }

    render() {
        const { loaded } = this.state;
        if(!loaded){
            return null; 
        }

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
                <ReleaseDate data={this.state.top_release_dates.slice(0, this.state.value)}></ReleaseDate>
                <Pie acoustic={this.state.top_track_acousticness.slice(0, this.state.value)} valence={this.state.top_track_valence.slice(0, this.state.value)} energy={this.state.top_track_energy.slice(0, this.state.value)}></Pie>
                <Valence data={this.state.top_track_valence.slice(0, this.state.value)}></Valence>
                <Energy data={this.state.top_track_energy.slice(0, this.state.value)}></Energy>
                <Acoustic data={this.state.top_track_acousticness.slice(0, this.state.value)}></Acoustic>
                 </div>
        );
    }
}