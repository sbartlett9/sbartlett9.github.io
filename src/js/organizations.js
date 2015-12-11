var tm_height = 600;

sen_rect_width = 84.6;
sen_rect_scale = d3.scale.linear().rangeRound([0, sen_rect_width]);

selected_org = null;
var formatdollar = d3.format("0,000"); //put this here because this file gets loaded first


//Gets called when the page is loaded.
function init() {
    var width = 440;
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
        .sticky(false)
        .value(function (d) {
            return d.values;
        });

    color_scale = d3.scale.ordinal()
        .domain(["light", "dark", "dark indirect"])
        .range(colorbrewer.Greens[3]);


    d3.json('data/light_and_dark_money2.json', function (data) {
        //prefilter here
        org_rawdata = data;

        var slider = d3.select("#orgslider");
        slider.attr("max", d3.max(org_rawdata, function (d) {
            return d.Total;
        }));
        update_orgs(org_rawdata.filter(function (d) {
            return d.Total > 50000; //default
        }));
    });

}

//Called when the update button is clicked
function updateMoneyRange(value) {
    //   update_orgs(org_rawdata.filter(function (d) {
    console.log("updating orgs");
    d3.select(".slider_value").text("$ " + formatdollar(value));
    updateOrgMap(org_rawdata.filter(function (d) {
        return d.Total > value;
    }));
}

function resetOrgMap() { //basically an unfilter, resets to filter from slider 
    var filter = d3.select("#orgslider")[0][0].value;
    updateOrgMap(org_rawdata.filter(function (d) {
        return d.Total > filter;
    }));
}

function updateOrgMap(flatdata) {
    var nested_data = d3.nest()
        .key(function (d) {
            return d.DonorOrganization;
        })
        .key(function (d) {
            return d.type;
        })
        .rollup(function (leaves) {
            return d3.sum(leaves, function (d) {
                return d.Total;
            })
        }).entries(flatdata);

    master_org_list = d3.nest()
        .key(function (d) {
            return d.DonorOrganization;
        })
        .map(flatdata, d3.map);


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

    nodes = treemap.nodes(root);

    //div.call(org_tip);

    var node = div.datum(root).selectAll(".node")
        .data(nodes);
    node.exit().remove();
    node.enter().append("div")
        .attr("class", "node");
    node.style("background", function (d) {
            //return d.children ? null : color_scale(master_org_list.get(d.key).type);
            return d.depth == 2 ? color_scale(d.name) : null;
        })
        .style("z-index", function (d) {
            return d.depth == 1 ? 20 : 0;
        })
        .style("border-width", function (d) {
            return d.depth == 1 ? "3px" : "1px";
        })
        .style("line-height", "0.9em")
        .attr("id", function (d) {
            return d.depth == 1 ? nameToId(d.name) : "";
        })
        .attr("title", function (d) {
            return d.depth == 1 ? d.name + ': $' + formatdollar(d.value) : null;
        }).text(function (d) {
            return d.children ? d.name : null
        })
        .on("click", function (d) {
            if (!d.selected) {
                clearSenatorSelection();
                clearOrgSelection()
                selected_org = d;
                d.selected = true;
                //this.style.border = "solid 4px yellow"; //("border-style", "solid");
                if (selected_senator) {
                    //the data is filtered, clear it
                    deselectSenator();
                }
                selectOrg();

                //selectSenators(master_org_list.get(d.name));
            } else { //deselection
                clearSenatorSelection();
                clearOrgSelection()
            }
        });

    node.attr("selected", function (d) {
            if (selected_org && selected_org.name == d.name) {
                return true;
            }
            return false;
        })
        .transition()
        .duration(1000)
        .call(position);


    //    if (selected_org) {
    //        selectOrg();
    //    }
}

//Callback for when data is loaded
function update_orgs(flatdata) {
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
        .map(flatdata, d3.map);

    init_senators();
    updateOrgMap(flatdata);
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
    var senate_org_map = new Map();
    var senators = d3.select('#Layer_1').selectAll('rect').transition().style("opacity", .2);
    //    var tip = d3.tip()
    //        .attr('class', 'd3-tip')
    //        .offset([-10, 0])
    //        .html(function (d) {
    //            return "<strong>Frequency:</strong> <span style='color:red'>" + d.total + "</span>";
    //        })//    sen_rect_scale.domain([0, d3.sum(org, function (d) {
    //        return d.Total;
    //    })]);    
    org.forEach(function (d) {
        var id = '#id' + d.govtrack_id;
        //var lid = '#lid' + d.govtrack_id;
        var sen = master_senators_list.get(d.govtrack_id)[0];
        var scale = getScale(sen);
        var rect = d3.select(id);
        senate_org_map.set(d.govtrack_id, d.Total);
        rect.transition()
            .style("opacity", 1)
            .style("stroke", "gray")
            .style("stroke-width", "3px");
        //        rect.on('mouseover', function (d) {
        //                //TODO show hover tip with d.total
        //            })
        //            .on("mouseout", function (d) {
        //                //TODO hide/destroy ttip
        //            });        rect.call(tip);
        //        d3.select(lid)
        //            .transition()
        //            .attr("width", sen_rect_scale(d.Total))
        //            .attr("fill", function () {
        //                return color_scale(d.type);
        //            })
        //            .style("opacity", .9);    
    });
    updateSenateOrganizationContributionValues(senate_org_map);
}

function clearOrgSelection() {
    nodes.forEach(function (d) {
        d.selected = false;
    });
    var tmap_nodes = d3.selectAll(".node");
    tmap_nodes.style("border", "solid 1px white");
    tmap_nodes.selected = false;
    clearSenateOrganizationContributionValues();
}

function clearSenatorSelection() {
    d3.select('#Layer_1').selectAll('rect')
        //.transition()
        .style('opacity', 1)
        .style('stroke', 'none');
    //reset tree map selections
}

function selectOrg() {
    var node = d3.select("#" + nameToId(selected_org.name));
    node.style("border", "solid 4px gray");
    selectSenators(master_org_list.get(selected_org.name));
}

function nameToId(name) {
    var newString = name.replace(/[^A-Z0-9]/ig, "");
    return "_" + newString.toLowerCase();
}


//turns nested data into format needed for treemap
function reSortRoot(root, value_key) {
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