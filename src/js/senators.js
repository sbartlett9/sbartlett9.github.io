//Gets called when the page is loaded.
function init() {

    repub_scale = d3.scale.ordinal()
        .range(colorbrewer.Reds[4]);

    dem_scale = d3.scale.ordinal()
        .range(colorbrewer.Blues[4]);

    d3.csv('data/senator_individual_totals.csv', update);

}

//Callback for when data is loaded
function update(rawdata) {
    console.log("success");
    var data = d3.nest()
        .key(function (d) {
            return d.party
        })
        .map(rawdata, d3.map);

    repub_scale.domain(data.get('Republican'), function (d) {
        return d.total;
    });

    dem_scale.domain(data.get('Democrat'), function (d) {
        return d.total;
    });

    rawdata.forEach(function (sen) {
        var id = '#id' + sen.govtrack_id;
        var rect = d3.select(id)
            .style("fill", function () {
                return sen.party == 'Republican' ? repub_scale(sen.total) : dem_scale(sen.total);
            });

    });


}