import React, { Component } from 'react';
import * as d3 from 'd3';

export default class ReleaseDate extends Component {

    componentDidMount(){
        this.drawChart();
    }

    render(){
        return (<div id={"#" + this.props.id}></div>);
      }

    drawChart() {
        var data = this.props.data;

        // size and margins for the chart
        var w = 600;
        var h = 400;
        var padding = 40;

        //scale function
        var xScale = d3.scaleLinear()
        .domain([d3.min(data, function(d) { return d.key; }), d3.max(data, function(d) { return d.key; })])
        .range([padding, w - padding * 2]);

        var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.value; })])
        .range([h - padding, padding]);

        var xAxis = d3.axisBottom().scale(xScale);

        var yAxis = d3.axisLeft().scale(yScale);

        //create svg element
        var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

        // add the tooltip area to the webpage
        var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

        svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
        return xScale(d.key);
        })
        .attr("cy", function(d) {
        return yScale(d.value);
        })
        .attr("r", 5)
        .attr("fill", "green")
        .on("mouseover", function(d) {
        tooltip.transition()
        .duration(200)
        .style("opacity", .9);
        tooltip.html(d.value  + " of your top tracks from " + d.key)
        .style("left", (d3.event.pageX + 5) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
        });

        svg.append("text")
        .attr("transform", "translate(100,0)")
        .attr("x", 50)
        .attr("y", 50)
        .attr("font-size", "24px")
        .text("Release Date of Top Tracks");

        //x axis
        svg.append("g")
        .attr("class", "x axis")	
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

        //y axis
        svg.append("g")
        .attr("class", "y axis")	
        .attr("transform", "translate(" + padding + ", 0)")
        .call(yAxis);
    }
}