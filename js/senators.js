//global
var global_senate_data;
var global_senate_data_map;

selected_senator = null;

repub_scale = d3.scale.quantize()
    .range(colorbrewer.Reds[5]);

dem_scale = d3.scale.quantize()
    .range(colorbrewer.Blues[5]);

ind_scale = d3.scale.quantize()
    .range(colorbrewer.Greens[5]);

var init_message = "<h3>Each rectangle represents a senator. Find where the senators are seated via the dropdown list and search bar. Click on rectangle to see senator's information. Adjust the slider to change the treemap view.</h3>";

function init_senators() {
    senatorInfoDiv = d3.select("#senator_info")
        .html(function (d) {
            return init_message;
        })
        .style("line-height", "2em");

    d3.json('data/senators_with_totals.json', update_senators);
}

function updateGlobalSenateData(rawdata) {
    var democrats = [];
    var republicans = [];
    global_senate_data = [];
    global_senate_data_map = new Map();
    rawdata.forEach(function (d) {
        var data = {};
        var totals = senator_totals.get(d.govtrack_id); //map like "dark": 567890, "light": 345668
        data.id = d.govtrack_id;
        data.total = totals ? d3.sum(totals.values()) : 0;
        data.total_range = data.total;
        data.name = d.first_name + " " + d.last_name;
        data.initials = d.first_name[0] + d.last_name[0];
        data.state = d.state;
        data.party = d.party;
        data.indep_contributor = 0;
        data.indep_exp_supporting = 0;
        data.indep_exp_indirect = 0;
        data.org_contribution = 0; //Math.floor(Math.random() * data.total);
        if (totals) {
            var ic = totals.get("light");
            ic = (ic === undefined) ? 0 : ic; //NaN check
            data.indep_contributor = ic;
            var ies = totals.get("dark");
            ies = (ies === undefined) ? 0 : ies;
            data.indep_exp_supporting = ies;
            var iei = totals.get("dark indirect");
            iei = (iei === undefined) ? 0 : iei;
            data.indep_exp_indirect = iei;
            data.total_range = ic + ies + iei;
        }
        if (data.party === "Republican")
            republicans.push(data);
        else
            democrats.push(data);
        global_senate_data_map.set(data.id, data);
    });
    democrats.sort(function (a, b) {
        return d3.descending(a.total, b.total);
    });
    console.log(democrats);
    republicans.sort(function (a, b) {
        return d3.descending(a.total, b.total);
    });
    console.log(republicans);
    global_senate_data = global_senate_data.concat(democrats, republicans);
    console.log(global_senate_data);
    init_chart();
}

function updateGlobalContributions(contributionData) {

}


//Callback for when data is loaded
function update_senators(rawdata) {
    console.log("senator data load success");
    updateGlobalSenateData(rawdata);
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

    //    var tip = d3.tip()
    //        .attr('class', 'd3-tip')
    //        .attr('opacity', .9)
    //        //.offset([-10, 0])
    //        .html(function (d) {
    //            return "<strong>Name:</strong> <span style='color:red'>" + 'test' + "</span>";
    //        });
    rawdata.forEach(function (d) {
        var id = '#id' + d.govtrack_id;
        var scale = getScale(d);
        var totals = senator_totals.get(d.govtrack_id); //map like "dark": 567890, "light": 345668
        var total = totals ? d3.sum(totals.values()) : 0;

        var rect = d3.select(id)
            .style("fill", function () {
                return scale(total);
            })
            .classed("senator", true)
            .on('click', function () {
                senatorInfoDiv
                    .transition()
                    .style("visibility", "visible");
                senatorInfoDiv.html(getSenateInfoPaneHTML(d, totals));
                this.selected = !this.selected;
                if (this.selected) {
                    selectSenator(d);
                } else {
                    this.style.stroke = "none";
                    deselectSenator();
                }
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


function selectSenator(sen) {
    //TODO clear any org selections or other senator selections
    //clearOrgSelection();
    clearSenatorSelection();
    //    var senators = d3.select('#Layer_1')
    //        .selectAll('rect')
    //        .style("stroke", "none")
    //        .style("rx", "6px") //what is this for?
    //        .style("ry", "6px");    
    d3.select("#id" + sen.govtrack_id)
        .style("stroke", "#B0B0B0")
        .style("stroke-width", "5px");


    selected_senator = sen;
    updateOrgMap(org_rawdata.filter(function (d) {
        var filter = d3.select("#orgslider")[0][0].value;
        return d.govtrack_id == sen.govtrack_id && d.Total > filter;
    }));
    console.log(sen);

}

function deselectSenator() {
    selected_senator = null;
    resetOrgMap();
}

function getSenateInfoPaneHTML(d, totals) {
    var senatorName = d.first_name + " " + d.last_name;
    var age = ((new Date("06/12/2015") - new Date(d.birthday)) / (1000 * 3600 * 24 * 365)).toFixed(0);
    var tenure = ((new Date("06/12/2015") - new Date(d.assumed_office)) / (1000 * 3600 * 24 * 365)).toFixed(1);
    if (totals) {
        var ic = totals.get("light");
        ic = (ic === undefined) ? 0 : ic; //NaN check
        var ind_cont = "$ " + formatdollar(ic);
        var ies = totals.get("dark");
        ies = (ies === undefined) ? 0 : ies;
        var indep_exp_supporting = "$ " + formatdollar(ies);
        var iei = totals.get("dark indirect");
        iei = (iei === undefined) ? 0 : iei;
        var indep_exp_indirect = "$ " + formatdollar(iei);
    }
    var portraitImgURL = ' <img src= "img/portraits/' + d.govtrack_id + '.jpeg' + '">';
    var stateImgURL = ' <div class="icon state"><img title="' + d.state + '" src="img/states/' + d.state + '.png"></div>';
    var partyImgURL = ' <div class="icon party';
    if (d.party === "Republican") {
        partyImgURL += ' republican"><img title="Republican" src="img/party/color/elephant';
    } else if (d.party === "Democrat") {
        partyImgURL += ' democrat"><img title="Democrat" src="img/party/color/donkey';
    } else if (d.party === "Independent") {
        partyImgURL += ' independent"><img title="Independent" src="img/party/color/moose';
    }
    partyImgURL += '.png"></div>';

    var imgStringBegin = " <img src= img/portraits/";
    var imgLocation = d.govtrack_id + ".jpeg";
    var imgStringEnd = ">";
    var imgURL = imgStringBegin + imgLocation + imgStringEnd;

    var senate_info_html =
        '<div class="col-lg-3">' + '<div class="row">' + portraitImgURL + '</div/>' + '<div class="row">' + stateImgURL + partyImgURL + '</div>' + '</div>' + '<div class="col-lg-9">' + '<div class="row">' + '<span><h2 class="senate_info_header Senator_Name">' + senatorName + '</h2></span>' + '<span><h2 class="senate_info_header Senator_State_Party">' + d.state + ' | ' + d.party + '</h2></span>' + '</div>' + '<div class="row  contribution-amount">' + '<p class="total_contribution_amount">' + 'Individual Contributions: ' + ind_cont + '<br>Independent Expenditures: ' + indep_exp_supporting + '<br> Opponent Opposition: ' + indep_exp_indirect + '<br/></p>' + '<p class="total_contribution_amount">' + 'Age:' + age + '</p>' + '<p class="total_contribution_amount">' + 'Tenure:' + tenure + '</p>'


    +'</div>' + '</div>'


    ;

    return senate_info_html;

}

function getScale(sen) {
    if (sen.party == 'Republican') {
        return repub_scale;
    } else if (sen.party == 'Democrat') {
        return dem_scale;
    }
    return ind_scale;
}


function stateseln(State) {
    clstat();
    //console.log(State);
    var x = "." + State
        //console.log(x);
    var rec = d3.select('#Layer_1').selectAll("rect").filter(x).transition().style("stroke", "grey").style("stroke-width", "4");
    rec.classed('foobar', true)
        //console.log(rec)

}

function clstat() {
    console.log("Y")
    var doo = d3.select('#Layer_1').selectAll("rect").filter(".foobar")
    doo.classed('foobar', false)
    console.log(doo)
    doo.style("stroke", "none")
}

function srch() {
    clstat();
    var srch = document.getElementById("schbx").value
    console.log(srch);
    var srch = new RegExp(srch, 'i')
    console.log(srch)
    var sens = ['Lamar Alexander', 'Barbara Boxer', 'Maria Cantwell', 'Thomas Carper', 'Thad Cochran',
 'Susan Collins', 'John Cornyn', 'Michael Crapo', 'Richard Durbin', 'Michael Enzi',
  'Dianne Feinstein', 'Lindsey Graham', 'Charles Grassley', 'Orrin Hatch', 'James Inhofe',
   'Patrick Leahy', 'John McCain', 'Mitch McConnell', 'Barbara Mikulski', 'Lisa Murkowski',
   'Patty Murray', 'Bill Nelson', 'John Reed', 'Harry Reid', 'Pat Roberts', 'Charles Schumer',
   'Jefferson Sessions', 'Richard Shelby', 'Debbie Stabenow', 'Ron Wyden', 'Tammy Baldwin',
   'Roy Blunt', 'John Boozman', 'Sherrod Brown', 'Richard Burr', 'Shelley Capito',
    'Benjamin Cardin', 'Jeff Flake', 'John Isakson', 'Mark Kirk', 'Edward Markey',
    'Robert MenÃƒÂ©ndez', 'Jerry Moran', 'Robert Portman', 'Bernard Sanders',
    'Patrick Toomey', 'Tom Udall', 'David Vitter', 'Roger Wicker', 'John Thune',
     'Daniel Coats', 'Christopher Murphy', 'Mazie Hirono', 'Joe Donnelly', 'Dean Heller',
     'Kirsten Gillibrand', 'Amy Klobuchar', 'Claire McCaskill', 'Jon Tester', 'Robert Casey',
     'Sheldon Whitehouse', 'Bob Corker', 'John Barrasso', 'Bill Cassidy', 'Martin Heinrich',
     'Gary Peters', 'Mark Warner', 'James Risch', 'Jeanne Shaheen', 'Jeff Merkley', 'Michael Bennet',
      'Alan Franken', 'Chris Coons', 'Joe Manchin', 'Cory Gardner', 'James Lankford', 'Tim Scott',
      'Richard Blumenthal', 'Marco Rubio', 'Rand Paul', 'Kelly Ayotte', 'John Hoeven', 'Mike Lee',
       'Ron Johnson', 'Brian Schatz', 'Tom Cotton', 'Elizabeth Warren', 'Angus King', 'Steve Daines',
        'Heidi Heitkamp', 'Deb Fischer', 'Ted Cruz', 'Timothy Kaine', 'Cory Booker', 'Dan Sullivan',
         'David Perdue', 'Joni Ernst', 'Thom Tillis', 'Mike Rounds', 'Benjamin Sasse'];
    var ids = ['#id300002', '#id300011', '#id300018', '#id300019', '#id300023', '#id300025', '#id300027',
 '#id300030', '#id300038', '#id300041', '#id300043', '#id300047', '#id300048', '#id300052',
 '#id300055', '#id300065', '#id300071', '#id300072', '#id300073', '#id300075', '#id300076',
  '#id300078', '#id300081', '#id300082', '#id300083', '#id300087', '#id300088', '#id300089',
   '#id300093', '#id300100', '#id400013', '#id400034', '#id400040', '#id400050', '#id400054',
    '#id400061', '#id400064', '#id400134', '#id400194', '#id400222', '#id400253', '#id400272',
     '#id400284', '#id400325', '#id400357', '#id400408', '#id400413', '#id400418', '#id400432',
      '#id400546', '#id402675', '#id412194', '#id412200', '#id412205', '#id412218', '#id412223',
       '#id412242', '#id412243', '#id412244', '#id412246', '#id412247', '#id412248', '#id412251',
        '#id412269', '#id412281', '#id412305', '#id412321', '#id412322', '#id412323', '#id412325',
         '#id412330', '#id412378', '#id412390', '#id412391', '#id412406', '#id412464', '#id412471',
          '#id412490', '#id412491', '#id412492', '#id412493', '#id412494', '#id412495', '#id412496',
           '#id412507', '#id412508', '#id412542', '#id412545', '#id412549', '#id412554', '#id412556',
            '#id412573', '#id412582', '#id412598', '#id412665', '#id412666', '#id412667', '#id412668',
             '#id412669', '#id412671'];
    var filtered = (function () {
        var filtered = [],
            i = sens.length;
        while (i--) {
            if (srch.test(sens[i])) {
                filtered.push(ids[i]);
            }
        }
        return filtered;
    })();
    console.log(filtered);
    filtered.forEach(function (d) {
        console.log(d)
        var seln = d3.select(d);
        console.log(seln);
        seln.classed("foobar", true);
        seln.transition()
            .style("opacity", 1)
            .style("stroke", "#B0B0B0");
    })

}