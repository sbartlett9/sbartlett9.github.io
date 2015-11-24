var govtrck_id_org;
var tm_height = 600;

//Gets called when the page is loaded.
function init() {
    var width = 300;
    var margin = {
        top: 1,
        right: 0,
        bottom: 10,
        left: 6
    };

    div = d3.select("#tmap")
        .style("position", "relative")
        .style("top", margin.top + "px");

    treemap = d3.layout.treemap()
        .size([width, tm_height])
        .sort(function (a, b) {
            return a.value - b.value;
        })
        .sticky(true)
        .value(function (d) {
            return d.values;
        });

    color_scale = d3.scale.category20c();

    d3.json('data/org_contributions_over_halfmillion.json', update_orgs);

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
                return d.Total;
            })
        })
        .entries(rawdata);

    // Creat the root node for the treemap
    var root = {};
    root.children = nested_data;

    var nodes = treemap.nodes(root);

    var node = div.datum(root).selectAll(".node")
        .data(nodes)
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