import React, { Component } from 'react';
import * as d3 from 'd3';
import './stylesheet.css';

export default class Genres extends Component {

    componentDidMount(){
        this.drawChart();
    }

    componentDidUpdate() {
        this.drawChart()
     }

    render(){
        return (<div></div>);
    }

    drawChart() {
        var data = this.props.data;

        var width = 600;
        var height = 400;

        var svg = d3.select("body")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);
        var radius = Math.min(width, height) / 2;
        var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var color = d3.scaleOrdinal(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c']);

         // add the tooltip area to the webpage
         var tooltip = d3.select("body").append("div")
         .attr("class", "tooltip")
         .style("opacity", 0);

        svg.append("text")
        .attr("class", "title")
        .attr("transform", "translate(100,0)")
        .attr("x", 155)
        .attr("y", 210)
        .attr("font-size", "24px")
        .text("Genres")

        var pie = d3.pie().value(function(d) { 
            return d.val; 
        });

        var path = d3.arc()
                    .outerRadius(radius - 10)
                    .innerRadius(80);

        var label = d3.arc()
                    .outerRadius(radius)
                    .innerRadius(radius - 80);

        var arc = g.selectAll(".arc")
            .data(pie(data))
            .enter()
            .append("g")
            .attr("class", "arc")
            .on("mouseover", function(d) {
                tooltip.transition()
                     .duration(400)
                     .style("opacity", .9);
                tooltip.html(d.data.val  + " of your top tracks are " + d.data.key)
                     .style("left", (d3.event.pageX + 5) + "px")
                     .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                     .duration(400)
                     .style("opacity", 0);
            });

            arc.append("path")
            .attr("fill", function(d) {
                return color(d.data.key);
            })
            .attr("d", path);
        }
}