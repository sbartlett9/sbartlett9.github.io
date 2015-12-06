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
        var age = (new Date("06/12/2015") - new Date(d.birthday)) / (1000 * 3600 * 24 * 365);
        var tenure = (new Date("06/12/2015") - new Date(d.assumed_office)) / (1000 * 3600 * 24 * 365);
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
            .on('click', function () {
                senatorInfoDiv
                    .transition()
                    .style("visibility", "visible");
                senatorInfoDiv.html(infoPane_html);
                this.selected = !this.selected;
                if (this.selected) {
                    this.style.stroke = "yellow";
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
    //TODO clear any org selections
    selected_senator = sen;
    updateOrgMap(org_rawdata.filter(function (d) {
        return d.govtrack_id == sen.govtrack_id;
    }));
    console.log(sen);

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
    var rec = d3.select('#Layer_1').selectAll("rect").filter(x).attr("style", "stroke: orangered; stroke-width: 4");
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
    var srch = document.getElementById("schbx").value
    console.log(srch);
    var srch = new RegExp(srch, 'i')
    console.log(srch)
    var sens = ['Lisa Murkowski', 'Dan Sullivan', 'Jefferson Sessions', 'Richard Shelby', 'John Boozman', 'Tom Cotton',
      'Jeff Flake', 'John McCain', 'Dianne Feinstein', 'Barbara Boxer', 'Michael Bennet', 'Cory Gardner', 'Richard Blumenthal',
       'Christopher Murphy', 'Thomas Carper', 'Chris Coons', 'Bill Nelson', 'Marco Rubio', 'John Isakson', 'David Perdue',
        'Mazie Hirono', 'Brian Schatz', 'Charles Grassley', 'Joni Ernst', 'James Risch', 'Michael Crapo', 'Richard Durbin',
         'Mark Kirk', 'Daniel Coats', 'Joe Donnelly', 'Pat Roberts', 'Jerry Moran', 'Mitch McConnell', 'Rand Paul',
          'Bill Cassidy', 'David Vitter', 'Edward Markey', 'Elizabeth Warren', 'Benjamin Cardin', 'Barbara Mikulski',
           'Susan Collins', 'Angus King', 'Debbie Stabenow', 'Gary Peters', 'Amy Klobuchar', 'Alan Franken', 'Claire McCaskill',
            'Roy Blunt', 'Roger Wicker', 'Thad Cochran', 'Jon Tester', 'Steve Daines', 'Richard Burr', 'Thom Tillis',
            'John Hoeven', 'Heidi Heitkamp', 'Deb Fischer', 'Benjamin Sasse', 'Jeanne Shaheen', 'Kelly Ayotte',
             'Robert Menendez', 'Cory Booker', 'Tom Udall', 'Martin Heinrich', 'Harry Reid', 'Dean Heller',
              'Kirsten Gillibrand', 'Charles Schumer', 'Sherrod Brown', 'Robert Portman', 'James Inhofe',
               'James Lankford', 'Jeff Merkley', 'Ron Wyden', 'Robert Casey', 'Patrick Toomey', 'Sheldon Whitehouse',
                'John Reed', 'Lindsey Graham', 'Tim Scott', 'John Thune', 'Mike Rounds', 'Bob Corker', 'Lamar Alexander',
                 'John Cornyn', 'Ted Cruz', 'Orrin Hatch', 'Mike Lee', 'Mark Warner', 'Timothy Kaine', 'Bernard Sanders',
                  'Patrick Leahy', 'Maria Cantwell', 'Patty Murray', 'Tammy Baldwin', 'Ron Johnson', 'Joe Manchin',
                  'Shelley Capito', 'John Barrasso', 'Michael Enzi'];
    var ids = ['#lid300041', '#lid412251', '#lid400061', '#lid412391', '#lid412496', '#lid400013', '#lid300076', '#lid300018', '#lid300065',
 '#lid400357', '#lid412582', '#lid412321', '#lid412495', '#lid300052', '#lid412573', '#lid300027', '#lid300002', '#lid412248',
  '#lid412669', '#lid400546', '#lid412471', '#lid300047', '#lid300081', '#lid412247', '#lid400408', '#lid412246', '#lid300100',
   '#lid412325', '#lid412464', '#lid300055', '#lid400325', '#lid400050', '#lid300087', '#lid412223', '#lid412218', '#lid300082',
    '#lid412281', '#lid400413', '#lid412598', '#lid400272', '#lid412493', '#lid412323', '#lid412671', '#lid412556', '#lid412554',
     '#lid412494', '#lid412668', '#lid400054', '#lid412549', '#lid412244', '#lid300023', '#lid400432', '#lid400034', '#lid412243',
      '#lid412378', '#lid412242', '#lid412305', '#lid300093', '#lid412545', '#lid300025', '#lid300073', '#lid400064', '#lid412542',
       '#lid400253', '#lid400418', '#lid412269', '#lid412492', '#lid300072', '#lid400284', '#lid300083', '#lid412205', '#lid402675',
        '#lid400222', '#lid300038', '#lid300030', '#lid412322', '#lid412667', '#lid300048', '#lid412507', '#lid412200', '#lid412666',
         '#lid400194', '#lid412491', '#lid300078', '#lid412390', '#lid300019', '#lid412194', '#lid412490', '#lid412406', '#lid412330',
          '#lid300011', '#lid300043', '#lid300071', '#lid400134', '#lid412508', '#lid400040', '#lid300089', '#lid300088', '#lid412665',
           '#lid300075'];
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
        var seln = d3.select(d).style("stroke", "black");;
        console.log(seln);
        seln.classed("foobar", true);
    })

}