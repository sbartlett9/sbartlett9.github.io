function senatorListCtrl($scope) {
  $scope.senators = [
  {
    "name":"Benjamin Sasse",
    "state":"NE",
    "term":0.9
  },
  {
    "name":"Mike Rounds",
    "state":"SD",
    "term":0.9
  },
  {
    "name":"Thom Tillis",
    "state":"NC",
    "term":0.9
  },
  {
    "name":"Joni Ernst",
    "state":"IA",
    "term":0.9
  },
  {
    "name":"David Perdue",
    "state":"GA",
    "term":0.9
  },
  {
    "name":"Dan Sullivan",
    "state":"AK",
    "term":0.9
  },
  {
    "name":"Cory Booker",
    "state":"NJ",
    "term":0.9
  },
  {
    "name":"Timothy Kaine",
    "state":"VA",
    "term":2.9
  },
  {
    "name":"Ted Cruz",
    "state":"TX",
    "term":2.9
  },
  {
    "name":"Deb Fischer",
    "state":"NE",
    "term":2.9
  },
  {
    "name":"Heidi Heitkamp",
    "state":"ND",
    "term":2.9
  },
  {
    "name":"Steve Daines",
    "state":"MT",
    "term":0.9
  },
  {
    "name":"Angus King",
    "state":"ME",
    "term":2.9
  },
  {
    "name":"Elizabeth Warren",
    "state":"MA",
    "term":2.9
  },
  {
    "name":"Tom Cotton",
    "state":"AR",
    "term":0.9
  },
  {
    "name":"Brian Schatz",
    "state":"HI",
    "term":0.9
  },
  {
    "name":"Dean Heller",
    "state":"NV",
    "term":2.9
  },
  {
    "name":"Ron Wyden",
    "state":"OR",
    "term":4.9
  },
  {
    "name":"David Vitter",
    "state":"LA",
    "term":4.9
  },
  {
    "name":"Patrick Toomey",
    "state":"PA",
    "term":4.9
  },
  {
    "name":"John Thune",
    "state":"SD",
    "term":4.9
  },
  {
    "name":"Richard Shelby",
    "state":"AL",
    "term":4.9
  },
  {
    "name":"Tim Scott",
    "state":"SC",
    "term":0.9
  },
  {
    "name":"Charles Schumer",
    "state":"NY",
    "term":4.9
  },
  {
    "name":"Marco Rubio",
    "state":"FL",
    "term":4.9
  },
  {
    "name":"Harry Reid",
    "state":"NV",
    "term":4.9
  },
  {
    "name":"Robert Portman",
    "state":"OH",
    "term":4.9
  },
  {
    "name":"Gary Peters",
    "state":"MI",
    "term":0.9
  },
  {
    "name":"Rand Paul",
    "state":"KY",
    "term":4.9
  },
  {
    "name":"Patty Murray",
    "state":"WA",
    "term":4.9
  },
  {
    "name":"Christopher Murphy",
    "state":"CT",
    "term":2.9
  },
  {
    "name":"Lisa Murkowski",
    "state":"AK",
    "term":4.9
  },
  {
    "name":"Jerry Moran",
    "state":"KS",
    "term":4.9
  },
  {
    "name":"Barbara Mikulski",
    "state":"MD",
    "term":4.9
  },
  {
    "name":"John McCain",
    "state":"AZ",
    "term":4.9
  },
  {
    "name":"Edward Markey",
    "state":"MA",
    "term":0.9
  },
  {
    "name":"Mike Lee",
    "state":"UT",
    "term":4.9
  },
  {
    "name":"Patrick Leahy",
    "state":"VT",
    "term":4.9
  },
  {
    "name":"James Lankford",
    "state":"OK",
    "term":0.9
  },
  {
    "name":"Mark Kirk",
    "state":"IL",
    "term":4.9
  },
  {
    "name":"Ron Johnson",
    "state":"WI",
    "term":4.9
  },
  {
    "name":"John Isakson",
    "state":"GA",
    "term":4.9
  },
  {
    "name":"John Hoeven",
    "state":"ND",
    "term":4.9
  },
  {
    "name":"Mazie Hirono",
    "state":"HI",
    "term":2.9
  },
  {
    "name":"Martin Heinrich",
    "state":"NM",
    "term":2.9
  },
  {
    "name":"Charles Grassley",
    "state":"IA",
    "term":4.9
  },
  {
    "name":"Cory Gardner",
    "state":"CO",
    "term":0.9
  },
  {
    "name":"Jeff Flake",
    "state":"AZ",
    "term":2.9
  },
  {
    "name":"Joe Donnelly",
    "state":"IN",
    "term":2.9
  },
  {
    "name":"Michael Crapo",
    "state":"ID",
    "term":4.9
  },
  {
    "name":"Daniel Coats",
    "state":"IN",
    "term":4.9
  },
  {
    "name":"Bill Cassidy",
    "state":"LA",
    "term":0.9
  },
  {
    "name":"Shelley Capito",
    "state":"WV",
    "term":0.9
  },
  {
    "name":"Richard Burr",
    "state":"NC",
    "term":4.9
  },
  {
    "name":"Barbara Boxer",
    "state":"CA",
    "term":4.9
  },
  {
    "name":"John Boozman",
    "state":"AR",
    "term":4.9
  },
  {
    "name":"Roy Blunt",
    "state":"MO",
    "term":4.9
  },
  {
    "name":"Richard Blumenthal",
    "state":"CT",
    "term":4.9
  },
  {
    "name":"Michael Bennet",
    "state":"CO",
    "term":4.9
  },
  {
    "name":"Tammy Baldwin",
    "state":"WI",
    "term":2.9
  },
  {
    "name":"Kelly Ayotte",
    "state":"NH",
    "term":4.9
  },
  {
    "name":"Joe Manchin",
    "state":"WV",
    "term":2.9
  },
  {
    "name":"Chris Coons",
    "state":"DE",
    "term":0.9
  },
  {
    "name":"Alan Franken",
    "state":"MN",
    "term":0.9
  },
  {
    "name":"Kirsten Gillibrand",
    "state":"NY",
    "term":2.9
  },
  {
    "name":"Mark Warner",
    "state":"VA",
    "term":0.9
  },
  {
    "name":"Tom Udall",
    "state":"NM",
    "term":0.9
  },
  {
    "name":"Jeanne Shaheen",
    "state":"NH",
    "term":0.9
  },
  {
    "name":"Jefferson Sessions",
    "state":"AL",
    "term":0.9
  },
  {
    "name":"Pat Roberts",
    "state":"KS",
    "term":0.9
  },
  {
    "name":"James Risch",
    "state":"ID",
    "term":0.9
  },
  {
    "name":"John Reed",
    "state":"RI",
    "term":0.9
  },
  {
    "name":"Jeff Merkley",
    "state":"OR",
    "term":0.9
  },
  {
    "name":"Mitch McConnell",
    "state":"KY",
    "term":0.9
  },
  {
    "name":"James Inhofe",
    "state":"OK",
    "term":0.9
  },
  {
    "name":"Lindsey Graham",
    "state":"SC",
    "term":0.9
  },
  {
    "name":"Michael Enzi",
    "state":"WY",
    "term":0.9
  },
  {
    "name":"Richard Durbin",
    "state":"IL",
    "term":0.9
  },
  {
    "name":"John Cornyn",
    "state":"TX",
    "term":0.9
  },
  {
    "name":"Susan Collins",
    "state":"ME",
    "term":0.9
  },
  {
    "name":"Thad Cochran",
    "state":"MS",
    "term":0.9
  },
  {
    "name":"Lamar Alexander",
    "state":"TN",
    "term":0.9
  },
  {
    "name":"Roger Wicker",
    "state":"MS",
    "term":2.9
  },
  {
    "name":"John Barrasso",
    "state":"WY",
    "term":2.9
  },
  {
    "name":"Sheldon Whitehouse",
    "state":"RI",
    "term":2.9
  },
  {
    "name":"Jon Tester",
    "state":"MT",
    "term":2.9
  },
  {
    "name":"Debbie Stabenow",
    "state":"MI",
    "term":2.9
  },
  {
    "name":"Bernard Sanders",
    "state":"VT",
    "term":2.9
  },
  {
    "name":"Bill Nelson",
    "state":"FL",
    "term":2.9
  },
  {
    "name":"Robert MenÃ©ndez",
    "state":"NJ",
    "term":2.9
  },
  {
    "name":"Claire McCaskill",
    "state":"MO",
    "term":2.9
  },
  {
    "name":"Amy Klobuchar",
    "state":"MN",
    "term":2.9
  },
  {
    "name":"Orrin Hatch",
    "state":"UT",
    "term":2.9
  },
  {
    "name":"Dianne Feinstein",
    "state":"CA",
    "term":2.9
  },
  {
    "name":"Bob Corker",
    "state":"TN",
    "term":2.9
  },
  {
    "name":"Robert Casey",
    "state":"PA",
    "term":2.9
  },
  {
    "name":"Thomas Carper",
    "state":"DE",
    "term":2.9
  },
  {
    "name":"Benjamin Cardin",
    "state":"MD",
    "term":2.9
  },
  {
    "name":"Maria Cantwell",
    "state":"WA",
    "term":2.9
  },
  {
    "name":"Sherrod Brown",
    "state":"OH",
    "term":2.9
  }
];
$scope.orderList = "name";
}