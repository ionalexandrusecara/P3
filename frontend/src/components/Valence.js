import React, { Component } from 'react';
import * as d3 from 'd3';
import './stylesheet.css';

export default class Valence extends Component {

    componentDidMount(){
        this.drawChart();
    }

    render(){
        return (<div id={"#" + this.props.id}></div>);
    }

    drawChart() {
        var data = this.props.data;

        var margin = {top: 20, right: 20, bottom: 70, left: 40},
        width = 400,
        height = 300;

        var x = d3.scaleBand().range([0, width]).padding(0.4);

        var y = d3.scaleLinear().range([height, 0]);

        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");

         // add the tooltip area to the webpage
         var tooltip = d3.select("body").append("div")
         .attr("class", "tooltip")
         .style("opacity", 0);
 
        x.domain(data.map(function(d) { return d.key; }));
        y.domain([0, d3.max(data, function(d) { return d.value; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-90)" );

        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end");

        svg.selectAll("bar")
            .data(data)
            .enter().append("rect")
            .style("fill", "rgb(68, 204, 79)")
            .attr("x", function(d) { return x(d.key); })
            .attr("width", x.bandwidth())
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); })
            .on("mouseover", function(d) {
                tooltip.transition()
                     .duration(400)
                     .style("opacity", .9);
                tooltip.html(d.key + "<br>" + d.value + " Valence")
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
            .attr("x", 0)
            .attr("y", 0)
            .attr("font-size", "20px")
            .text("Valence")
            .style("color", "whitesmoke");
    }
}