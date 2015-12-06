var tm_height = 550;

sen_rect_width = 84.6;
sen_rect_scale = d3.scale.linear().rangeRound([0, sen_rect_width]);

//Gets called when the page is loaded.
function init() {
    var width = 330;
    var margin = {
        top: 1,
        right: 0,
        bottom: 5,
        left: 6
    };

    div = d3.select("#tmap")
        .style("position", "relative")
        .style("top", margin.top + "px");

    treemap = d3.layout.treemap()
        .size([width, tm_height])
        .round(true)
        .sort(function (a, b) {
            return a.value - b.value;
        })
        .sticky(true)
        .value(function (d) {
            return d.values;
        });

    color_scale = d3.scale.ordinal()
        .domain(["light", "dark", "dark indirect"])
        .range(colorbrewer.Greys[3]);

    d3.json('data/light_and_dark_money2.json', update_orgs);

}

//Called when the update button is clicked
function updateClicked() {}

//Callback for when data is loaded
function update_orgs(rawdata) {
    console.log("org load success");
    senator_totals = d3.nest()
        .key(function (d) {
            return d.govtrack_id;
        })
        .key(function (d) {
            return d.type;
        })
        .rollup(function (leaves) {
            return d3.sum(leaves, function (d) {
                return d.Total;
            })
        })
        .map(rawdata, d3.map);

    nested_data = d3.nest()
        .key(function (d) {
            return d.type;
        }).key(function (d) {
            return d.DonorOrganization;
        })
        .rollup(function (leaves) {
            return d3.sum(leaves, function (d) {
                return d.Total;
            })
        }).entries(rawdata.filter(function (d) {
            return d.Total > 50000; //filtering what shows in the treemap after we calculate the senator totals
        }));

    var master_org_list = d3.nest()
        .key(function (d) {
            return d.DonorOrganization;
        })
        .map(rawdata, d3.map);


    var org_tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>" + d.name + ":</strong> <span style='color:red'>" + d.values + "</span>";
        })
        // Create the root node for the treemap
    var root = {};
    root.values = nested_data;
    root.key = "Data";

    root = reSortRoot(root, "Total");

    var nodes = treemap.nodes(root);

    //div.call(org_tip);

    var node = div.datum(root).selectAll(".node")
        .data(nodes)
        .enter().append("div")
        .attr("class", "node")
        .call(position)
        .style("background", function (d) {
            //return d.children ? null : color_scale(master_org_list.get(d.key).type);
            return d.depth == 1 ? color_scale(d.name) : null;
        })
        .text(function (d) {
            return d.children ? null : d.name;
        })
        .on("click", function (d) {
            clearSenatorSelection();
            d.selected = !d.selected;
            if (d.selected) {
                this.style.border = "solid 2px black"; //("border-style", "solid");
                selectSenators(master_org_list.get(d.name));
            }
            if (!d.selected) {
                var div = d3.select('#org_info')
                    .transition()
                    .style("visibility", "collapse");
            }
            var infoPane_html = '<div class="col-lg-10">' + '<div class="row">' + '<span><h2 class="Senator_Name">' + d.name + '</h2></span>' + '<span><div class="row contribution-amount">' + '<p class="total_contribution_amount">' + 'Total Contributions: ' + d.value + '</p>' + '</div>' + '</div>';
            var div = d3.select('#org_info');
            div.transition()
                .style("visibility", "visible");
            div.html(infoPane_html);
        })
        //.on("mouseover", org_tip.show)
        //.on("mouseout", org_tip.hide);

    init_senators();
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

function selectSenators(org) {
    var senators = d3.select('#Layer_1').selectAll('rect').transition().style("opacity", .1);
    sen_rect_scale.domain([0, d3.sum(org, function (d) {
        return d.Total;
    })]);
    org.forEach(function (d) {
        var id = '#id' + d.govtrack_id;
        var lid = '#lid' + d.govtrack_id;
        var sen = master_senators_list.get(d.govtrack_id)[0];
        var scale = getScale(sen);
        var rect = d3.select(id)
            .transition()
            .style("opacity", 1)
            .style("stroke", "black");

        d3.select(lid)
            .transition()
            .attr("width", sen_rect_scale(d.Total))
            .attr("fill", color_scale(d.type))
            .style("opacity", .9);
    });
}

function clearSenatorSelection() {
    var senators = d3.select('#Layer_1')
        .selectAll('rect')
        .transition()
        .style("opacity", 1)
        .style("stroke", "none");

    d3.select('#senate_overlay').selectAll('rect')
        .transition()
        .attr('width', 0)
        .style('opacity', 0);
    //reset tree map selections
    var tmap_nodes = d3.selectAll(".node");
    tmap_nodes.style("border", "solid 1px white");
    tmap_nodes.selected = false;
}

//turns nested data into format needed for treemap
function reSortRoot(root, value_key) {
    //console.log("Calling");
    for (var key in root) {
        if (key == "key") {
            root.name = root.key;
            delete root.key;
        }
        if (key == "values" && root.values.length) {
            //this is because we have a rollup function where values is both the value and the children attribute
            root.children = [];
            for (item in root.values) {
                root.children.push(reSortRoot(root.values[item], value_key));
            }
            delete root.values;
        }
        if (key == value_key) {
            root.value = parseFloat(root[value_key]);
            delete root[value_key];
        }
    }
    return root;
}