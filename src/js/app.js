var myModule = angular.module("myModule",[]);

myModule.directive('myWidget' ,function(){
	var linkFn;
	linkFn = function(scope, element, attrs){
		var animateDown, animateRight;
		animateRight = function(){
			$(this).animate({
				left:'+=50'		
			})
		}
		animateDown = function(){
			$(this).animate({
				top:'+=50'		
			});
		}
		
		
		$('#one').on('click' , animateDown);
		$('#two').on('click' , animateRight);
		
	};	
	return{
		restrict:'E',
		link: linkFn	
	}
})