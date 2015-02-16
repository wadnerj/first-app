var orderApp = angular.module('orderApp',['ngCookies', 'ui.calendar', 'ui.bootstrap', 'ngRoute', 'ngStorage', 'ngResource', 'ui.checkbox']);

orderApp.config(['$routeProvider', '$httpProvider', '$provide',
    function($routeProvider,$httpProvider, $provide) {

  $provide.factory('httpRequestInterceptor', function($q, $rootScope ) {
    return {
      request : function(config) {
        return config || $q.when(config);
      },
      requestError : function (rejection) {
        return $q.reject(rejection);
      },
      response : function (response) {
        return response || $q.when(response);
      },

      responseError : function (rejection) {
        return $q.reject(rejection);
      }
    }
  });

  $httpProvider.interceptors.push('httpRequestInterceptor');


  $routeProvider
    .when('/:promo/', {
      templateUrl   : 'tpls/account-info.html',
      controller    : 'OrderCtrl',
      title         : 'Let\'s Get Started',
      tag           : 'account-info',
      orderstep     : 1
    })
    /*.when('/personal-info/:promo/', {
      templateUrl   : 'tpls/contact-info.html',
      controller    : 'OrderCtrl',
      title         : 'Personal Info',
      tag           : 'personal-info',
      orderstep     : 2
    })*/
    .when('/schedule/:promo/', {
      templateUrl   : 'tpls/schedule.html',
      controller    : 'ScheduleCtrl',
      title         : 'Schedule',
      tag           : 'schedule',
      orderstep     : 2
    })
    .when('/shipping-info/:promo/', {
      templateUrl   : 'tpls/shipping-info.html',
      controller    : 'OrderCtrl',
      title         : 'Shipping Info',
      tag           : 'shipping-info',
      orderstep     : 3
    })
    .when('/billing-info/:promo/', {
      templateUrl   : 'tpls/billing-info.html',
      controller    : 'OrderCtrl',
      title         : 'Billing Info',
      tag           : 'billing-info',
      orderstep     : 4
    })
    .when('/thank-you/:promo/', {
      templateUrl   : 'tpls/thank-you.html',
      controller    : 'OrderCtrl',
      title         : 'Thank You',
      tag           : 'thank-you',
      orderstep     : 5
    })
    .otherwise({
      redirectTo    : '/RR31PD/'
    });
}]);

orderApp.run(['$rootScope', '$route', function($rootScope, $route) {
  $rootScope.$on('$routeChangeSuccess', function() {
    $rootScope.orderstep = $route.current.orderstep;
  });

  $rootScope.showLogin = false;

  $rootScope.toggleLoginForm = function() {
    $rootScope.showLogin = !$rootScope.showLogin;
  };
}]);

orderApp.constant('TFD', {
    "API_MEAL" : "/apiController.php?fn=",
    "PREFIX"  : "TFD_ORDER_"

});

orderApp.controller('ScheduleCtrl',
  ['TFD', '$scope', '$routeParams', 'weeg', 'transporter', 'analytics', '$location', '$window', '$route', '$compile', '$resource', '$timeout', 'eCommerceTracker', 'heartBeat', 'leadTracker','brontoTracker', 'sharpspringTracker' ,'dataTrack', 'uiCalendarConfig', 'productsService', 'SimpleCart', 'CalEvents',
  function(TFD, $scope, $routeParams, weeg, transporter, analytics, $location, $window, $route, $compile, $resource, $timeout, eCommerceTracker, heartBeat, leadTracker, brontoTracker, sharpspringTracker, dataTrack, uiCalendarConfig, productsService, cart, calEvents) {

    console.log('schedule ctrl');
    // keep session alive
    var heartBeatInterval = -1;
    clearInterval(heartBeatInterval);
    heartBeatInterval = setInterval(function() {
      heartBeat.httpHeartBeat();
    }, 600000);

    $scope.alerts = [];
    $scope.orderstep      = $route.current.orderstep;
    $scope.$parent.title  = $route.current.title;
    $scope.show_choices   = false;
    $scope.mealTypeNames = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
    $scope.mealTypeNamesVegSide = ['Vegetable Side'];
    $scope.mealTypeNamesStarchSide = ['Starch Side'];
    $scope.mealTypeNamesDessert = ['Dessert Snack'];
    $scope.isTest=null;
    $scope.eventStyles = {
              'hasMeals':{color: '#378300', textColor : 'white'},
              'noMeals' :{color: '#D4F4BC', textColor : 'black'}
              };

          //console.log($scope.eventStyles);


        if( 'Breakfast' in $scope.mealTypeNames) {
          //console.log('found it +++++++++');
        }

    // load current order if not last page
    transporter.init($scope); // get client info and order
    //$scope.

    $scope.reload = function(){
      transporter.init($scope); // get client info and order
    }

    $scope.$watch('dates', function() {
      if(angular.isDefined($scope.dates)){
        var datesInit = $scope.dates.datesInit;
        //console.log(datesInit);
        var minStartDate = $scope.dates.minStartDate;
        //console.log(minStartDate);

        datesInit = calEvents.setStyles(datesInit, $scope.eventStyles);
        //console.log($scope.dates.datesInit);
        // ### Calendar #############

      //var Events = $resource(TFD.API_URL+'&f=getCal&clientID='+$scope.client.userid, {});
      //var Events = $resource('../events.json', {});
      var Events = datesInit;

      $scope.events = {
       color: '#378300',
       //height: "100%",
       height: "44px",
       width: "600px",
       textColor: 'white',
       events: function (start, end, callback) {
        /*var events = Events.query().$promise.then(function(data) {
          callback(data);
        });*/
          var events = callback(Events);
       }
      };

      $scope.eventSources = [ $scope.events ];

       /* Render Tooltip */
      $scope.eventRender = function( event, element, view ) {

          //console.log(event);
          //console.log(element);
          //console.log(view);

          if( (event.title == '') || (event.title == undefined) ){
            event.title = 'Click to add meals';
          }
          element.attr({'tooltip': event.description,
                       'tooltip-append-to-body': true});
          if(event.img != undefined){
            element.html('<img src="'+event.img+'">');
          }else{
            element.html(event.title);
          }
          /*if(event.has_meals == false){
            event.color = "#D4F4BC";
            console.log('it is false');
          }else{
            event.color = "#378300";
          }*/

          //console.log($scope.eventStyles);

          //console.log(element);
          $compile(element)($scope);
      };

      // alert on eventClick 
      $scope.alertOnEventClick = function( date, jsEvent, view){
        //console.log(date);
        //console.log(jsEvent);
        //console.log(view);
        productsService.getProducts(date, $scope.clientID, $scope.orderAddress.kitchen, $scope.promotion.diet).then(function(response){
          console.log('Getting products');
          $scope.alerts = [];
          //console.log(response.data.data);
          var items                 = response.data.data;
          var dateSelected          = response.data.date;
          var nextAvailDate         = response.data.nextAvailDate;
          var datesAvailable        = response.data.datesAvailable;
          //var delivery              = response.data.cartDelivery;
          //console.log(dateSelected);
          $scope.nextAvailDate  = nextAvailDate;
          $scope.dateSelected   = dateSelected;
          $scope.datesAvailable = datesAvailable;
          //$scope.meals = items; // populate qty for each item in the cart.
          $scope.meals = cart.populateQuantity(items, dateSelected);
          //console.log($scope.meals);
          $scope.mealsForDate = ($scope.meals.length === 0) ? false : true;
          $scope.mealsCheck = true;
          if($scope.mealsForDate == false){
            $scope.addAlert({type: 'warning', msg: 'The menu is still in the works for '+$scope.dateSelected});
          }
          //$scope.delMin         = delivery.del_min;
          //$scope.delCharge      = delivery.del_charge;
          //$.cookie(TFD.PREFIX+'dateSelected', dateSelected);
          //$localStorage.settings = response.data.cartDelivery;
          //$scope.settings= $localStorage.settings;

          /*cart.getClientMeals($scope.client.userid).then(function(resp){
           $localStorage.mealDates = resp.data;
            $scope.meals = cart.populateQuantity(items); // populate qty for each item in the cart.
            //$rootScope.dinners = productsService.getDinners($rootScope.meals);
            //productsService.getDinners($rootScope.meals);
            $scope.mealIds = cart.setMealIds($scope.meals);
            $scope.dinnerSides = cart.setDinnerSides($scope.dinners);
            $scope.totalPriceOriginal = cart.totalPrice.total(); // total price for cart items before tax.
            $scope.dirty = 0;

          });*/
                // test
               /* console.log($scope.meals);
                var filtered = [];
                angular.forEach($scope.meals, function(item) {
                  console.log(item.meal_type_name);
                  if( $.inArray(item.meal_type_name, $scope.mealTypes) == 0) {
                    console.log('found it');
                    console.log(item);
                    filtered.push(item);
                  }
                });
                console.log(filtered);

                */


       });


      };

      $scope.storageSave = function(item){
          $localStorage.testTTTT = item;
      }

      $scope.uiConfig = {
        calendar:{
          height: 450,
          width: 550,
          eventStartEditable: true,
          eventDurationEditable: true,
          allDay: false,
          selectable: true,
          selectHelper: true,
          unselectAuto: true,
          defaultEventMinutes: 120,
          header: {
            left: 'month agendaWeek',
            center: 'title',
            right: 'today prev,next'
          },
          eventRender: $scope.eventRender,
          eventClick: $scope.alertOnEventClick,
          dayClick: function( date, allDay, jsEvent, view ) {
            //$scope.calendar.fullCalendar('changeView', 'agendaWeek');
          }
        }
      };

      $scope.addCal = function(){
        //console.log('add cal test');
        $( "#calDiv" ).html('');
        var calDirective = angular.element('<div class="calendar" ng-model="eventSources" calendar="myCalendar" ui-calendar="uiConfig.calendar"></div>');
        var el = $compile( calDirective )( $scope );
        var calDiv = $("#calDiv");
        angular.element(calDiv).append(calDirective);
        var elemClick = $(".fc-button-today");
        $timeout(function () {
          elemClick.click();
        }, 1000);
      }
      $scope.addCal();



        // ### end Calendar #############


        $scope.onMealChange = function(mealTypeName, meal, date) {
          console.log(mealTypeName);
          console.log(meal);
          console.log(date);
          if(meal.qty == 1){
            console.log('add');
            $scope.addItem(mealTypeName, meal, date);
          }else{
            $scope.removeItem(mealTypeName, meal, date);
          }
        };

        $scope.addItem = function(mealTypeName, meal, date){
          cart.addItem(mealTypeName, meal, date);
          $scope.meals = cart.populateQuantity($scope.meals, date);
        }
        $scope.removeItem = function(mealTypeName, meal, date){
          cart.removeItem(mealTypeName, meal, date);
          $scope.meals = cart.populateQuantity($scope.meals, date);
        }


      }
    });

      $scope.addAlert = function(alertMsg) {
        $scope.alerts.push(alertMsg);
      };

      $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
      };

  }]);

orderApp.filter('matchMealCat', function() {
    return function( items, mealTypes ) {
      //console.log('matchMealCat');
      //console.log(items);
      //console.log(mealTypes);
      var filtered = [];
      angular.forEach(items, function(item) {
        //console.log(item.meal_type_name);
        //if( $.inArray(item.meal_type_name, mealTypes) == 0) {
        if(mealTypes.indexOf(item.meal_type_name) > -1){
          //console.log('found it');
          filtered.push(item);
        }
      });
      //console.log(filtered);
      return filtered;
    };
});


orderApp.controller('OrderCtrl',
  ['$scope', '$routeParams', 'weeg', 'transporter', 'analytics', '$location', '$window', '$route', 'eCommerceTracker', 'heartBeat', 'leadTracker','brontoTracker', 'sharpspringTracker' ,'dataTrack',
  function($scope, $routeParams, weeg, transporter, analytics, $location, $window, $route, eCommerceTracker, heartBeat, leadTracker, brontoTracker, sharpspringTracker, dataTrack) {
    // keep session alive
    var heartBeatInterval = -1;
    clearInterval(heartBeatInterval);
    heartBeatInterval = setInterval(function() {
      heartBeat.httpHeartBeat();
    }, 600000);

    // Landing page source for setting the sales type
    var dataTrackInfo = {
      sourceSalesType : dataTrack.getSource()
    }
    $scope.dataTracking = dataTrackInfo;

    // load current order if not last page
    if ($route.current.orderstep != 5)
      transporter.init($scope);

      if ($route.current.orderstep != 2) {
        __insp.push(['tagSession', {"step": $route.current.tag}]);
        __insp.push(["virtualPage"]);
      }

    if ($route.current.orderstep == 3) {
     __insp.push(['tagSession', {
          "UID"   : $scope.clientID,
          "email" : $scope.email
        }])

      // Facebook Conversion Code for Registrations - (No Purchase)
      window._fbq = window._fbq || [];
      window._fbq.push(['track', '6024327780873', {'value':'0.00','currency':'USD'}]);

    }


    $scope.orderstep      = $route.current.orderstep;
    $scope.$parent.title  = $route.current.title;
    $scope.show_choices   = false;


    // alert inspectlet when promo changes
    $scope.$watch('promotion.code', function(newPromo, oldPromo) {
        if (newPromo != oldPromo)
          __insp.push(['tagSession', {"promo": newPromo }]);
    });

    // set billing to updated address
    $scope.$watch('orderAddress', function() {
        $scope.billing = $scope.orderAddress;

        if (angular.isDefined($scope.billing))
          $scope.billing.ccName = $scope.firstName + " " + $scope.lastName;
    });


    $scope.$watch('promotion.code', function(newPromo) {
        if (angular.isDefined(newPromo))
          console.log(newPromo, 'new');
    });

    // if is map && is choices show choices
    $scope.show_choices = ($scope.isMap && $scope.isClassic);

    $scope.accountSetup = function(checkoutType) {
      console.log(checkoutType);

      if ($location.host().split('.')[1] === 'thefreshdiet') {
        $window.__ss_noform.push(['submit', function() { return true; } ]);
      }
      leadTracker.setNewClient();

      var params = {
        brand     : 1,
        email     : $scope.contact.email,
        first     : $scope.firstName,
        last      : $scope.lastName,
        gender    : $scope.gender,
        phone     : $scope.phone,
        pass      : $scope.contact.pass,
        zip       : $scope.contact.zipcode,
        agree     : $scope.contact.agree,
        promo     : $routeParams.promo
      }

     console.log(params);
      var dest = 'shipping-info';
      if(checkoutType == 'custom') dest = 'schedule';

      var dest = '/'+dest+'/' + $routeParams.promo + '/';
      weeg.http('Order', 'accountSetup', params, dest);

    }


  // Rendering different views based on different set of promo codes
  // set this code in HTML EX:
  //<div ng-if="render.hidden(promotion.code)"></div>
  var code = $routeParams.promo.toString();
  var nonretail=['RR7DOC', 'RR28DOC','SOFFERFP', 'SOFFERFV', 'SOFFERGF'];//add all non retail codes
  $scope.render = {
                hidden: function(code) {
      var codeResponse = $.inArray(code, nonretail);// all non retail codes
                        return codeResponse == -1
                }
        }


    $scope.loginOrder = function(email,passwd) {
      var params = {
        email   : email,
        passwd  : passwd,
        brand   : 1,
        promo   : $routeParams.promo
      }
      var dest = '/personal-info/' + $routeParams.promo + '/';
      weeg.http('Order', 'loginOrder', params, dest);
    };

    $scope.forgotPassword = function(email) {
      weeg.http('Member', 'forgotPassword', { email : email, brand : 1 });
    }

    $scope.personalInfo = function() {
      var params = {
        brand   : 1,
        clientID : $scope.clientID,
        orderID : $scope.order.order_id,
        email   : $scope.email,
        first   : $scope.firstName,
        last    : $scope.lastName,
        gender  : $scope.gender,
        phone   : $scope.phone
      }

      var dest = '/shipping-info/' + $routeParams.promo + '/';
      weeg.http('Order', 'personalInfo', params, dest);
    }

    $scope.showChoices  = function() {
      $scope.show_choices = true;
    }

    $scope.replaceOrder = function(promo, restrict) {
      var personalInfo = {
        firstName   : $scope.firstName,
        lastName   : $scope.lastName,
        gender  : $scope.gender,
        phone   : $scope.phone
      };
      var shippingAddress = $scope.orderAddress; // don't let state overwrite unsaved input
      var params = {
        'clientID' : $scope.clientID,
        'promo'    : promo,
        'restrict' : restrict
      }

      $scope.$watch('promotion.diet', function(oldValue, newValue) {
        $scope.diet_changed = (oldValue != newValue);
      });

      angular.extend($scope, weeg.http('Order', 'replaceOrder', params));
      $scope.orderAddress = shippingAddress;
      angular.extend($scope, personalInfo);
      parent.$.fancybox.close();
    };

    $scope.cancel = function() {
      weeg.http('Order', 'cancelOrder', { clientID : $scope.clientID });
      window.location = '/#meal';
    };

    $scope.back   = function() {
      $window.history.go(-1);
    };




    $scope.shippingInfo = function(isValid) {

      $scope.shipForm.$pristine = false;
      $scope.submitted = true;

      if(isValid){

        var params = {
          clientID        : $scope.clientID,
          orderID         : $scope.order.order_id,
          promo           : $routeParams.promo,
          address1        : $scope.orderAddress.address1,
          address2        : $scope.orderAddress.address2,
          city            : $scope.orderAddress.city,
          state           : $scope.orderAddress.state,
          zip             : $scope.orderAddress.zip,
          promote         : $scope.promote,
          deliverynotes   : $scope.deliveryNotes
        };
        var dest = '/billing-info/' + $routeParams.promo + '/';
        weeg.http('Order', 'shippingAddressExt', params, dest);

      }

    }

    $scope.clearCC = function() {
      //$scope.billing.ccName   = "";
      $scope.billing.ccNum    = "";
      $scope.billing.ccExpM   = "";
      $scope.billing.ccExpY   = "";
      $scope.billing.ccCVV    = "";
    }

    $scope.billingInfo = function()
    {

      if ($scope.program.agreement != "") {
        if(!confirm($scope.program.agreement))
          return;
      }

      var params = {
        orderID     : $scope.order.order_id,
        existing    : (typeof $scope.paymentMech == "boolean") ? false : true,
        clientID    : $scope.clientID,
        address1    : $scope.billing.address1,
        address2    : $scope.billing.address2,
        city        : $scope.billing.city,
        state       : $scope.billing.state,
        zip         : $scope.billing.zip,
        ccName      : $scope.billing.ccName,
        ccNum       : $scope.billing.ccNum,
        ccExpM      : $scope.billing.ccExpM,
        ccExpY      : $scope.billing.ccExpY,
        ccCVV       : $scope.billing.ccCVV,
        startDate   : $scope.order.start_date
      };
      var dest = '/thank-you/' + $routeParams.promo + '/';
      try {
        weeg.http('Order', 'billingInfo', params, dest);
      } catch(err) {
        //clearCC();
      }
    }

     if ($scope.orderstep == 3)
    {

       if (leadTracker.isNewClient())
       {  // only send event on production
          if ($location.host().split('.')[1] === 'thefreshdiet') {
            //Sends google analytics goal event
            leadTracker.track();
            $scope.adwordsImage = 'www.googleadservices.com/pagead/conversion/966345797/?label=5UksCKfSnlgQxYjlzAM&amp;guid=ON&amp;script=0';
          }
       }
       else {
        $scope.adwordsImage =  " ";
       }
    }

    // here im just passing the scope to the next controller
    // the next state method that is returned on each request
    // only checks for last unfinished order and the last request
    // "finished" the order.
    //angular.extend($scope,transporter.getScope());
    //

    if ($scope.orderstep == 5 )
    {
      var passedScope = transporter.getScope();

      $scope.display_name = passedScope.firstName + " " + passedScope.lastName;
      $scope.order = {
        order_id      : passedScope.order.order_id,
        start_date    : passedScope.order.start_date,
        total         : passedScope.order.total,
      }


      if (!window.mstag)
        mstag = {loadTag : function(){},time : (new Date()).getTime()};

      mstag.loadTag("analytics", {
        dedup     : "1",
        domainId  : "2593752",
        type      : "1",
        revenue   : passedScope.order.total,
        actionid  : "167756"
      });


      // Facebook Conversion Code for Purchase
      window._fbq = window._fbq || [];
      window._fbq.push(['track', '6024323564273', {'value':passedScope.order.total,'currency':'USD'}]);


      $scope.linkshare = function() {
        var linkshare = {
          mid : 38859,
          ord : passedScope.order.order_id,
          skulist : passedScope.promotion.code.trim(),
          qlist : 1,
          amtlist : passedScope.order.subtotal * 100,
          cur : "USD",
          namelist : encodeURI(passedScope.promotion.label.trim())
        }

        var url = "https://track.linksynergy.com/ep?";
        for(key in linkshare)
          url += "&" + key + "=" + linkshare[key];
        return url;
      }

      // send ecommerce transaction data to google analytics
      // only only on production
      if ($location.host().split('.')[1] === 'thefreshdiet') {
        eCommerceTracker.init(passedScope);
        eCommerceTracker.track();

        //bronto tracking
        brontoTracker.init(passedScope);
        brontoTracker.sendInfo();

        //sharpspring Tracking
        sharpspringTracker.init(passedScope);
        sharpspringTracker.createTransaction();
        sharpspringTracker.sendTransaction();

      }

      // shareasale pixel tracking
      if($scope.order.order_id > 0){
        var subTotal = passedScope.order.subtotal;
        var orderId  = passedScope.order.order_id;
        $scope.conversion_src = 'https://shareasale.com/sale.cfm?amount='+subTotal+'&tracking='+orderId+'&transtype=sale&merchantID=41411&storeID=2';
      }

      weeg.loading(false);
  }

  }]);



orderApp.directive('fancybox', function ($compile, $http) {
    return {
        restrict: 'A',

        controller: function($scope) {
        $scope.openFancybox = function (url) {
                    $http.get(url).then(function(response) {
                      if (response.status == 200) {
                            var template = angular.element(response.data);
                            var compiledTemplate = $compile(template);
                            compiledTemplate($scope);
                            $.fancybox.open([
          {
                                            content: template,
                                            type: 'html'
                          }
                                          ]);
                          }
                    });
            };
        }
    };
});

orderApp.directive("dislikePanel", function() {
   return {
  restrict: "A",
  templateUrl: "tpls/ingredient-dislikes.html",
  controller : "DislikesCtrl"
   };
});


orderApp.controller('DislikesCtrl', ['allIngredients','dislikes', '$scope','$routeParams', '$localStorage', function(allIngredients, dislikes, $scope, $routeParams, $localStorage) {

	$scope.dislikePromo = $routeParams.promo;
	var ingredients = allIngredients.get($scope.dislikePromo);
	//ingredients = dislikes.getDislikes(ingredients);
        var dietDislikes = [];
	var categories = [];
	$scope.remainingDislikes = 0;
	ingredients.then(function(response){
		var ingred = response.data.ingredients;
        	$scope.allIngredients = dislikes.getDislikes(ingred);
		$scope.dietDislikes   = response.data.diet_dislikes;
		$scope.maxDislikes    = response.data.dislikes_count;
		$scope.categories     = response.data.categories;
		$scope.programId      = response.data.program_id;
		categories	      = $scope.categories;
		dietDislikes          = $scope.dietDislikes;
		$scope.trackDislikes();
	});
   $scope.clientDislikeIds=[];
   $scope.clientDislike= {};
   $scope.dislikesReached = false;
   $scope.category = "Fruit"; //Set Default category
    
// Create tabs based on database ingredient categories
$scope.ingredientType = function(types){
        $scope.category = types;
};

$scope.activeTab="";//used for image loading

// Remove all ingredients not used in diet from each category. Ex: meat for veg
//hide diet dislikes - Ex: meat for fresh vegetarian
$scope.dietDislike = function(idFood){
  if ($.inArray(idFood, dietDislikes) == -1){
    return false;
  }else{
    return true;
  }
}

$scope.dietDislikeMsg = function(){
	if ($scope.programId == '194' || $scope.programId == '4096'){ // premium or classic 
		return false;
	} else{ return true}

}

// Add and removes dislikes
$scope.toggleDislike = function(food, action){
  var d={
                idFood: food.idFood,
                food: food.food 
                };
	
	if(action == false){//remove
		$.each($scope.clientDislikeIds, function(key,value){
			if(value.idFood == food.idFood){
				$scope.clientDislikeIds.splice(key,1);
				return false;
			}	
		});
		$.each($scope.allIngredients, function(key,value){
			 if(value.idFood == food.idFood){
				value.selected = false;
			}
		});
		$localStorage.dislikes = $scope.clientDislikeIds;
		 $scope.trackDislikes();
	}
	if (action == true){//add
		if ($scope.clientDislikeIds.length < $scope.maxDislikes){
                        	$scope.clientDislikeIds.push(d);
		} 
		 $localStorage.dislikes = $scope.clientDislikeIds;
		 $scope.trackDislikes();

	}
	if (action == "load"){
                $scope.clientDislikeIds.push(d);
    $scope.trackDislikes();
  }
};

//$scope.selectState= false;
$scope.toggle = function(selected){
	if ($scope.remainingDislikes != 0){
	 selected = selected === true ? false: true;
	} else{
	 selected = false;
	}
	 return selected;	
};


//load dislikes from local storage if page refreshes or client leaves
$scope.loadDislikes = function(load, action){
  if (load !== undefined){
    $.each(load, function(key, value) {
                     $scope.toggleDislike(load[key], action);
			var id = load[key]['idFood'].toString();
		});
		// $.each($scope.allIngredients, function(key,value){
                  //       if(value.idFood == load.idFood){
                    //            value.selected = true;
                     //   }
               // });
		$scope.clientDislikeIds = $localStorage.dislikes;
	}
}

// clear all button
$scope.clear = function(){
	$scope.clientDislikeIds =[];
	$scope.loadDislikes($localStorage.dislikes, false);
	$localStorage.dislikes = [];
	$scope.trackDislikes();
}

//check if local storage is empty
$scope.storageCheck= function(){
  if ($localStorage.dislikes ==""){
    return true
  }else{
    return false
  }
}

//Alert messages for dislikes
$scope.dislikeAlerts = function(){
  if ($scope.remainingDislikes == 0) {
        $scope.msgtype = 'success';
	if ($scope.programId != '4096'){
		 $scope.msg = 'Congrats! All dislike(s) have been selected. Please view your choices to replace and continue.';
	} else{
		$scope.msg = 'This plan allows for 0 dislikes. Please click next step to proceed.'
	}
    } else if ($scope.remainingDislikes < 0){
        $scope.msgtype = 'danger';
        $scope.msg = 'Too many dislikes selected for this plan. Please remove ' + $scope.remainingDislikes* -1 + ' ingredients before you can continue.';
  } else if ($scope.remainingDislikes > 0) {
        $scope.msgtype = 'warning';
        $scope.msg = $scope.remainingDislikes + ' Optional dislike(s) remaining to select. View Your Choices to continue.';
 } else{
         return
 }
}

//Updates dislikes remaining
$scope.trackDislikes = function(){
  if ($localStorage.dislikes === undefined){
           $scope.remainingDislikes = parseInt($scope.maxDislikes - 0);
        } else {
           $scope.remainingDislikes = parseInt($scope.maxDislikes) - $localStorage.dislikes.length;
        }
  if ($scope.remainingDislikes <= 0){
                 $scope.dislikesReached = true;
                 //alert("Maximum amount of dislikes selected, please remove to switch.");
       }else if ($scope.remainingDislikes > 0){
      $scope.dislikesReached = false;
                 }
      $scope.dislikeAlerts();
}

//load dislikes when app runs
$scope.loadDislikes($localStorage.dislikes, "load");


 $scope.currentPage = 0; // paging start
 $scope.pageSize = 12;// paging amount
 $scope.numberOfPages=function(count){
        return Math.ceil(count/$scope.pageSize);                
    }

}]);

//filter used for paging
orderApp.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

