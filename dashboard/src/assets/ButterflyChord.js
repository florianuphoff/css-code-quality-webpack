/**
 * Created by Nadieh Bremer
 * this is a modified version
 */

import * as d3 from 'd3';
// import customChordLayout from './ChordSort';
// import stretchedChord from './StretchedChord';

const ButterflyChord = {
  draw(id, d, options) {
    // pseudo options
    const cfg = {
      radius: 5,
      w: 300,
      h: 300,
      factor: 1,
      factorLegend: 0.85,
      levels: 10,
      maxValue: 100,
      radians: 2 * Math.PI,
      opacityArea: 0.3,
      ToRight: 5,
      TranslateX: 80,
      TranslateY: 30,
      ExtraWidthX: 100,
      ExtraWidthY: 100,
      color: d3.scaleOrdinal().range(['#ff8a00', '#ff8a00']),
    };

    // //////////////////////////////////////////////////////////
    // ////////////////////// Set-up ////////////////////////////
    // //////////////////////////////////////////////////////////
    // TODO: replace width resired with
    const screenWidth = 700;
    const mobileScreen = (!(screenWidth > 400));

    const margin = {
      left: 50, top: 10, right: 50, bottom: 10,
    };
    const width = Math.min(screenWidth, 800) - margin.left - margin.right;
    const height = (mobileScreen ? 300 : Math.min(screenWidth, 800) * 5 / 6) - margin.top - margin.bottom;

    const svg = d3.select(id).append('svg')
      .attr('width', (width + margin.left + margin.right))
      .attr('height', (height + margin.top + margin.bottom));

    const wrapper = svg.append('g').attr('class', 'chordWrapper')
      .attr('transform', `translate(${width / 2 + margin.left},${height / 2 + margin.top})`);

    const outerRadius = Math.min(width, height) / 2 - (mobileScreen ? 80 : 100);
    const innerRadius = outerRadius * 0.95;
    const pullOutSize = (mobileScreen ? 20 : 50);
    const opacityDefault = 0.7; // default opacity of chords
    const opacityLow = 0.02; // hover opacity of those chords not hovered over


    // //////////////////////////////////////////////////////////
    // //////////////////////// Data ////////////////////////////
    // //////////////////////////////////////////////////////////

    // TODO: replace with data
    const Names = ['X', 'Y', 'Z', '', 'C', 'B', 'A', ''];

    const respondents = 95; // Total number of respondents (i.e. the number that makes up the total group)
    const emptyPerc = 0.4; // What % of the circle should become empty
    const emptyStroke = Math.round(respondents * emptyPerc);
    const matrix = [
      [0, 0, 0, 0, 10, 5, 15, 0], // X
      [0, 0, 0, 0, 5, 15, 20, 0], // Y
      [0, 0, 0, 0, 15, 5, 5, 0], // Z
      [0, 0, 0, 0, 0, 0, 0, emptyStroke], // Dummy stroke
      [10, 5, 15, 0, 0, 0, 0, 0], // C
      [5, 15, 5, 0, 0, 0, 0, 0], // B
      [15, 20, 5, 0, 0, 0, 0, 0], // A
      [0, 0, 0, emptyStroke, 0, 0, 0, 0], // Dummy stroke
    ];

    // Calculate how far the Chord Diagram needs to be rotated clockwise to make the dummy
    // invisible chord center vertically
    const offset = (2 * Math.PI) * (emptyStroke / (respondents + emptyStroke)) / 4;

    // Include the offset in de start and end angle to rotate the Chord diagram clockwise
    function startAngle(d) { return d.startAngle + offset; }
    function endAngle(d) { return d.endAngle + offset; }

    // Custom sort function of the chords to keep them in the original order
    function customSort(a, b) {
      return 1;
    }

    // Custom sort function of the chords to keep them in the original order
    const chord = customChordLayout() // d3.layout.chord()//Custom sort function of the chords to keep them in the original order
      .padding(0.02)
      .sortChords(d3.descending) // which chord should be shown on top when chords cross. Now the biggest chord is at the bottom
      .matrix(matrix);

    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(startAngle) // startAngle and endAngle now include the offset in degrees
      .endAngle(endAngle);

    const path = stretchedChord()
      .radius(innerRadius)
      .startAngle(startAngle)
      .endAngle(endAngle)
      .pullOutSize(pullOutSize);

    // //////////////////////////////////////////////////////////
    // ////////////////// Draw outer Arcs ///////////////////////
    // //////////////////////////////////////////////////////////

    const g = wrapper.selectAll('g.group')
      .data(chord.groups)
      .enter().append('g')
      .attr('class', 'group')
      .on('mouseover', fade(opacityLow))
      .on('mouseout', fade(opacityDefault));

    g.append('path')
      .style('stroke', (d, i) => (Names[i] === '' ? 'none' : '#da1b60'))
      .style('fill', (d, i) => (Names[i] === '' ? 'none' : '#da1b60'))
      .style('pointer-events', (d, i) => (Names[i] === '' ? 'none' : 'auto'))
      .attr('d', arc)
      .attr('transform', (d, i) => { // Pull the two slices apart
        d.pullOutSize = pullOutSize * (d.startAngle + 0.001 > Math.PI ? -1 : 1);
        return `translate(${d.pullOutSize},${0})`;
      });


    // //////////////////////////////////////////////////////////
    // //////////////////// Append Names ////////////////////////
    // //////////////////////////////////////////////////////////

    // The text also needs to be displaced in the horizontal directions
    // And also rotated with the offset in the clockwise direction
    g.append('text')
      .each((d) => { d.angle = ((d.startAngle + d.endAngle) / 2) + offset; })
      .attr('dy', '.35em')
      .attr('class', 'titles')
      .attr('text-anchor', d => (d.angle > Math.PI ? 'end' : null))
      .attr('transform', (d, i) => {
        const c = arc.centroid(d);
        return `translate(${c[0] + d.pullOutSize},${c[1]})`
      + `rotate(${d.angle * 180 / Math.PI - 90})`
      + `translate(${55},0)${
        d.angle > Math.PI ? 'rotate(180)' : ''}`;
      })
      .text((d, i) => Names[i]);

    // //////////////////////////////////////////////////////////
    // ////////////////// Draw inner chords /////////////////////
    // //////////////////////////////////////////////////////////

    const chords = wrapper.selectAll('path.chord')
      .data(chord.chords)
      .enter().append('path')
      .attr('class', 'chord')
      .style('stroke', 'none')
      .style('fill', '#C4C4C4')
      .style('opacity', d => (Names[d.source.index] === '' ? 0 : opacityDefault)) // Make the dummy strokes have a zero opacity (invisible)
      .style('pointer-events', (d, i) => (Names[d.source.index] === '' ? 'none' : 'auto')) // Remove pointer events from dummy strokes
      .attr('d', path)
      .on("mouseover", fadeOnChord)
      .on("mouseout", fade(opacityDefault));	

    // //////////////////////////////////////////////////////////
    // /////////////////////// Tooltip //////////////////////////
    // //////////////////////////////////////////////////////////

    // Arcs
    g.append('title')
      .text((d, i) => `${Math.round(d.value) } people in ${Names[i]}`);

    // Chords
    chords.append('title')
      .text(d => [Math.round(d.source.value), ' people from ', Names[d.target.index], ' to ', Names[d.source.index]].join(''));

    // Returns an event handler for fading a given chord group
    function fade(opacity) {
      return function (d, i) {
        svg.selectAll('path.chord')
          .filter(d => d.source.index !== i && d.target.index !== i && Names[d.source.index] !== '')
          .transition('fadeOnArc')
          .style('opacity', opacity);
      };
    }// fade

    // Fade function when hovering over chord
    function fadeOnChord(d) {
      var chosen = d;
      wrapper.selectAll("path.chord")
        .transition()
        .style("opacity", function(d) {
          return d.source.index === chosen.source.index && d.target.index === chosen.target.index ? opacityDefault : opacityLow;
        });
    }//fadeOnChord

    function stretchedChord() {
      var source = d3_source, 
      target = d3_target, 
      radius = d3_svg_chordRadius, 
      startAngle = d3_svg_arcStartAngle, 
      endAngle = d3_svg_arcEndAngle,
      pullOutSize = 0;
      
      var π = Math.PI,
      halfπ = π / 2;
    
      function subgroup(self, f, d, i) {
      var subgroup = f.call(self, d, i), 
        r = radius.call(self, subgroup, i), 
        a0 = startAngle.call(self, subgroup, i) - halfπ, 
        a1 = endAngle.call(self, subgroup, i) - halfπ;
        return {
          r: r,
          a0: [a0],
          a1: [a1],
          p0: [ r * Math.cos(a0), r * Math.sin(a0)],
          p1: [ r * Math.cos(a1), r * Math.sin(a1)]
        };
      }
    
      function arc(r, p, a) {
      var sign = (p[0] >= 0 ? 1 : -1);
      return "A" + r + "," + r + " 0 " + +(a > π) + ",1 " + (p[0] + sign*pullOutSize) + "," + p[1];
      }
    
    
      function curve(p1) {
      var sign = (p1[0] >= 0 ? 1 : -1);
      return "Q 0,0 " + (p1[0] + sign*pullOutSize) + "," + p1[1];
      }
    
      /*
      M = moveto
      M x,y
      Q = quadratic Bézier curve
      Q control-point-x,control-point-y end-point-x, end-point-y
      A = elliptical Arc
      A rx, ry x-axis-rotation large-arc-flag, sweep-flag  end-point-x, end-point-y
      Z = closepath
    
      M251.5579641956022,87.98204731514328
      A266.5,266.5 0 0,1 244.49937503334525,106.02973926358392
      Q 0,0 -177.8355222451483,198.48621369706098
      A266.5,266.5 0 0,1 -191.78901944612068,185.0384338992728
      Q 0,0 251.5579641956022,87.98204731514328
      Z
      */  
      function chord(d, i) {
        var s = subgroup(this, source, d, i), 
        t = subgroup(this, target, d, i);
            
        return "M" + (s.p0[0] + pullOutSize) + "," + s.p0[1] + 
          arc(s.r, s.p1, s.a1 - s.a0) + 
          curve(t.p0) + 
          arc(t.r, t.p1, t.a1 - t.a0) + 
          curve(s.p0) + 
          "Z";
      }//chord
    
      chord.radius = function(v) {
        if (!arguments.length) return radius;
        radius = d3_functor(v);
        return chord;
      };
      chord.pullOutSize = function(v) {
        if (!arguments.length) return pullOutSize;
        pullOutSize = v;
        return chord;
      };
      chord.source = function(v) {
        if (!arguments.length) return source;
        source = d3_functor(v);
        return chord;
      };
      chord.target = function(v) {
        if (!arguments.length) return target;
        target = d3_functor(v);
        return chord;
      };
      chord.startAngle = function(v) {
        if (!arguments.length) return startAngle;
        startAngle = d3_functor(v);
        return chord;
      };
      chord.endAngle = function(v) {
        if (!arguments.length) return endAngle;
        endAngle = d3_functor(v);
        return chord;
      };
    
    
      function d3_svg_chordRadius(d) {
        return d.radius;
      }
    
      function d3_source(d) {
      return d.source;
      }
      
      function d3_target(d) {
        return d.target;
      }
    
      function d3_svg_arcStartAngle(d) {
        return d.startAngle;
      }
      
      function d3_svg_arcEndAngle(d) {
        return d.endAngle;
      }
    
      function d3_functor(v) {
        return typeof v === "function" ? v : function() {
          return v;
        };
      }
    
      return chord;
    }//stretchedChord

    function customChordLayout() {
      var ε = 1e-6, ε2 = ε * ε, π = Math.PI, τ = 2 * π, τε = τ - ε, halfπ = π / 2, d3_radians = π / 180, d3_degrees = 180 / π;
      var chord = {}, chords, groups, matrix, n, padding = 0, sortGroups, sortSubgroups, sortChords;
      function relayout() {
        var subgroups = {}, groupSums = [], groupIndex = d3.range(n), subgroupIndex = [], k, x, x0, i, j;
        chords = [];
        groups = [];
        k = 0, i = -1;
        while (++i < n) {
          x = 0, j = -1;
          while (++j < n) {
            x += matrix[i][j];
          }
          groupSums.push(x);
          subgroupIndex.push(d3.range(n).reverse());
          k += x;
        }
        if (sortGroups) {
          groupIndex.sort(function(a, b) {
            return sortGroups(groupSums[a], groupSums[b]);
          });
        }
        if (sortSubgroups) {
          subgroupIndex.forEach(function(d, i) {
            d.sort(function(a, b) {
              return sortSubgroups(matrix[i][a], matrix[i][b]);
            });
          });
        }
        k = (τ - padding * n) / k;
        x = 0, i = -1;
        while (++i < n) {
          x0 = x, j = -1;
          while (++j < n) {
            var di = groupIndex[i], dj = subgroupIndex[di][j], v = matrix[di][dj], a0 = x, a1 = x += v * k;
            subgroups[di + "-" + dj] = {
              index: di,
              subindex: dj,
              startAngle: a0,
              endAngle: a1,
              value: v
            };
          }
          groups[di] = {
            index: di,
            startAngle: x0,
            endAngle: x,
            value: (x - x0) / k
          };
          x += padding;
        }
        i = -1;
        while (++i < n) {
          j = i - 1;
          while (++j < n) {
            var source = subgroups[i + "-" + j], target = subgroups[j + "-" + i];
            if (source.value || target.value) {
              chords.push(source.value < target.value ? {
                source: target,
                target: source
              } : {
                source: source,
                target: target
              });
            }
          }
        }
        if (sortChords) resort();
      }
      function resort() {
        chords.sort(function(a, b) {
          return sortChords((a.source.value + a.target.value) / 2, (b.source.value + b.target.value) / 2);
        });
      }
      chord.matrix = function(x) {
        if (!arguments.length) return matrix;
        n = (matrix = x) && matrix.length;
        chords = groups = null;
        return chord;
      };
      chord.padding = function(x) {
        if (!arguments.length) return padding;
        padding = x;
        chords = groups = null;
        return chord;
      };
      chord.sortGroups = function(x) {
        if (!arguments.length) return sortGroups;
        sortGroups = x;
        chords = groups = null;
        return chord;
      };
      chord.sortSubgroups = function(x) {
        if (!arguments.length) return sortSubgroups;
        sortSubgroups = x;
        chords = null;
        return chord;
      };
      chord.sortChords = function(x) {
        if (!arguments.length) return sortChords;
        sortChords = x;
        if (chords) resort();
        return chord;
      };
      chord.chords = function() {
        if (!chords) relayout();
        return chords;
      };
      chord.groups = function() {
        if (!groups) relayout();
        return groups;
      };
      return chord;
    };
  }
};

export default ButterflyChord;
