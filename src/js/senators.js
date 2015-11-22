repub_scale = d3.scale.ordinal()
    .range(colorbrewer.Reds[3]);

dem_scale = d3.scale.ordinal()
    .range(colorbrewer.Blues[3]);

ind_scale = d3.scale.ordinal()
    .range(colorbrewer.Purples[3]);

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