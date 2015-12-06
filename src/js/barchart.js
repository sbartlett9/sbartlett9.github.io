//D3 BAR CHART
var barchartMargin ={top:20, right:30, bottom:30, left:40},
    barchartWidth=960-barchartMargin.left - barchartMargin.right, 
    barchartHeight=500-barchartMargin.top-barchartMargin.bottom;

// scale to ordinal because x axis is not numerical
var x2 = d3.scale.ordinal().rangeRoundBands([0, barchartWidth], .1);

//scale to numerical value by height
var y2 = d3.scale.linear().range([barchartHeight, 0]);

var chart2 = d3.select("#chart")  
              .append("svg")  //append svg element inside #chart
              .attr("width", barchartWidth+(2*barchartMargin.left)+barchartMargin.right)    //set width
              .attr("height", barchartHeight+barchartMargin.top+barchartMargin.bottom);  //set height

var xAxis2 = d3.svg.axis()
              .scale(x2)
              .orient("bottom");  //orient bottom because x-axis will appear below the bars

var yAxis2 = d3.svg.axis()
              .scale(y2)
              .orient("left");

d3.json(org_rawdata, function(error, data){
  x2.domain(data.map(function(d){ return d.DonorOrganization}));
  y2.domain([0, d3.max(data, function(d){return d.Total})]);
  
  var bar2 = chart.selectAll("g")
                    .data(data)
                  .enter()
                    .append("g")
                    .attr("transform", function(d, i){
                      return "translate("+ x(d.DonorOrganization)+", 0)";
                    });
  
  bar2.append("rect")
      .attr("y", function(d) { 
        return y2(d.Total); 
      })
      .attr("x", function(d,i){
        return x2.rangeBand()+(barchartMargin.left/2);
      })
      .attr("height", function(d) { 
        return barchartHeight - y(d.Total); 
      })
      .attr("width", x2.rangeBand());  //set width base on range on ordinal data

  bar2.append("text")
      .attr("x", x2.rangeBand()+barchartMargin.left )
      .attr("y", function(d) { return y(d.Total) -10; })
      .attr("dy", ".75em")
      .text(function(d) { return d.Total; });
  
  chart2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate("+barchartMargin.left+","+ barchartHeight+")")        
        .call(xAxis2);
  
  chart2.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate("+barchartMargin.left+",0)")
        .call(yAxis2)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Total");
});

function type(d) {
    d.DonorOrganization = +d.DonorOrganization; // coerce to number
    return d;
  }