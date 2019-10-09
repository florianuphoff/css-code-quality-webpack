<template>
  <div class="v-box w-2-3">
    <div class="v-box__header">Mixin-Extend-Benutzung</div>
    <div class="v-box__chart sass-usage-chart v-box__content" id="sassUsageChart"></div>
  </div>
</template>


<script>
import Vue from 'vue';
import ButterflyChord from '@/assets/ButterflyChord'
import * as d3 from 'd3'

export default Vue.extend({
  
  name: 'ButterflyChortChart',
  props: {
    chordData: {
      type: Object,
      required: true
    }
  },
  watch: {
    chordData: {
      handler: function(data) {
        // this.chordData = data
        // this.drawChart()
      },
      deep: true
    }
  },
  methods: {
    drawChart: function() {
      // ButterflyChord.draw('#sassUsageChart', this.chordData)

      // Dependency Wheel
      // d3.chart = d3.chart || {};
      // d3.chart.dependencyWheel = function(options) {

      //   var width = 700;
      //   var margin = 150;
      //   var padding = 0.02;

      //   function chart(selection) {
      //     selection.each(function(data) {

      //       var matrix = data.matrix;
      //       var packageNames = data.packageNames;
      //       var radius = width / 2 - margin;

      //       // create the layout
      //       var chord = d3.chord()
      //         .padAngle(padding)
      //         .sortSubgroups(d3.descending);

      //       // Select the svg element, if it exists.
      //       var svg = d3.select(this).selectAll("svg").data([data]);

      //       // Otherwise, create the skeletal chart.
      //       var gEnter = svg.enter().append("svg:svg")
      //         .attr("width", width)
      //         .attr("height", width)
      //         .attr("class", "dependencyWheel")
      //       .append("g")
      //         .attr("transform", "translate(" + (width / 2) + "," + (width / 2) + ")");

      //       var arc = d3.arc()
      //         .innerRadius(radius)
      //         .outerRadius(radius + 20);

      //       var fill = function(d) {
      //         if (d.index === 0) return '#ccc';
      //         return "hsl(" + parseInt(((packageNames[d.index][0].charCodeAt() - 2) / 26) * 300, 10) + ",90%,70%)";
      //       };

      //       // Returns an event handler for fading a given chord group.
      //       var fade = function(opacity) {
      //         return function(g, i) {
      //           gEnter.selectAll(".chord")
      //               .filter(function(d) {
      //                 return d.source.index != i && d.target.index != i;
      //               })
      //             .transition()
      //               .style("opacity", opacity);
      //           var groups = [];
      //           gEnter.selectAll(".chord")
      //               .filter(function(d) {
      //                 if (d.source.index == i) {
      //                   groups.push(d.target.index);
      //                 }
      //                 if (d.target.index == i) {
      //                   groups.push(d.source.index);
      //                 }
      //               });
      //           groups.push(i);
      //           var length = groups.length;
      //           gEnter.selectAll('.group')
      //               .filter(function(d) {
      //                 for (var i = 0; i < length; i++) {
      //                   if(groups[i] == d.index) return false;
      //                 }
      //                 return true;
      //               })
      //               .transition()
      //                 .style("opacity", opacity);
      //         };
      //       };

      //       var chordResult = chord(matrix);

      //       var rootGroup = chordResult.groups[0];
      //       var rotation = - (rootGroup.endAngle - rootGroup.startAngle) / 2 * (180 / Math.PI);

      //       var g = gEnter.selectAll("g.group")
      //         .data(chordResult.groups)
      //         .enter().append("svg:g")
      //         .attr("class", "group")
      //         .attr("transform", function(d) {
      //           return "rotate(" + rotation + ")";
      //         });

      //       g.append("svg:path")
      //         .style("fill", fill)
      //         .style("stroke", fill)
      //         .attr("d", arc)
      //         .style("cursor", "pointer")
      //         .on("mouseover", fade(0.1))
      //         .on("mouseout", fade(1));

      //       g.append("svg:text")
      //         .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
      //         .attr("dy", ".35em")
      //         .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
      //         .attr("transform", function(d) {
      //           return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" +
      //             "translate(" + (radius + 26) + ")" +
      //             (d.angle > Math.PI ? "rotate(180)" : "");
      //         })
      //         .style("cursor", "pointer")
      //         .text(function(d) { return packageNames[d.index]; })
      //         .on("mouseover", fade(0.1))
      //         .on("mouseout", fade(1));

      //       gEnter.selectAll("path.chord")
      //           .data(chordResult)
      //           .enter().append("svg:path")
      //           .attr("class", "chord")
      //           .style("stroke", function(d) { return d3.rgb(fill(d.source)).darker(); })
      //           .style("fill", function(d) { return fill(d.source); })
      //           .attr("d", d3.ribbon().radius(radius))
      //           .attr("transform", function(d) {
      //             return "rotate(" + rotation + ")";
      //           })
      //           .style("opacity", 1);
      //     });
      //   }

      //   chart.width = function(value) {
      //     if (!arguments.length) return width;
      //     width = value;
      //     return chart;
      //   };

      //   chart.margin = function(value) {
      //     if (!arguments.length) return margin;
      //     margin = value;
      //     return chart;
      //   };

      //   chart.padding = function(value) {
      //     if (!arguments.length) return padding;
      //     padding = value;
      //     return chart;
      //   };

      //   return chart;
      // };

      // var chart = d3.chart.dependencyWheel();
      // d3.select('#sassUsageChart')
      //   .datum({
      //       packageNames: this.chordData.names,
      //       matrix: this.chordData.data
      //   })
      //   .call(chart);
    }
  },
});
</script>

<style scoped>
.sass-usage-chart {
  grid-column: 2 / 3;
  grid-row: 3 / 4;
}
</style>

