import React, { Component } from 'react';
import * as d3 from 'd3';
import './stylesheet.css';

export default class Pie extends Component {

    componentDidMount(){
        this.drawChart();
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

        var data = [];
        data.push(valence);
        data.push(energy);
        data.push(acoustic);

        console.log(data);
        
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
        .text("Overall");

        var pie = d3.pie().value(function(d) { 
            return d.value; 
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
                tooltip.html("Your taste has an average " + d.data.key + " rating of " + d.data.value.toFixed(2) + ".")
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


            var legendG = svg.selectAll(".legend") // note appending it to mySvg and not svg to make positioning easier
            .data(pie(data))
            .enter().append("g")
            .attr("transform", function(d,i){
                return "translate(" + (width - 110) + "," + (i * 15 + 20) + ")"; // place each legend on the right and bump each one down 15 pixels
            })
            .attr("class", "legend");   

            legendG.append("rect") // make a matching color rect
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", function(d, i) {
                return color(d.data.key);
            });

            legendG.append("text") // add the text
            .text(function(d){
                return d.data.key;
            })
            .style("font-size", 12)
            .attr("y", 10)
            .attr("x", 11);
                }

}