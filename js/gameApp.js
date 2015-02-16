// create the module and name it gameApp

	var gameApp = angular.module('gameApp', ['ngRoute','ngAnimate']);



// configure our routes
	

gameApp.config(function($routeProvider) {

		$routeProvider



     // route for the splash page
			
	.when('/', {

	  templateUrl : '../app/tpls/splash.html',

	  controller  : 'splashController'
			
       })


	 // route for the home page
			
	.when('/home', {

	  templateUrl : '../app/tpls/home.html',

	  controller  : 'mainController'
			
       })


	// route for the stage page
			
        .when('/stage', {

	  templateUrl : '../app/tpls/stage.html',

	  controller  : 'stageController'

	})


	// route for the exit page

	//.when('/exit', {

	 // templateUrl : '../app/tpls/exit.html',

          // controller  : 'exitController'

	//});
	
});

	



// End Splash Controller
gameApp.controller('splashController', function($scope, $location, $timeout) {


$scope.endSplash = function(){ 
 $location.path('/home'); // path not hash
 }; 

$scope.fadeO= function(){
$('.splash').fadeOut();
}


$timeout($scope.fadeO, 6500);
$timeout($scope.endSplash, 7000);         	

});
// End Splash Controller


// Start main menu controller
gameApp.controller('mainController', function($scope, $timeout) {

$scope.ready = { active: false };
$scope.fadeIn = function () {
      
    $scope.ready.active = !$scope.ready.active;
   
 };
		

$timeout($scope.fadeIn, 500);


});

	
// End main menu controller


gameApp.controller('exitController', function($scope) {

		$scope.message = 'Contact us! JK. This is just a demo.';

	});


gameApp.controller('stageController', function($scope) {

		$( document ).ready(function() {

start();
document.ontouchmove = function(e) {e.preventDefault()}; //mobile bounce
$(document).on('vclick', '#animate-area', function(event){
  $("#player.main").css({ left: event.clientX });
        $("#player.main").css({ top: event.clientY });
});

$(document).on("swipe", "body", function(event,e){
var offset = $( this ).offset();
var touch = event.changedTouches[0];
console.log("y " + touch.screenX);
alert('swipe');
$("#player.main").css({ left: event.clientX });
 $("#player.main").css({ top: event.clientY });
});



function gameTimer() {
    var daily = 60 * 12.4,
        stageT= 60 * 0.41,
        day = 1,
        months = 0,
        max = document.getElementById("daily"),
        stage = document.getElementById("stage"),
        days = document.getElementById("days"),
        mins, seconds;
    setInterval(function() {
        mins = parseInt(daily / 60)
        seconds = parseInt(daily % 60);
        seconds = seconds < 10 ? "0" + seconds : seconds;

        minsT = parseInt(stageT / 60)
        secondsT = parseInt(stageT % 60);
        secondsT = secondsT < 10 ? "0" + secondsT : secondsT;
        daily--;

        max.innerHTML = "Months " + ":" + months;
        stage.innerHTML = "Hours Remaining: " + secondsT;
        days.innerHTML = "Day " + day;
        stageT--;

        if (daily < 0) {
            daily = 60 * 12.4;
            months +=1;
 }

         if (stageT < 0) {
            stageT= 60 * 0.41;
            day += 1;
        }
    }, 1000);
}



/*$( '#animate-area' ).click(function(event) {
console.log("click");
console.log(event.clientX);
*/
/*      if (parseInt($('#player').css('top')) <= 200 && pos_y <= 200){
                console.log('1');
                console.log($('#player').css('top'));
                $("#player").css({ top: '25%' });
        }

         if (parseInt($('#player').css('top')) < 200 && pos_y >= 200){
                console.log('2');
                console.log($('#player').css('top'));
                $("#player").css({ top: '50%' });
        }

          if (parseInt($('#player').css('top')) > 200 && pos_y <= 200){
                console.log('3');
                console.log($('#player').css('top'));
                $("#player").css({ top: '50%' });
        }


         if (parseInt($('#player').css('top')) >= 200 && pos_y >= 200){
                console.log('4');
                console.log($('#player').css('top'));
                $("#player").css({ top: '75%' });
        }
*/
        /*
  $("#player.main").css({ left: event.clientX });
        $("#player.main").css({ top: event.clientY });
        return false;
})

*/
var fall=0;
var each= "";
var score =0;
$( "#animate-area" ).mousemove(function( event ) {
  /*var pageCoords = "( " + event.pageX + ", " + event.pageY + " )";
var clientCoords = "( " + event.clientX + ", " + event.clientY + " )";
*/
   $("#player.main").css({ left: event.clientX });
  $("#player.main").css({ top: event.clientY });
 /* $( "span:first" ).text( "( event.pageX, event.pageY ) : " + pageCoords );
  $( "span:last" ).text( "( event.clientX, event.clientY ) : " + clientCoords );
*/
  if(collision($('#player.main'), $("#"+id))== true){
                score +=1
                $(".fall."+id).remove();
                $("#score").html('Score: '+ score)
                console.log('true')
        } else{
                console.log('false')
        }
});



//var t= Math.floor((Math.random() * 10000) + 1000);
//var myVar=setInterval(function () {myTimer()}, t);
//function myTimer() {
 //   var d = new Date();
  //  t = Math.floor((Math.random() * 10000) + 1000);
   // $(".fall."+each).remove();
//}


/*function falling(){
        fall = 0;
    setInterval(function() {
        if (fall < screen.height -20){
                fall +=1;
        }
        //console.log('in');
        $(".fall."+each).css({ top: fall+'%' });
   },50);
};
*/

var dropId = ""
function strop(cleft, ctop, d) {
    var drop = document.createElement('div');
    drop.className = 'fall';
    drop.style.left = cleft + 'px';
 drop.style.top = ctop + 'px';
    drop.id = d;
    $( "#animate-area").append(drop);
    dropId = parseInt($('.fall#'+drop.id).attr('id'));
}

function randomFromInterval(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}
var n, interval;

function newDrop() {
    var x = randomFromInterval(20, screen.width),
        y = randomFromInterval(10, screen.height);
    strop(x, y, n);
    n--;
    if (n > 0) {
        setTimeout(newDrop, 500);
    }
        //each = Math.random().toString(36).substring(7);
        //$(".fall").addClass(each);

}

function start() {
    gameTimer()
    n = 300;
    newDrop();
    interval = setInterval(function() {
        var drops = document.getElementsByClassName('fall'),
            newY;
        if (drops.length == 0) {
            clearInterval(interval);
            return;
        }
        for (var i = 0; i < drops.length; i++) {
            newY = drops[i].offsetTop + 2;
            if (newY > drops[i].parentNode.offsetHeight) {
                drops[i].parentNode.removeChild(drops[i]);
            }
            else {
                drops[i].style.top = newY + 'px';
            }
        }
    }, 24);
}

function collision($div1, $div2) {
      var x1 = $div1.offset().left;
      var y1 = $div1.offset().top;
      var h1 = $div1.outerHeight(true);
      var w1 = $div1.outerWidth(true);
      var b1 = y1 + h1;
      var r1 = x1 + w1;
      var x2 = $div2.offset().left;
      var y2 = $div2.offset().top;
      var h2 = $div2.outerHeight(true);
      var w2 = $div2.outerWidth(true);
      var b2 = y2 + h2;
      var r2 = x2 + w2;

      if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
      return true;
    }

});
});

	

