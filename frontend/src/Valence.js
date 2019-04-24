import React, { Component } from 'react';
import * as d3 from 'd3';

export default class Valence extends Component {

    componentDidMount(){
        this.drawChart();
    }

    render(){
        return (<div id={"#" + this.props.id}></div>);
    }

    drawChart() {

    }
}