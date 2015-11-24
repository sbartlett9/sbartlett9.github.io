repub_scale = d3.scale.ordinal()
    .range(colorbrewer.Reds[5]);

dem_scale = d3.scale.ordinal()
    .range(colorbrewer.Blues[5]);

ind_scale = d3.scale.ordinal()
    .range(colorbrewer.Greens[5]);

d3.csv('data/senators_with_totals.csv', update_senators);


//Callback for when data is loaded
function update_senators(rawdata) {
    console.log("senator data load success");
    var domain = d3.extent(rawdata, function (d) {
        return d.total;
    });

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

    rawdata.forEach(function (sen) {
        var id = '#id' + sen.govtrack_id;
        var scale = getScale(sen);
        var rect = d3.select(id)
            .style("fill", function () {
                return scale(sen.total);
            })
            .classed("senator", true)
            .on('mouseover', function (d) {
                var senatorName = sen.first_name + " " + sen.last_name;
                var imgStringBegin = " <img src= img/";
                var imgLocation = sen.govtrack_id + ".jpeg";
                var imgStringEnd = ">";
                var imgURL = imgStringBegin + imgLocation + imgStringEnd;
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(imgURL + '<span><p class="Senator_Name">' + senatorName + '</p></span>' + '<span><p class="Senator_State_Party">' + sen.state + ' | ' + sen.party + '</p></span>' + '<span><p class="total_contribution_amount">' + 'Total Amount Received:' + sen.total + '</p></span>' + '<span><p class="top_contributor">' + 'Top Contributors:' + '</p></span>')
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

    master_senators_list = d3.map(rawdata, function (d) {
        return d.govtrack_id;
    });

}

function getScale(sen) {
    if (sen.party == 'Republican') {
        return repub_scale;
    } else if (sen.party == 'Democrat') {
        return dem_scale;
    }
    return ind_scale;
}

function selectSenators(org) {
    var senators = d3.select('#Layer_1').selectAll('rect');
    senators.filter(function (d) {});
}