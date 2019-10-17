import * as d3 from 'd3';
/* eslint-disable */
export default class IntendedTree {
  constructor() {
  }
  
  margin: { left:number, right:number, top:number, bottom:number };  
  width: number;
  height: number;
  barHeight: number;
  barWidth: number;
  i: number;
  duration: number;
  // @ts-ignore
  tree;
  // @ts-ignore
  root;
  // @ts-ignore
  svg;

  $onInit(data: any, selector: any) {
    const tree = d3.tree;
    const hierarchy = d3.hierarchy;
    const select = d3.select;

    this.margin = {top: 20, right: 10, bottom: 20, left: 10};
    this.width = 1000 - this.margin.right - this.margin.left;
    this.height = 800 - this.margin.top - this.margin.bottom;
    this.barHeight = 20;
    this.barWidth = this.width *.8;
    this.i = 0;
    this.duration = 500;
    this.tree = tree().size([this.width, this.height]);
    // @ts-ignore
    this.sel = selector
    // this.tree = tree().nodeSize([0, 30]);
    // @ts-ignore
    this.syntaxIcon = '\uf121';
    // @ts-ignore
    this.duplicationsIcon = '\uf0c5';
    // @ts-ignore
    this.specificityIcon = '\uf201';
    // @ts-ignore
    this.performanceIcon = '\uf251';
    // @ts-ignore
    this.stylisticIcon = '\uf0d0';
    // @ts-ignore
    this.currCat = ''


    this.tree = tree().nodeSize([0, 30]);
    this.root = this.tree(hierarchy(data));
    // @ts-ignore
    this.root.each((d)=> {
      d.name = d.id; //transferring name to a name variable
      d.id = this.i; //Assigning numerical Ids
      this.i++;
    });
    this.root.x0 = this.root.x;
    this.root.y0 = this.root.y
    this.svg = select(`#${selector}`).append('svg')
      .attr('width', this.width + this.margin.right + this.margin.left)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    // this.root.children.forEach(this.collapse);
    this.update(this.root);
  }
  
  connector = function(d:any) {
   //curved 
   /*return "M" + d.y + "," + d.x +
      "C" + (d.y + d.parent.y) / 2 + "," + d.x +
      " " + (d.y + d.parent.y) / 2 + "," + d.parent.x +
      " " + d.parent.y + "," + d.parent.x;*/
    //straight
    return "M" + d.parent.y + "," + d.parent.x
      + "V" + d.x + "H" + d.y;      
  }
  
  collapse = (d: any) => {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(this.collapse);
      d.children = null;
    }
  };

  click = (d: any) => {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    this.update(d);
  };

  update = (source: any) => {
    this.width=800;

    // Compute the new tree layout.
    let nodes = this.tree(this.root)
    // @ts-ignore
    let nodesSort = [];
    // @ts-ignore
    nodes.eachBefore(function (n) {
      // @ts-ignore
      nodesSort.push(n);
    });
    this.height = Math.max(500, nodesSort.length * this.barHeight + this.margin.top + this.margin.bottom);
    // @ts-ignore
    let links = nodesSort.slice(1);
    // Compute the "layout".
    // @ts-ignore
    nodesSort.forEach ((n,i)=> {
      n.x = i *this.barHeight;
    });

    // update chart/svg height
    // @ts-ignore
    d3.select(`#${this.sel} svg`).transition()
      .duration(this.duration)
      .attr("height", this.height);

    // Update the nodes…
    let node = this.svg.selectAll('g.node')
    // @ts-ignore
      .data(nodesSort, function (d: any) {
        // @ts-ignore
        return d.id || (d.id = ++this.i);
      });

    // Enter any new nodes at the parent's previous position.
    let nodeEnter = node.enter().append('g')
      .attr('class', function(d: any) {
        return `node g${d.id ? d.id : 0}`
      })
      .attr('transform', function () {
        return 'translate(' + source.y0 + ',' + source.x0 + ')';
      })
      .on('click', this.click);

    nodeEnter.append('circle')
      .attr('r', 1e-6)
      .style('fill', function (d: any) {
        return d._children ? 'lightsteelblue' : '#fff';
      });

    const that = this;
    nodeEnter.append('text')
      .attr('x', function (d: any) {
        return d.children || d._children ? 10 : 10;
      })
      .attr('dy', '.35em')
      .attr('text-anchor', function (d: any) {
        return d.children || d._children ? 'start' : 'start';
      })
      .text(function (d: any) {
        // add icons
        const node = that.svg.select(`.g${d.id ? d.id : 0}`)
        if(d.data.category) {
          // @ts-ignore
          d.data.category.forEach((cat, index) => {
            // @ts-ignore
            that.currCat = cat
            node.append('text')
            .attr('x', function (d: any) {
              const length = d.data.name.length
              return 25 + length*6;
            })
            .attr('dy', '.35em')
            .attr('font-family', 'Font Awesome 5 Free')
            .style('font-weight', '900')
            .style('font-size', '15px' )
            .text(function(d: any) {
              let icon = ''
            // @ts-ignore
              switch(that.currCat) {
                case 'syntax':
                // @ts-ignore
                icon = that.syntaxIcon;
                break;
                case 'specificity':
                // @ts-ignore
                icon = that.specificityIcon;
                break;                  
                case 'style':
                // @ts-ignore
                icon = that.stylisticIcon;
                break;                  
                case 'performance':
                // @ts-ignore
                icon = that.performanceIcon;
                break;
                case 'dupl':
               // @ts-ignore
                icon = that.duplicationsIcon;
                break;                  
              }
              return icon;
            })
            .attr('class', function(d: any) {
               // @ts-ignore              
              return 'fa-icon ' + that.currCat;
            })
            .attr('transform', function () {
              if(index === 0) {
                return 'translate()';
              } else {
                const value = 20 * index;
                return `translate(${value})`;
              }
            })
          })
        }
        // continue as usual
        if (d.data.name.length > 30) {
          return d.data.name.substring(0, 20) + '...';
        } else {
          return d.data.name;
        }
      })
      .style('fill-opacity', 1e-6);

    // return d.data.category ? d.data.category : '';
    // TODO: hier müssen die Icons entsprechend der Kategorien hinzugefügt werden
    // forearch d.data.category 

    nodeEnter.append('svg:title').text(function (d: any) {
      return d.data.name ? d.data.name : '';
    });

    // Transition nodes to their new position.
    let nodeUpdate = node.merge(nodeEnter)
      .transition()
      .duration(this.duration);
    
    nodeUpdate.attr('transform', function (d: any) {
        return 'translate(' + d.y + ',' + d.x + ')';
      });

    nodeUpdate.select('circle')
      .attr('r', 4.5)
      .style('fill', function (d: any) {
        return d._children ? 'lightsteelblue' : '#fff';
      });
    
    nodeUpdate.select('text')
      .style('fill-opacity', 1);

    // Transition exiting nodes to the parent's new position (and remove the nodes)
    let nodeExit = node.exit().transition()
      .duration(this.duration);
    
    nodeExit
      .attr('transform', function (d: any) {
        return 'translate(' + source.y + ',' + source.x + ')';
      })
      .remove();

    nodeExit.select('circle')
      .attr('r', 1e-6);

    nodeExit.select('text')
      .style('fill-opacity', 1e-6);
    
    // Update the links…
    let link = this.svg.selectAll('path.link')
      .data(links, function (d: any) {
        // return d.target.id;
        const id = d.id + '->' + d.parent.id;
        return id;
      });

    // Enter any new links at the parent's previous position.
    let linkEnter = link.enter().insert('path', 'g')
      .attr('class', 'link')
      // @ts-ignore
      .attr('d', (d) => {
        const o = {x: source.x0, y: source.y0, parent: {x: source.x0, y: source.y0}};
        return this.connector(o);
      });
    
    // Transition links to their new position.
    link.merge(linkEnter).transition()
      .duration(this.duration)
      .attr('d', this.connector);


    // // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(this.duration)
      .attr('d', (d: any) => {
        const o = {x: source.x, y: source.y, parent: {x: source.x, y: source.y}};
        return this.connector(o);
      })
      .remove();

    // Stash the old positions for transition.
    // @ts-ignore
    nodesSort.forEach(function (d: any) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }
};
/* eslint-enable */
