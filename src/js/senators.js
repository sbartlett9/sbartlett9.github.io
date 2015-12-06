//global
selected_senator = null;

repub_scale = d3.scale.quantize()
    .range(colorbrewer.Reds[5]);

dem_scale = d3.scale.quantize()
    .range(colorbrewer.Blues[5]);

ind_scale = d3.scale.quantize()
    .range(colorbrewer.Greens[5]);

function init_senators() {
    senatorInfoDiv = d3.select("#senator_info")
        .html(function (d) {
            return "<strong>Name:</strong> <span style='color:red'>" + 'test' + "</span>";
        });

    d3.json('data/senators_with_totals.json', update_senators);
}


//Callback for when data is loaded
function update_senators(rawdata) {
    console.log("senator data load success");
    var min = d3.min(senator_totals.values(), function (d) {
        return d3.sum(d.values());
    }); // var min = 0;
    var max = d3.max(senator_totals.values(), function (d) {
        return d3.sum(d.values());
    });
    var pivot = (max - min) / 2
    domain = [min, pivot, max];
    //domain = [min, max];

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
        var totals = senator_totals.get(d.govtrack_id); //map like "dark": 567890, "light": 345668
        var total = totals ? d3.sum(totals.values()) : 0;
        var age = (new Date("06/12/2015") - new Date(d.birthday))/ (1000 * 3600 * 24 * 365);
        var tenure = (new Date("06/12/2015") - new Date(d.assumed_office))/ (1000 * 3600 * 24 * 365);
        if (totals) {
            var ind_cont = "$ " + formatdollar(totals.get("light"));
            var ies = totals.get("dark");
            ies = (ies === undefined) ? 0 : ies;
            var indep_exp_supporting = "$ " + formatdollar(ies);
            var iei = totals.get("dark indirect");
            iei = (iei === undefined) ? 0 : iei;
            var indep_exp_indirect = "$ " + formatdollar(iei);
        }
        var imgStringBegin = " <img src= Images/";
        var imgLocation = d.govtrack_id + ".jpeg";
        var imgStringEnd = ">";
        var imgURL = imgStringBegin + imgLocation + imgStringEnd;
        var infoPane_html =
            '<div class="col-lg-3">' + imgURL + '</div>' + '<div class="col-lg-9">' + '<div class="row">' + '<span><h2 class="Senator_Name">' + senatorName + '</h2></span>' + '<span><h2 class="Senator_State_Party">' + d.state + ' | ' + d.party + '</h2></span>' + '</div>'

        +'<div class="row contribution-amount">' + '<p class="total_contribution_amount">' + 'Individual Contributions: ' + ind_cont
            + '<br>PAC Expenditures: ' + indep_exp_supporting + '<br> PAC Indirect Expenditures: ' + indep_exp_indirect + '<br/></p>' + '</div>' + '</div>';
        var rect = d3.select(id)
            .style("fill", function () {
                return scale(total);
            })
            .classed("senator", true)
            .on('click', function (d) {
                senatorInfoDiv
                    .transition()
                    .style("visibility", "visible");
                senatorInfoDiv.html(infoPane_html);

            })
            .on("mouseout", function (d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                }

            );
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