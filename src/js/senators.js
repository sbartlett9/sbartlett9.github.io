function init_senators() {
    repub_scale = d3.scale.quantize()
        .range(colorbrewer.Reds[5]);

    dem_scale = d3.scale.quantize()
        .range(colorbrewer.Blues[5]);

    ind_scale = d3.scale.quantize()
        .range(colorbrewer.Greens[5]);

    d3.json('data/senators_with_totals.json', update_senators);
}


//Callback for when data is loaded
function update_senators(rawdata) {
    console.log("senator data load success");

    var min = d3.min(senator_totals.values(), function (d) {
        return d3.sum(d.values());
    });
    var max = d3.max(senator_totals.values(), function (d) {
        return d3.sum(d.values());
    });
    var pivot = (max - min) / 2
    domain = [min, pivot, max];

    repub_scale.domain(domain);

    dem_scale.domain(domain);

    ind_scale.domain(domain);

	var senatorInfoDiv = d3.select("#senator_info")
		.style("border","1px solid black")
		.style("width", "90em")
		.style("height","20em")
		.style("padding", "1em")
		.style("border-radius","1em")
		.style("position","absolute")
		.style("left","10em")
		.style("top","10em")
		.style("fill","blue")
		.html(function (d) {
            return "<strong>Name:</strong> <span style='color:red'>" + 'test' + "</span>";
        });
		
		
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .attr('opacity', .9)
        //.offset([-10, 0])
        .html(function (d) {
            return "<strong>Name:</strong> <span style='color:red'>" + 'test' + "</span>";
        });

    rawdata.forEach(function (d) {
        var id = '#id' + d.govtrack_id;
        var scale = getScale(d);
        var senatorName = d.first_name + " " + d.last_name;
        var totals = senator_totals.get(d.govtrack_id); //map like "dark": 567890, "light": 345668
        var total = d3.sum(totals.values());
        var ind_cont = totals.get("light");
        var indep_exp_supporting = totals.get("dark");
        var indep_exp_indirect = totals.get("dark indirect");

        var imgStringBegin = " <img src= Images/";
        var imgLocation = d.govtrack_id + ".jpeg";
        var imgStringEnd = ">";
        var imgURL = imgStringBegin + imgLocation + imgStringEnd;
        var infoPane_html = imgURL + '<span><h2 class="Senator_Name">' + senatorName + '</h2></span>' 
		+ '<span><h2 class="Senator_State_Party">' + d.state + ' | ' + d.party + '</h2></span>' 
		+ '<span><p class="total_contribution_amount">' + 'Individual Contributions: ' + ind_cont + '<br/>PAC Expenditures: ' + indep_exp_supporting + '<br/> PAC Indirect Expenditures: ' + indep_exp_indirect + '<br/></p></span>';
        var rect = d3.select(id)
            .style("fill", function () {
                return scale(total);
            })
            .classed("senator", true)
            .on('click', function (d) {
               /* div.transition()
                    .duration(200)
                    .style("opacity", .9);
                
				div.html(tip_html)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px")
                    .style("opacity", 1);*/
				
				senatorInfoDiv
					.html(infoPane_html);
					

            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    });

    /*this should work with d3.map, but for some reason it doesn't :( */
    master_senators_list = d3.nest()
        .key(function (d) {
            return d.govtrack_id;
        })
        .map(rawdata, d3.map);


}

function getScale(sen) {
    if (sen.party == 'Republican') {
        return repub_scale;
    } else if (sen.party == 'Democrat') {
        return dem_scale;
    }
    return ind_scale;
}