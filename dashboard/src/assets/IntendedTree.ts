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
    this.performanceIcon = '\uf252';
    // @ts-ignore
    this.stylisticIcon = '\uf0d0';
    // @ts-ignore
    this.currCat = ''
    // @ts-ignore
    this.displayCat = ''
    // @ts-ignore
    this.toolTipContainer = d3.select(".tooltipContainer").style("opacity", 0)
    // @ts-ignore
    this.detailContainer = d3.select(".d-content")
    this.tree = tree().nodeSize([0, 30]);
    this.root = this.tree(hierarchy(data))
    // @ts-ignore    
    this.getCategory = (cat: string) => {
      switch(cat) {
        case 'syntax':         
          return 'Syntax'
        case 'specificity':
          return 'Spezifizität'
        case 'style':
          return 'Style'
        case 'performance':
          return 'Performance'
        case 'dupl':
          return 'Duplizierung'
        default:
          return '' 
      }
    }
    // @ts-ignore        
    this.getTypes = (type: string) => {
      switch(type) {
        case 'type0':         
          return 'Alle Deklarationen dupliziert'
        case 'type1':
          return 'Typ 1'
        case 'type2':
          return 'Typ 2'
        case 'type3':
          return 'Typ 3'
        case 'type4':
          return 'Typ 4'
        case 'type5':
          return 'Typ 5'
        default:
          return 'Selektorname dupliziert' 
      }
    }
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
    
    // ! Add hover state for same nodes

    // Enter any new nodes at the parent's previous position.
    let nodeEnter = node.enter().append('g')
      .attr('class', function(d: any) {
        if(d.data.data && d.data.data.length > 0 && d.data.data[0].category === 'duplication') {
          let ref = ''
          // @ts-ignore          
          d.data.data.forEach(entry => {
            ref += `ref${entry.ref} `
          })
          return `node g${d.id ? d.id : 0} ${ref}`
        }
        return `node g${d.id ? d.id : 0}`
      })
      .attr("data-type", function(d: any) {
        if(!d.data.data) return ''
        if(d.data.data && d.data.data.length > 0 && d.data.data[0].category === 'duplication') {
          let types = ''
          // @ts-ignore          
          d.data.data.forEach(entry => {
            types += `type${entry.type} `
          })
          return `${types}`
        }
      })
      .attr("data-oline", function(d: any) {
        if(!d.data.data) return ''
        if(d.data.data && d.data.data.length > 0 && d.data.data[0].category === 'duplication') {
          return `${d.data.data[0].oLine}`
        }
      })
      .attr("data-ofile", function(d: any) {
        if(!d.data.data) return ''
        if(d.data.data && d.data.data.length > 0 && d.data.data[0].category === 'duplication') {
          return `${d.data.data[0].oFile}`
        }
      })
      .attr("data-dLine", function(d: any) {
        if(!d.data.data) return ''
        if(d.data.data && d.data.data.length > 0 && d.data.data[0].category === 'duplication') {
          let line = ''
          // @ts-ignore          
          d.data.data.forEach(entry => {
            line += `${entry.oLine} `
          })
          return `${line}`
        }
      })
      .attr("data-dFile", function(d: any) {
        if(!d.data.data) return ''
        if(d.data.data && d.data.data.length > 0 && d.data.data[0].category === 'duplication') {
          let files = ''
          // @ts-ignore          
          d.data.data.forEach(entry => {
            files += `${entry.oLine} `
          })
          return `${files}`
        }
      })
      .attr('transform', function () {
        return 'translate(' + source.y0 + ',' + source.x0 + ')';
      })
      .on('click', this.click);

    const that = this

    nodeEnter.on("mouseover", function(d: any) {
        if(!d.data.data) return
        if(d.data.data.length > 0 && d.data.data[0].category === 'duplication') {
          // @ts-ignore
          this.classList.forEach((element, index) => {
            // erst hier steheh die refs zu anderen nodes
            if(index > 1 && element !== 'refundefined' && !element.includes('type')) {
              that.svg.selectAll(`.node`).classed("darken", true)
              // @ts-ignore
              that.svg.selectAll(`.${element}`).classed("duplHover", true)
            } else if(element === 'refundefined') {
              that.svg.selectAll(`.node`).classed("darken", true)
              // @ts-ignore
              d3.select(this).classed("duplHover", true)
            }
          })              
          // @ts-ignore
          if(that.sel === 'partialdupl') {
            let template = `Folgende Informationen wurden gefunden: <br/>`
            // @ts-ignore          
            const arr = d3.select(this)._groups[0][0].dataset.type.split(' ')
            const types = [...new Set(arr.filter(Boolean))]
            types.forEach(type => {
              // @ts-ignore            
              template += `- ${that.getTypes(type)}<br/>`
            });

            const placeholder = document.querySelector('.placeholder')
            placeholder.classList.toggle('hidden')
            
            // @ts-ignore
            that.detailContainer.html(`
              ${template}
              `).classed('hidden', false)
          }
        }
      })
      .on("mouseout", function(d: any) {
        if(!d.data.data) return
        if(d.data.data.length > 0 && d.data.data[0].category === 'duplication') {
          // @ts-ignore          
          this.classList.forEach((element, index) => {
            // erst hier stehen die refs zu anderen nodes
            if(index > 1 && element !== 'refundefined' && !element.includes('type')) {
              that.svg.selectAll(`.node`).classed("darken", false)
              that.svg.selectAll(`.${element}`).classed("duplHover", false)
            } else if(element === 'refundefined') {
              that.svg.selectAll(`.node`).classed("darken", false)
              // @ts-ignore
              d3.select(this).classed("duplHover", false)
            }
          })
          // @ts-ignore
          if(that.sel === 'partialdupl') {
            const placeholder = document.querySelector('.placeholder')
            placeholder.classList.toggle('hidden')
            // @ts-ignore          
            that.detailContainer.classed('hidden', true)
          }
        }
      });

    nodeEnter.append('circle')
      .attr('r', 1e-6)
      .attr('class', function(d: any) {
        if(d.data.data) {
          if(d.data.data.length > 0 && d.data.data[0].category === 'duplication') {
            let color = ''
            // @ts-ignore          
            d.data.data.forEach(entry => {
              color += `type${entry.type} `
            })
  
            return d._children ? 'lightsteelblue' : color
          }
        }
        return d._children ? 'lightsteelblue' : '#fff';
      });

    nodeEnter.append('text')
      .attr('x', function (d: any) {
        return d.children || d._children ? 10 : 10;
      })
      .attr('dy', '.35em')
      .attr('text-anchor', function (d: any) {
        return d.children || d._children ? 'start' : 'start';
      })
      .text(function (d: any) {
        if(d.data.data) {
          if(d.data.data.length > 0 && d.data.data[0].category !== 'duplication') {
            const node = that.svg.select(`.g${d.id ? d.id : 0}`)
            // @ts-ignore
            d.data.data.forEach((entry, index) => {
              // @ts-ignore
              that.currCat = entry.category

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
                if(that.currCat === 'specificity') return 'fa-icon spec'     
                // @ts-ignore
                return 'fa-icon ' + that.currCat;
              })
              .attr("data-rule", function(d: any) {
                return entry.rule
              })
              .attr("data-file", function(d: any) {
                return entry.file
              })
              .attr("data-line", function(d: any) {
                return entry.line
              })
              .attr("data-property", function(d: any) {
                return entry.property
              })
              .attr('transform', function () {
                if(index === 0) {
                  return 'translate(0)';
                } else {
                  const value = 20 * index;
                  return `translate(${value})`;
                }
              })
              .on("mouseover", function(d: any) {
                const prop = `<b>Deklaration: </b>${entry.property}`
                // @ts-ignore
                const cat = that.getCategory(entry.category)
                // @ts-ignore                            
                that.toolTipContainer
                  .style("opacity", .9);
                // @ts-ignore
                that.toolTipContainer.html(`
                  <b>Warnung: </b>${entry.rule}<br>
                  <b>Kategorie: </b>${cat}<br>
                  <b>Datei/Zeile: </b>${entry.file} / ${entry.line}<br>${entry.property ?  prop : ''}
                `)
                  .style("left", (d3.event.pageX + 10) + "px")
                  .style("top", (d3.event.pageY - 28) + "px");	
                })					
              .on("mouseout", function(d: any) {
                // @ts-ignore              
                that.toolTipContainer.style("opacity", 0);	
              });
            })
          } 
        }
        // continue as usual
        if (d.data.name.length > 30) {
          return d.data.name.substring(0, 20) + '...';
        } else {
          return d.data.name;
        }
      })
      .style('fill-opacity', 1e-6);

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
