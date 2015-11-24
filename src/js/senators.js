var govetrack_id;

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
    //    var data = d3.nest()
    //        .key(function (d) {
    //            return d.party
    //        })
    //        .map(rawdata, d3.map);    
    var domain = d3.extent(rawdata, function (d) {
        return d.total;
    });

    repub_scale.domain(domain);

    dem_scale.domain(domain);

    ind_scale.domain(domain);

    rawdata.forEach(function (sen) {
        var id = '#id' + sen.govtrack_id;
        var scale = getScale(sen);
        var rect = d3.select(id)
            .style("fill", function () {
                return scale(sen.total);
            });

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

var govtrackID = [];
var data = d3.csv('data/senators_with_totals.csv', function (error, data) {

        var senator = d3.select('#Layer_1').selectAll('rect')
            .classed("senator", true)
            .on('mouseover', function (d) {
                //console.log("moused over");
                console.log("id for this element is:" + " " + this.id);
                var temp_id = this.id.replace(/\D/g, '');
                data.forEach(function (e) {
                    govtrackID.push(e.govtrack_id);
                    var senatorName = e.first_name + " " + e.last_name;
                    var rect = d3.select('id' + govtrackID[e]);
                    //console.log("govtrackID is" + " " + govtrackID + " " + senatorName);   
                    if (temp_id == e.govtrack_id) {
                        console.log('match');
                        //image URL	
                        var imgStringBegin = " <img src= img/";
                        var imgLocation = e.govtrack_id + ".jpeg";
                        var imgStringEnd = ">";
                        var imgURL = imgStringBegin + imgLocation + imgStringEnd;
                        //console.log(imgURL);
                        govtrack_id = e.govtrack_id;
                        console.log(govtrack_id);







                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html(imgURL + '<span><p class="Senator_Name">' + e.first_name + ' ' + e.last_name + '</p></span>' + '<span><p class="Senator_State_Party">' + e.state + ' | ' + e.party + '</p></span>' + '<span><p class="total_contribution_amount">' + 'Total Amount Received:' + e.total + '</p></span>' + '<span><p class="top_contributor">' + 'Top Contributors:' + '</p></span>')
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY) + "px")
                            .style("opacity", 1);

                    } //if temp_id == e.govtrack_id   
                }); //data.forEach
                //console.log(div);

            })

        .on("mouseout", function (d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        }); //on mouseout

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .attr('opacity', .9)
            //.offset([-10, 0])
            .html(function (d) {
                return "<strong>Name:</strong> <span style='color:red'>" + 'test' + "</span>";
            })

        // senator.call(tip);
        //senator
        // .on('mouseover',tip.show)





    }) //data = d3.csv