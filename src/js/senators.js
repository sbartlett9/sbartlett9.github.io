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
    republicans.sort(function (a, b) {
        return d3.descending(a.total, b.total);
    });
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
        '<div class="col-lg-3">' + '<div class="row">' + portraitImgURL + '</div/>' + '<div class="row">' + stateImgURL + partyImgURL + '</div>' + '</div>' + '<div class="col-lg-9">' + '<div class="row">' + '<span><h2 class="Senator_Name">' + senatorName + '</h2></span>' + '<span><h2 class="Senator_State_Party">' + d.state + ' | ' + d.party + '</h2></span>' + '</div>' + '<div class="row contribution-amount">' + '<p class="total_contribution_amount">' + 'Individual Contributions: ' + ind_cont + '<br>Independent Expenditures: ' + indep_exp_supporting + '<br> Opponent Opposition: ' + indep_exp_indirect + '<br/></p>' + '<p class="total_contribution_amount">' + 'Age:' + age + '</p>' + '<p class="total_contribution_amount">' + 'Tenure:' + tenure + '</p>'


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
    var rec = d3.select('#Layer_1').selectAll("rect").filter(x).attr("style", "stroke: grey; stroke-width: 4");
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
    var ids = ['#lid300002', '#lid300011', '#lid300018', '#lid300019', '#lid300023', '#lid300025', '#lid300027',
 '#lid300030', '#lid300038', '#lid300041', '#lid300043', '#lid300047', '#lid300048', '#lid300052',
 '#lid300055', '#lid300065', '#lid300071', '#lid300072', '#lid300073', '#lid300075', '#lid300076',
  '#lid300078', '#lid300081', '#lid300082', '#lid300083', '#lid300087', '#lid300088', '#lid300089',
   '#lid300093', '#lid300100', '#lid400013', '#lid400034', '#lid400040', '#lid400050', '#lid400054',
    '#lid400061', '#lid400064', '#lid400134', '#lid400194', '#lid400222', '#lid400253', '#lid400272',
     '#lid400284', '#lid400325', '#lid400357', '#lid400408', '#lid400413', '#lid400418', '#lid400432',
      '#lid400546', '#lid402675', '#lid412194', '#lid412200', '#lid412205', '#lid412218', '#lid412223',
       '#lid412242', '#lid412243', '#lid412244', '#lid412246', '#lid412247', '#lid412248', '#lid412251',
        '#lid412269', '#lid412281', '#lid412305', '#lid412321', '#lid412322', '#lid412323', '#lid412325',
         '#lid412330', '#lid412378', '#lid412390', '#lid412391', '#lid412406', '#lid412464', '#lid412471',
          '#lid412490', '#lid412491', '#lid412492', '#lid412493', '#lid412494', '#lid412495', '#lid412496',
           '#lid412507', '#lid412508', '#lid412542', '#lid412545', '#lid412549', '#lid412554', '#lid412556',
            '#lid412573', '#lid412582', '#lid412598', '#lid412665', '#lid412666', '#lid412667', '#lid412668',
             '#lid412669', '#lid412671'];
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
        var seln = d3.selectAll(d);
        console.log(seln);
        seln.classed("foobar", true);
        seln.transition()
            .style("opacity", 1)
            .style("stroke", "#B0B0B0");
    })

}