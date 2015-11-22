//Gets called when the page is loaded.
function init() {
    var height = 700;
    var width = 300;
    var margin = {
        top: 2,
        right: 0,
        bottom: 10,
        left: 5
    };

    div = d3.select("#tmap")
        //    .append("div")
        .style("position", "relative");
    //        .style("width", width)
    //        .style("height", height)
    //        .style("top", margin.top + "px");
    //var width = div.width;
    //height = div.height;

    treemap = d3.layout.treemap()
        .size([width, height])
        .sticky(true)
        .value(function (d) {
            return d.values;
        });

    color_scale = d3.scale.category20c();

    d3.csv('data/sample_data_org_aggr.csv', update_orgs);

}

//Called when the update button is clicked
function updateClicked() {}

//Callback for when data is loaded
function update_orgs(rawdata) {
    console.log("org load success");
    nested_data = d3.nest()
        .key(function (d) {
            return d.DonorOrganization;
        })
        .rollup(function (leaves) {
            return d3.sum(leaves, function (d) {
                return d.total;
            })
        })
        .entries(rawdata);

    // Creat the root node for the treemap
    var root = {};
    root.children = nested_data;

    //var nodes = treemap.nodes(root);

    var node = div.datum(root).selectAll(".node")
        .data(treemap.nodes)
        .enter().append("div")
        .attr("class", "node")
        .call(position)
        .style("background", function (d) {
            return d.children ? color_scale(d.key) : null;
        })
        .text(function (d) {
            return d.key;
        });




}

function position() {
    this.style("left", function (d) {
            return d.x + "px";
        })
        .style("top", function (d) {
            return d.y + "px";
        })
        .style("width", function (d) {
            return Math.max(0, d.dx - 1) + "px";
        })
        .style("height", function (d) {
            return Math.max(0, d.dy - 1) + "px";
        });
}