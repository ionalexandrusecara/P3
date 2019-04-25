import React, { Component } from 'react';
import * as d3 from 'd3';
import './stylesheet.css';

export default class Pie extends Component {

    componentDidMount(){
        this.drawChart();
    }

    componentDidUpdate() {
        this.drawChart()
     }

    render(){
        return (<div></div>);
    }

    getAcousticAvg() {
        var acoustic = this.props.acoustic;
        var length = this.props.acoustic.length;

        var acoustic_total = 0;

        for (var i = 0; i < length; i++) {
            acoustic_total += acoustic[i].value;
        }

        var acoustic_avg = acoustic_total/length;
        
        return acoustic_avg;
    }

    getEnergyAvg() {
        var energy = this.props.energy;
        var length = this.props.acoustic.length;

        var energy_total = 0;

        for (var i = 0; i < length; i++) {
            energy_total += energy[i].value;
        }

        var energy_avg = energy_total/length;

        return energy_avg;
    }

    getValenceAvg() {
        var valence = this.props.valence;
        var length = this.props.acoustic.length;

        var valence_total = 0;

        for (var i = 0; i < length; i++) {
            valence_total += valence[i].value;
        }

        var valence_avg = valence_total/length;

        return valence_avg;
    }

    drawChart() {
        var valence = {key: "Valence", value: this.getValenceAvg()};
        var energy = {key: "Energy", value: this.getEnergyAvg()};
        var acoustic = {key: "Acoustic", value: this.getAcousticAvg()};

        console.log(valence);
        console.log(energy);
        console.log(acoustic);

    }

}