repub_scale = d3.scale.quantize()
    .range(colorbrewer.Reds[3]);

dem_scale = d3.scale.quantize()
    .range(colorbrewer.Blues[3]);

ind_scale = d3.scale.quantize()
    .range(colorbrewer.Greens[3]);

d3.json('data/senators_with_totals.json', update_senators);


//Callback for when data is loaded
function update_senators(rawdata) {
    console.log("senator data load success");
    //    var domain = d3.extent(rawdata, function (d) {
    //        return d.total;
    //    });
    var min = d3.min(rawdata, function (d) {
        return d.total;
    });
    var max = d3.max(rawdata, function (d) {
        return d.total;
    });
    var pivot = (max - min) / 2
    domain = [min, pivot, max];

    repub_scale.domain(domain);

    dem_scale.domain(domain);

    ind_scale.domain(domain);

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
        var imgStringBegin = " <img src= img/";
        var imgLocation = d.govtrack_id + ".jpeg";
        var imgStringEnd = ">";
        var imgURL = imgStringBegin + imgLocation + imgStringEnd;
        var tip_html = imgURL + '<span><p class="Senator_Name">' + senatorName + '</p></span>' + '<span><p class="Senator_State_Party">' + d.state + ' | ' + d.party + '</p></span>' + '<span><p class="total_contribution_amount">' + 'Total Amount Received:' + d.total + '</p></span>' + '<span><p class="top_contributor">' + 'Top Contributors:' + '</p></span>'
        var rect = d3.select(id)
            .style("fill", function () {
                return scale(d.total);
            })
            .classed("senator", true)
            .on('mouseover', function (d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(tip_html)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px")
                    .style("opacity", 1);

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