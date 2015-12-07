function init_chart() {
    var width = 1000
    height = 400;

    var margin = {
        top: 20,
        right: 10,
        bottom: 20,
        left: 30
    };
    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    //var barWidth = (width - 100) / global_senate_data.length;
    var maxContribution = d3.max(global_senate_data, function (d) {
        return +d.total;
    });

    x = d3.scale.ordinal()
        .domain(global_senate_data.map(function (d) {
            return d.id;
        }))
        .rangeRoundBands([0, width], 0.1);

    //    var xAxis = d3.svg.axis()
    //        .scale(x)
    //        .orient("bottom");    
    yScale = d3.scale.linear()
        .domain([0, maxContribution]) //maxContribution])
        .range([height, 0]);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(5)
        .tickFormat(d3.format('5s'));
    //		.tickValues([0, 5000000, 10000000, 15000000, 20000000, 25000000, 30000000]);

    tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([2, -5])
        .html(function (d) {
            return "<strong><h3>" + d.name + ":</h3></strong> <h3 style='color:green'>$" + formatdollar(d.total) + "</h3>";
        });

    chart = d3.select("#chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    chart.call(tip);

    // chart.call(tip);

    chart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + "," + 0 + ")")
        .call(yAxis);
    console.log(maxContribution); // $29,309,043
    console.log(d3.sum(global_senate_data, function (d) {
        return d.total;
    })); // $459,768,168

    renderSummaryChart();
}

function renderSummaryChart() {

    console.log("rendering summary chart");

    var bars = chart.selectAll(".bar")
        .data(global_senate_data);
    var bar = bars.enter();
    bar.append("rect")
        .attr("y", function (d) {
            return yScale(d.total);
        })
        .attr("height", function (d) {
            return 500;
            // return height - yScale(d.total);
        })
        .attr("x", function (d) {
            return x(d.id);
        })
        .attr("width", x.rangeBand())
        //.attr("width", barWidth)
        .attr("class", function (d) {
            return d.party.toLowerCase();
        })
        .attr("fill", function (d) {
            if (d.party === "Republican")
                return "#D80206";
            else if (d.party === "Democrat")
                return "#3045C4";
            else if (d.party === "Independent")
                return "#c4b130";
            else
                return "#000000";
        })
        // .style("stroke", "black")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
    bar.append("rect")
        .attr("y", function (d) {
            return yScale(d.total);
        })
        .attr("height", function (d) {
            return height - yScale(d.total);
        })
        .attr("x", function (d) {
            return x(d.id);
        })
        .attr("width", x.rangeBand())
        // .attr("width", barWidth - 2)
        .attr("class", "indep_contributor")
        .style("fill", color_scale("light"));
    //:rgb(229, 245, 224);");
    bar.append("rect")
        .attr("y", function (d) {
            return yScale(d.indep_exp_indirect + d.indep_exp_supporting);
        })
        .attr("height", function (d) {
            return height - yScale(d.indep_exp_indirect + d.indep_exp_supporting);
        })
        .attr("x", function (d) {
            return x(d.id);
        })
        .attr("width", x.rangeBand())
        //   .attr("width", barWidth - 2)
        .attr("class", "indep_exp_supporting")
        .style("fill", color_scale("dark")); //:rgb(161, 217, 155);");
    bar.append("rect")
        .attr("y", function (d) {
            return yScale(d.indep_exp_indirect);
        })
        .attr("height", function (d) {
            return height - yScale(d.indep_exp_indirect);
        })
        .attr("x", function (d) {
            return x(d.id);
        })
        .attr("width", x.rangeBand())
        //       .attr("width", barWidth - 2)
        .attr("class", "indep_exp_indirect")
        .style("fill", color_scale("dark indirect")); //":rgb(49, 163, 84);");    
    bar.append("rect")
        .attr("y", function (d) {
            return yScale(d.org_contribution);
        })
        .attr("height", function (d) {
            return height - yScale(d.org_contribution);
        })
        .attr("x", function (d) {
            return x(d.id) + x.rangeBand() / 2 - 3; //center
        })
        .attr("width", "6px")
        //.attr("width", barWidth - 2)
        .attr("class", "org_contribution") //where is this class?
        //.style("fill", ":rgb(0, 0, 0);")
        .style("border", "2px gray"); // bar.exit().remove();
    bars.exit().remove();

}

function clearSenateOrganizationContributionValues() {
    global_senate_data.forEach(function (d) {
        d.org_contribution = 0;
    });
    renderSummaryChart();
}

function updateSenateOrganizationContributionValues(senator_org_map) {
    global_senate_data.forEach(function (d) {
        if (senator_org_map.has(d.id)) {
            d.org_contribution = senator_org_map.get(d.id);
        } else {
            d.org_contribution = 0;
        }

    });
    renderSummaryChart();

}

/*
		
		<script id="csv" type="text/csv">DonorOrganization,RecipientCandidateNameNormalized,RecipientCandidateFECID,DonorEntityType,Total,govtrack_id,type Retired,Thom R Tillis,S4NC00162,Individual,1480122,412668,light Self Employed,Thom R Tillis,S4NC00162,Individual,764708,412668,light Homemaker,Thom R Tillis,S4NC00162,Individual 589425,412668,light Elliott Management,Thom R Tillis ,S4NC00162,Individual,101400 ,412668,light Kleinberg Kaplan ,Thom R Tillis,S4NC00162,Individual,50912,412668,light
        </script>		
		var bar_data = d3.csv.parse(d3.select('#csv').text());
		console.log(bar_data);
		var valueLabelWidth = 60; // space reserved for value labels (right)
		var barHeight = 40; // height of one bar
		var barLabelWidth = 200; // space reserved for bar labels
		var barLabelPadding = 2; // padding between bar and bar labels (left)
		var gridLabelHeight = 18; // space reserved for gridline labels
		var gridChartOffset = 3; // space between start of grid and first bar
		var maxBarWidth = 800; // width of the bar with the max value
		
		// data aggregation
		var aggregatedData = d3.nest()
		  .key(function(d) { return d['DonorOrganization']; })
		  .rollup(function(d) {
		    return {
		      'value': d3.sum(d, function(e) { return parseFloat(e['Total']); })
		    };
		  })
		  .entries(bar_data);
		 
		// accessor functions 
		var barLabel = function(d) { return d.key; };
		var barValue = function(d) { return d.values.value; };
		 
		// sorting
		var sortedData = aggregatedData.sort(function(a, b) {
		 return d3.descending(barValue(a), barValue(b));
		}); 
		
		// scales
		var yScale = d3.scale.ordinal().domain(d3.range(0, sortedData.length)).rangeBands([0, sortedData.length * barHeight]);
		var y = function(d, i) { return yScale(i); };
		var yText = function(d, i) { return y(d, i) + yScale.rangeBand() / 2; };
		var x = d3.scale.linear().domain([0, d3.max(sortedData, barValue)]).range([0, maxBarWidth]);
		// svg container element
		var chart = d3.select('#chart').append("svg")
		  .attr('width', maxBarWidth + barLabelWidth + valueLabelWidth)
		  .attr('height', gridLabelHeight + gridChartOffset + sortedData.length * barHeight);
		// grid line labels
		var gridContainer = chart.append('g')
		  .attr('transform', 'translate(' + barLabelWidth + ',' + gridLabelHeight + ')'); 
		gridContainer.selectAll("text").data(x.ticks(10)).enter().append("text")
		  .attr("x", x)
		  .attr("dy", -3)
		  .attr("text-anchor", "left")
		  .text(String);
		// vertical grid lines
		gridContainer.selectAll("line").data(x.ticks(10)).enter().append("line")
		  .attr("x1", x)
		  .attr("x2", x)
		  .attr("y1", 0)
		  .attr("y2", yScale.rangeExtent()[1] + gridChartOffset)
		  .style("stroke", "#ccc");
		// bar labels
		var labelsContainer = chart.append('g')
		  .attr('transform', 'translate(' + (barLabelWidth - barLabelPadding) + ',' + (gridLabelHeight + gridChartOffset) + ')'); 
		labelsContainer.selectAll('text').data(sortedData).enter().append('text')
		  .attr('y', yText)
		  .attr('stroke', 'none')
		  .attr('fill', 'black')
		  .attr("dy", ".35em") // vertical-align: middle
		  .attr('text-anchor', 'end')
		  .attr('color','black')
		  .text(barLabel);
		// bars
		var barsContainer = chart.append('g')
		  .attr('transform', 'translate(' + barLabelWidth + ',' + (gridLabelHeight + gridChartOffset) + ')'); 
		barsContainer.selectAll("rect").data(sortedData).enter().append("rect")
		  .attr('y', y)
		  .attr('margin-left','0.5em')
		  .attr('height', yScale.rangeBand())
		  .attr('width', function(d) { return x(barValue(d)); })
		
		  .attr('fill', 'steelblue');
		// bar value labels
		barsContainer.selectAll("text").data(sortedData).enter().append("text")
		  .attr("x", function(d) { return x(barValue(d)); })
		  .attr("y", yText)
		  .attr("dx", 3) // padding-left
		  .attr("dy", ".35em") // vertical-align: middle
		  .attr("text-anchor", "start") // text-align: right
		  .attr("fill", "black")
		  .attr("stroke", "none")
		  .text(function(d) { return d3.round(barValue(d), 2); });
		// start line
		barsContainer.append("line")
		  .attr("y1", -gridChartOffset)
		  .attr("y2", yScale.rangeExtent()[1] + gridChartOffset)
		  .style("stroke", "#000");
	*/