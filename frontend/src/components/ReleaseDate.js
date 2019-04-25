import React, { Component } from 'react';
import * as d3 from 'd3';
import './stylesheet.css';

export default class ReleaseDate extends Component {

    componentDidMount(){
        this.drawChart();
    }

    render(){
        return (<div></div>);
      }

    drawChart() {
        var data = this.props.data;

        // size and margins for the chart
        var w = 825;
        var h = 400;
        var padding = 40;

        //scale function
        var xScale = d3.scaleLinear()
        .domain([d3.min(data, function(d) { return d.key; }), d3.max(data, function(d) { return d.key; })])
        .range([padding, w - padding * 2]);

        var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.value; })*1.25])
        .range([h - padding, padding]);

        var line = d3.line()
        .x(function(d, i) { return xScale(d.key); }) // set the x values for the line generator
        .y(function(d) { return yScale(d.value); }); // set the y values for the line generator 

        var xAxis = d3.axisBottom().scale(xScale);

        var yAxis = d3.axisLeft().scale(yScale);

        //create svg element
        var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

        svg.append("path")
        .datum(data) // 10. Binds data to the line 
        .attr("class", "line") // Assign a class for styling 
        .attr("d", line); // 11. Calls the line generator 

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
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                 .duration(400)
                 .style("opacity", 0);
        });

        svg.append("text")
        .attr("class", "title")
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