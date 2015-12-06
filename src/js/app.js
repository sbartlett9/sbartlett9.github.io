var myApp = angular.module('myApp' , []);

//Controller
//place to put code associate with this controller
//this is the controller for the view, any code inside of here will be controlling the html inside the sub-div with ng-controller name

$(function(){
	if($('li').text().indexOf('Alan') != -1){
		 console.log("Has Alan");
		
	}
});