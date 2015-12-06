function senatorListCtrl($scope) {
  $scope.senators = [
  {
    "name":"Benjamin Sasse",
    "state":"NE",
    "term_year":0.9,
    "govtrack_id":"412671"
  },
  {
    "name":"Mike Rounds",
    "state":"SD",
    "term_year":0.9,
    "govtrack_id":"412669"
  },
  {
    "name":"Thom Tillis",
    "state":"NC",
    "term_year":0.9,
    "govtrack_id":"412668"
  },
  {
    "name":"Joni Ernst",
    "state":"IA",
    "term_year":0.9,
    "govtrack_id":"412667"
  },
  {
    "name":"David Perdue",
    "state":"GA",
    "term_year":0.9,
    "govtrack_id":"412666"
  },
  {
    "name":"Dan Sullivan",
    "state":"AK",
    "term_year":0.9,
    "govtrack_id":"412665"
  },
  {
    "name":"Cory Booker",
    "state":"NJ",
    "term_year":0.9,
    "govtrack_id":"412598"
  },
  {
    "name":"Timothy Kaine",
    "state":"VA",
    "term_year":2.9,
    "govtrack_id":"412582"
  },
  {
    "name":"Ted Cruz",
    "state":"TX",
    "term_year":2.9,
    "govtrack_id":"412573"
  },
  {
    "name":"Deb Fischer",
    "state":"NE",
    "term_year":2.9,
    "govtrack_id":"412556"
  },
  {
    "name":"Heidi Heitkamp",
    "state":"ND",
    "term_year":2.9,
    "govtrack_id":"412554"
  },
  {
    "name":"Steve Daines",
    "state":"MT",
    "term_year":0.9,
    "govtrack_id":"412549"
  },
  {
    "name":"Angus King",
    "state":"ME",
    "term_year":2.9,
    "govtrack_id":"412545"
  },
  {
    "name":"Elizabeth Warren",
    "state":"MA",
    "term_year":2.9,
    "govtrack_id":"412542"
  },
  {
    "name":"Tom Cotton",
    "state":"AR",
    "term_year":0.9,
    "govtrack_id":"412508"
  },
  {
    "name":"Brian Schatz",
    "state":"HI",
    "term_year":0.9,
    "govtrack_id":"412507"
  },
  {
    "name":"Dean Heller",
    "state":"NV",
    "term_year":2.9,
    "govtrack_id":"412218"
  },
  {
    "name":"Ron Wyden",
    "state":"OR",
    "term_year":4.9,
    "govtrack_id":"300100"
  },
  {
    "name":"David Vitter",
    "state":"LA",
    "term_year":4.9,
    "govtrack_id":"400418"
  },
  {
    "name":"Patrick Toomey",
    "state":"PA",
    "term_year":4.9,
    "govtrack_id":"400408"
  },
  {
    "name":"John Thune",
    "state":"SD",
    "term_year":4.9,
    "govtrack_id":"400546"
  },
  {
    "name":"Richard Shelby",
    "state":"AL",
    "term_year":4.9,
    "govtrack_id":"300089"
  },
  {
    "name":"Tim Scott",
    "state":"SC",
    "term_year":0.9,
    "govtrack_id":"412471"
  },
  {
    "name":"Charles Schumer",
    "state":"NY",
    "term_year":4.9,
    "govtrack_id":"300087"
  },
  {
    "name":"Marco Rubio",
    "state":"FL",
    "term_year":4.9,
    "govtrack_id":"412491"
  },
  {
    "name":"Harry Reid",
    "state":"NV",
    "term_year":4.9,
    "govtrack_id":"300082"
  },
  {
    "name":"Robert Portman",
    "state":"OH",
    "term_year":4.9,
    "govtrack_id":"400325"
  },
  {
    "name":"Gary Peters",
    "state":"MI",
    "term_year":0.9,
    "govtrack_id":"412305"
  },
  {
    "name":"Rand Paul",
    "state":"KY",
    "term_year":4.9,
    "govtrack_id":"412492"
  },
  {
    "name":"Patty Murray",
    "state":"WA",
    "term_year":4.9,
    "govtrack_id":"300076"
  },
  {
    "name":"Christopher Murphy",
    "state":"CT",
    "term_year":2.9,
    "govtrack_id":"412194"
  },
  {
    "name":"Lisa Murkowski",
    "state":"AK",
    "term_year":4.9,
    "govtrack_id":"300075"
  },
  {
    "name":"Jerry Moran",
    "state":"KS",
    "term_year":4.9,
    "govtrack_id":"400284"
  },
  {
    "name":"Barbara Mikulski",
    "state":"MD",
    "term_year":4.9,
    "govtrack_id":"300073"
  },
  {
    "name":"John McCain",
    "state":"AZ",
    "term_year":4.9,
    "govtrack_id":"300071"
  },
  {
    "name":"Edward Markey",
    "state":"MA",
    "term_year":0.9,
    "govtrack_id":"400253"
  },
  {
    "name":"Mike Lee",
    "state":"UT",
    "term_year":4.9,
    "govtrack_id":"412495"
  },
  {
    "name":"Patrick Leahy",
    "state":"VT",
    "term_year":4.9,
    "govtrack_id":"300065"
  },
  {
    "name":"James Lankford",
    "state":"OK",
    "term_year":0.9,
    "govtrack_id":"412464"
  },
  {
    "name":"Mark Kirk",
    "state":"IL",
    "term_year":4.9,
    "govtrack_id":"400222"
  },
  {
    "name":"Ron Johnson",
    "state":"WI",
    "term_year":4.9,
    "govtrack_id":"412496"
  },
  {
    "name":"John Isakson",
    "state":"GA",
    "term_year":4.9,
    "govtrack_id":"400194"
  },
  {
    "name":"John Hoeven",
    "state":"ND",
    "term_year":4.9,
    "govtrack_id":"412494"
  },
  {
    "name":"Mazie Hirono",
    "state":"HI",
    "term_year":2.9,
    "govtrack_id":"412200"
  },
  {
    "name":"Martin Heinrich",
    "state":"NM",
    "term_year":2.9,
    "govtrack_id":"412281"
  },
  {
    "name":"Charles Grassley",
    "state":"IA",
    "term_year":4.9,
    "govtrack_id":"300048"
  },
  {
    "name":"Cory Gardner",
    "state":"CO",
    "term_year":0.9,
    "govtrack_id":"412406"
  },
  {
    "name":"Jeff Flake",
    "state":"AZ",
    "term_year":2.9,
    "govtrack_id":"400134"
  },
  {
    "name":"Joe Donnelly",
    "state":"IN",
    "term_year":2.9,
    "govtrack_id":"412205"
  },
  {
    "name":"Michael Crapo",
    "state":"ID",
    "term_year":4.9,
    "govtrack_id":"300030"
  },
  {
    "name":"Daniel Coats",
    "state":"IN",
    "term_year":4.9,
    "govtrack_id":"402675"
  },
  {
    "name":"Bill Cassidy",
    "state":"LA",
    "term_year":0.9,
    "govtrack_id":"412269"
  },
  {
    "name":"Shelley Capito",
    "state":"WV",
    "term_year":0.9,
    "govtrack_id":"400061"
  },
  {
    "name":"Richard Burr",
    "state":"NC",
    "term_year":4.9,
    "govtrack_id":"400054"
  },
  {
    "name":"Barbara Boxer",
    "state":"CA",
    "term_year":4.9,
    "govtrack_id":"300011"
  },
  {
    "name":"John Boozman",
    "state":"AR",
    "term_year":4.9,
    "govtrack_id":"400040"
  },
  {
    "name":"Roy Blunt",
    "state":"MO",
    "term_year":4.9,
    "govtrack_id":"400034"
  },
  {
    "name":"Richard Blumenthal",
    "state":"CT",
    "term_year":4.9,
    "govtrack_id":"412490"
  },
  {
    "name":"Michael Bennet",
    "state":"CO",
    "term_year":4.9,
    "govtrack_id":"412330"
  },
  {
    "name":"Tammy Baldwin",
    "state":"WI",
    "term_year":2.9,
    "govtrack_id":"400013"
  },
  {
    "name":"Kelly Ayotte",
    "state":"NH",
    "term_year":4.9,
    "govtrack_id":"412493"
  },
  {
    "name":"Joe Manchin",
    "state":"WV",
    "term_year":2.9,
    "govtrack_id":"412391"
  },
  {
    "name":"Chris Coons",
    "state":"DE",
    "term_year":0.9,
    "govtrack_id":"412390"
  },
  {
    "name":"Alan Franken",
    "state":"MN",
    "term_year":0.9,
    "govtrack_id":"412378"
  },
  {
    "name":"Kirsten Gillibrand",
    "state":"NY",
    "term_year":2.9,
    "govtrack_id":"412223"
  },
  {
    "name":"Mark Warner",
    "state":"VA",
    "term_year":0.9,
    "govtrack_id":"412321"
  },
  {
    "name":"Tom Udall",
    "state":"NM",
    "term_year":0.9,
    "govtrack_id":"400413"
  },
  {
    "name":"Jeanne Shaheen",
    "state":"NH",
    "term_year":0.9,
    "govtrack_id":"412323"
  },
  {
    "name":"Jefferson Sessions",
    "state":"AL",
    "term_year":0.9,
    "govtrack_id":"300088"
  },
  {
    "name":"Pat Roberts",
    "state":"KS",
    "term_year":0.9,
    "govtrack_id":"300083"
  },
  {
    "name":"James Risch",
    "state":"ID",
    "term_year":0.9,
    "govtrack_id":"412322"
  },
  {
    "name":"John Reed",
    "state":"RI",
    "term_year":0.9,
    "govtrack_id":"300081"
  },
  {
    "name":"Jeff Merkley",
    "state":"OR",
    "term_year":0.9,
    "govtrack_id":"412325"
  },
  {
    "name":"Mitch McConnell",
    "state":"KY",
    "term_year":0.9,
    "govtrack_id":"300072"
  },
  {
    "name":"James Inhofe",
    "state":"OK",
    "term_year":0.9,
    "govtrack_id":"300055"
  },
  {
    "name":"Lindsey Graham",
    "state":"SC",
    "term_year":0.9,
    "govtrack_id":"300047"
  },
  {
    "name":"Michael Enzi",
    "state":"WY",
    "term_year":0.9,
    "govtrack_id":"300041"
  },
  {
    "name":"Richard Durbin",
    "state":"IL",
    "term_year":0.9,
    "govtrack_id":"300038"
  },
  {
    "name":"John Cornyn",
    "state":"TX",
    "term_year":0.9,
    "govtrack_id":"300027"
  },
  {
    "name":"Susan Collins",
    "state":"ME",
    "term_year":0.9,
    "govtrack_id":"300025"
  },
  {
    "name":"Thad Cochran",
    "state":"MS",
    "term_year":0.9,
    "govtrack_id":"300023"
  },
  {
    "name":"Lamar Alexander",
    "state":"TN",
    "term_year":0.9,
    "govtrack_id":"300002"
  },
  {
    "name":"Roger Wicker",
    "state":"MS",
    "term_year":2.9,
    "govtrack_id":"400432"
  },
  {
    "name":"John Barrasso",
    "state":"WY",
    "term_year":2.9,
    "govtrack_id":"412251"
  },
  {
    "name":"Sheldon Whitehouse",
    "state":"RI",
    "term_year":2.9,
    "govtrack_id":"412247"
  },
  {
    "name":"Jon Tester",
    "state":"MT",
    "term_year":2.9,
    "govtrack_id":"412244"
  },
  {
    "name":"Debbie Stabenow",
    "state":"MI",
    "term_year":2.9,
    "govtrack_id":"300093"
  },
  {
    "name":"Bernard Sanders",
    "state":"VT",
    "term_year":2.9,
    "govtrack_id":"400357"
  },
  {
    "name":"Bill Nelson",
    "state":"FL",
    "term_year":2.9,
    "govtrack_id":"300078"
  },
  {
    "name":"Robert MenÃ©ndez",
    "state":"NJ",
    "term_year":2.9,
    "govtrack_id":"400272"
  },
  {
    "name":"Claire McCaskill",
    "state":"MO",
    "term_year":2.9,
    "govtrack_id":"412243"
  },
  {
    "name":"Amy Klobuchar",
    "state":"MN",
    "term_year":2.9,
    "govtrack_id":"412242"
  },
  {
    "name":"Orrin Hatch",
    "state":"UT",
    "term_year":2.9,
    "govtrack_id":"300052"
  },
  {
    "name":"Dianne Feinstein",
    "state":"CA",
    "term_year":2.9,
    "govtrack_id":"300043"
  },
  {
    "name":"Bob Corker",
    "state":"TN",
    "term_year":2.9,
    "govtrack_id":"412248"
  },
  {
    "name":"Robert Casey",
    "state":"PA",
    "term_year":2.9,
    "govtrack_id":"412246"
  },
  {
    "name":"Thomas Carper",
    "state":"DE",
    "term_year":2.9,
    "govtrack_id":"300019"
  },
  {
    "name":"Benjamin Cardin",
    "state":"MD",
    "term_year":2.9,
    "govtrack_id":"400064"
  },
  {
    "name":"Maria Cantwell",
    "state":"WA",
    "term_year":2.9,
    "govtrack_id":"300018"
  },
  {
    "name":"Sherrod Brown",
    "state":"OH",
    "term_year":2.9,
    "govtrack_id":"400050"
  }
];
$scope.orderList = "name";
}