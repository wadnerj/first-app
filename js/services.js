orderApp.service('weeg', function($rootScope, $location, ngAlert) {
  this.http = function(domain, method, params, dest) {

    ngAlert.dismiss();
    $rootScope.loading = true;
    
    var values = Object.keys(params).map(function(key) {
      return angular.isDefined(params[key])
              ? params[key]
              : "";
    });

    with (Wigwam.async) {
    
      var res = NiM.API[domain][method].apply(this,values);
    
      res( 
        function(data) {
          $rootScope.$apply(function() {
            //TODO: fix this hack
            if (method == 'clientInfo' || method == 'replaceOrder' || method == 'accountSetup')
              $rootScope.loading = false;
            ngAlert.dismiss();
            angular.extend($rootScope, data);
            $location.path(dest);
          });
        },
        
        function(err) {
          
          switch(err.exception) {
            case "Wigwam\\NotAllowed":
              break;
            case "Wigwam\\ServerException":
              break;
            case "Wigwam\\InvalidCreditCard":
              ngAlert[err.severity](err.message);
              throw "invalid";
              break;
            default:
              __insp.push(['tagSession', {"error": err.type, "error-message": err.message}]);
              ngAlert[err.severity](err.message);
              break;
          }
          
          $rootScope.$apply(function() {
            $rootScope.loading = false;
          });
        }
      )
      
      .done(function(data, textStatus, jqXHR) {
      })
      
      .fail(function(jqXHR, textStatus, errorThrown) {
        var err = jqXHR.responseJSON;
     
      });
    }
  };
  this.loading = function(loading) {
    $rootScope.loading = loading;
  }

})


.service('ngAlert', function($rootScope) {
  this.notice = function(message) {
    this._alert('notice', message);
  };
  this.warning = function(message) {
    this._alert('warning', message);
  };
  this.error = function(message) {
    this._alert('error', message);
  };
  this.dismiss = function() {
    $rootScope.alert = {
      show      : false,
    };
  }
  this._alert = function(severity, message) {
    $rootScope.alert = {
      show      : true,
      severity  : 'notice',
      message   : message
    };
  };
})


.service('analytics', function($rootScope, $window, $location, $route) {
  var track = function() {
    $window.ga('send', 'pageview', {
      'page'  : $route.current.tag,
      'title' : $route.current.title
    });
    $window.ga('op.send', 'pageview', {
      'page'  : $route.current.tag,
      'title' : $route.current.title
    });

    // Facebook retargeting pixel
    $window._fbq = $window._fbq || [];
    $window._fbq.push(['track', 'PixelInitialized', {}]);
  }
  $rootScope.$on('$viewContentLoaded', track);
})


.service('aff', function($rootScope, $location) {
  this.get = function() {
    var affCode = $location.$$host.split('.')[0];
    return (affCode != 'www') ? affCode : null;
  }
})






.service('transporter', function($location, $routeParams, $route, weeg) {
  var scope;

  this.init = function($scope) {
    angular.extend($scope, weeg.http('Order', 'clientInfo', { promo : $routeParams.promo, dataTrack : $scope.dataTracking}));
    this.setScope($scope);
    
    // have a session? do not allow to relogin
    if ($route.current.orderstep == 1) {
      if (angular.isDefined($scope.order))
        $location.path('/personal-info/' + $routeParams.promo + '/');
    } else { // no session back to beginning
      //if (angular.isUndefined($scope.order))
        //$location.path('/' + $routeParams.promo + '/');
    }
  }  

  this.setScope = function(scope) {
    this.scope = scope;
  }
  
  this.getScope = function() {
    return this.scope;
  }
})

.service('eCommerceTracker', function($window) {
  this.kitchens = {
    '3'  : 'South Florida Kitchen',
    '4'  : 'Chicago Kitchen',
    '8'  : 'NY Kitchen',
    '12' : 'Los Angeles Kitchen',
    '22' : 'Dallas Kitchen',
    '30' : 'NY MAP Kitchen',
    '32' : 'Chicago MAP Kitchen',
    '34' : 'Dallas MAP Kitchen',
    '36' : 'Los Angeles MAP Kitchen',
    '38' : 'South Florida MAP Kitchen',
    '45' : 'General Map Kitchen'
  };

  this.init = function(passedScope) {
    this.scope = passedScope;
  };

  this.getKitchenName = function(kitchenId) {
    return this.kitchens[kitchenId];
  };

  this.track = function() {
    var kitchenId = this.scope.orderAddress.kitchen;
    this.transaction = {
      'id'          : this.scope.order.order_id,
      'affiliation' : this.getKitchenName(kitchenId),
      'revenue'     : this.scope.order.total,
      'shipping'    : this.scope.order.shippingtotal,
      'tax'         : this.scope.order.taxtotal
    };

    this.item = {
      'id'       : this.scope.order.order_id,
      'name'     : this.scope.promotion.label,
      'sku'      : this.scope.promotion.code,
      'price'    : this.scope.order.subtotal,
      'quantity' : '1'
    };

    $window.ga('ecommerce:addTransaction', this.transaction);
    $window.ga('ecommerce:addItem', this.item);
    $window.ga('ecommerce:send');
    $window.ga('op.ecommerce:addTransaction', this.transaction);
    $window.ga('op.ecommerce:addItem', this.item);
    $window.ga('op.ecommerce:send');
  };

})

.service('leadTracker', function($window) {
  this.newClient = false;

  this.isNewClient = function() {
    return this.newClient;
  }

  this.setNewClient = function() {
    this.newClient = true;
  };

  this.track = function() {
    this.newClient = false;
    //send google analytics event
    $window.ga('send', 'event', 'Account', 'Create');
  }
})
  //bronto email tracking
.service('brontoTracker', function($window){
  this.init = function(passedScope) {
    this.scope = passedScope;
  };

  this.sendInfo = function() {
    $window.bta.addOrder({
      'order_id'  : this.scope.order.order_id,
      'email'     : this.scope.email,
      'contact_id': '',
      'date'      : '',
      'items': [
        {
          'item_id' : this.scope.promotion.code,
          'desc'    : this.scope.promotion.description,
          'amount'  : this.scope.order.subtotal,
          'quantity': '1',
          'name'    : this.scope.promotion.label,
          'category': this.scope.program.programShortName,
          'image'   : 'http://imageUrl',
          'url'     : 'http://itemUrl'
       },
    ]});
  };
})

.service('sharpspringTracker', function($window){

  this.init = function(passedScope) {
    this.scope = passedScope;
  };

  this.createTransaction = function() {
      $window._ss.push(['_setTransaction', {
          'transactionID': this.scope.order.order_id,
          'storeName': 'The Fresh Diet',
          'total': this.scope.order.subtotal,
          'tax': this.scope.order.taxtotal,
          'shipping': this.scope.order.shippingtotal,
          'city': this.scope.orderAddress.city,
          'state': this.scope.orderAddress.state,
          'zipcode': this.scope.orderAddress.zip,
          'country': 'USA',
          'firstName' : this.scope.firstName,
          'lastName' : this.scope.lastName,
          'emailAddress' : this.scope.email
      }]);
  };

  this.sendTransaction = function() {

      $window._ss.push(['_addTransactionItem', {
          'transactionID': this.scope.order.order_id,
          'itemCode': this.scope.promotion.code,
          'productName': this.scope.promotion.label,
          'category': this.scope.program.programShortName,
          'price': this.scope.order.subtotal,
          'quantity': '1'
      }]);

      $window._ss.push(['_completeTransaction', {
          'transactionID': this.scope.order.order_id
      }]);
  };

})


.service('heartBeat', function() {
  this.httpHeartBeat = function() {
    var url = '/order/heartBeat.php';
    $.get(url,function(data,status){
    });
  };
})

// Get the lead source from landing pages cookies for internal use.
.service('dataTrack', function($rootScope, $cookies) {

  // check for cookie from landing page
  this.getSource = function(){
    var source = $cookies.TFD_source; // 
    if(source == undefined){
      source = '';
    }
    return source;
  }
})

.service('productsService', ['TFD', '$rootScope', '$http', '$cookieStore', '$localStorage', '$location', function(TFD, $rootScope, $http, cookies, $localStorage, $location) {

    var productsService = {};
    //console.log('prod svc'); 

    productsService.getClient = function(){

      var absUrl = $location.absUrl();
      var urlSplit = absUrl.split('&id=')[1];
      var clientID = urlSplit.split('#')[0];
      var resp = '';
      var resp = $http.get(TFD.API_URL+'&f=getClient&clientID='+clientID);
      //console.log(resp);
      return resp;

    }


    productsService.getDeliveryDays = function(clientID){
      var params = {
        clientID: clientID
      }
      var resp = '';
      // Simple POST request example (passing data) :
      var resp = $http.post(TFD.API_URL_DEL, params).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available

      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
      return resp;


    }

    // Gets the list. If no date is passed, the server will use the next available start date. 
    productsService.getProducts = function(event, client, kitchen, diet) {

      //console.log(event);
      //console.log(client);
      //console.log(kitchen);
      //console.log(diet);
      var date = event.id;
      //console.log(date);
      
      var products = $http.get(TFD.API_MEAL+'get_meals_by_kitchen_diet_date&kitchen='+kitchen+'&diet='+diet+'&date='+date);
      //productsService.checkCutOffDate(products);

      return products;

    };

    // check for items in cart that have a date past the cutoff time
    productsService.checkCutOffDate = function(products){
      //console.log('Checking cutoff date -----------'); 
      var cartItems = $localStorage.mealDates;
      if(cartItems == undefined)
        return products;

      if(!$.isEmptyObject(products)){
        var datesAvail = products.then(function(response){
          var datesAvailable        = response.data.datesAvailable;
          //console.log(datesAvailable);
          // check for dates against cart dates
          var removeDates = [];
          $.each(cartItems, function(key, item){
            if($.inArray(key, datesAvailable) == -1){
              //console.log('date is not here.......');
              removeDates.push(key);
            }
          });

          $rootScope.removeDates = removeDates.sort();
          $.each(removeDates, function(key, date){
            delete $localStorage.mealDates[date];
            delete $localStorage.dinnerSides[date];
          });

        });
      }else{
        //console.log('products is empty, get them now');
        productsService.getProducts();
      }
      //console.log('end Checking cutoff date -----------'); 

    };

    productsService.getDinners = function(meals){
      //var dinners = {};
      //console.log(meals);
      $.each(meals, function(key, mealData) { // loop dates
        if(mealData.meal_type_name == 'Dinner'){
          //console.log(mealData);
          $rootScope.dinners = mealData;
          //return mealData;
        }
      });
    };

    return productsService;
}])



.factory('SimpleCart', ['TFD', '$rootScope', '$http', '$filter', '$cookieStore', '$localStorage', function(TFD, $rootScope, $http, $filter, cookies, $localStorage){

    //console.log(cookies);

    var cart = {};

      //itemsCookie: '',

      cart.init = function(itemsCookie){

        if(!$localStorage.mealDates){
          $localStorage.mealDates = {};
        }

        /*if($.cookie('your-delivery-type') == 'map'){
          $rootScope.isMap = true;
          $rootScope.zipFormShow = false;
        }*/

      }

      cart.getAll = function(){
        console.log('cart.getAll');
        //return $localStorage.mealDates;
        var items = angular.copy($localStorage.mealDates); // copy so we don't add meal names to localStorage
        // get meal names for cart display
        if(Object.keys(items).length > 0){
          $.each(items, function(date, mealObj) { // loop dates
            $.each(mealObj, function(key, meal) { // loop meals 
            items[date][key].name = $localStorage.mealsRef[items[date][key].meal_id]; // set the meal name to show in the cart
            });
          });
        }
        return items;
      }

      // clients meals from db
      cart.getClientMeals = function(clientID, items){
        //console.log('getting client meals');
        var dateSelected = $.cookie(TFD.PREFIX+'dateSelected');
        // here we get the clients items from the database
        var resp = $http.get(TFD.API_URL+'&f=getClientMeals&clientID='+clientID+'&date='+dateSelected);

        return resp;

      }

      // show qty of each item that are in the cart
      cart.populateQuantity = function(items, dateSelected){

        console.log('populateQuantity :: getting cart items');
        console.log(items);

          // if no meals selected, just show available meals
          if($.isEmptyObject($localStorage.mealDates))
            return items;

          var cart = $localStorage.mealDates[dateSelected];

          if($.isEmptyObject(cart))
            return items;

          console.log('cart has items');

           
          $.each(cart, function(cartKey, cartMeals){ // mealTypeName, meals 
            $.each(items, function(itemKey, itemObj){ // product list. itemKey is numbered arr, itemObj = mealTypeName and meals array.
              if(cartKey == itemObj.meal_type_name){
                //console.log('meal type exixts in cart');
                // build array of id's for this meal type
                var mealIdsInMealType = [];
                $.each(cartMeals, function(cartMealKey, cartMeal){
                  mealIdsInMealType[parseInt(cartMeal.meal_id)] = parseInt(cartMeal.meal_id);
                });
                $.each(itemObj.meals, function(itemMeal, itemMealObj){ // meal list
                  //console.log(itemMealObj.meal_id);
                  //console.log(mealIdsInMealType);
                  //console.log(mealIdsInMealType[itemMealObj.meal_id]);
                  if(mealIdsInMealType[itemMealObj.meal_id] == undefined){
                    itemMealObj.qty = "0";
                    itemMealObj.btnClass = "btn-normal";
                  }else{
                    itemMealObj.qty = "1";
                    itemMealObj.btnClass = "btn-success";
                  }
                });
              }
            });
          });
          
          return items;

      }


      cart.removeItem = function(mealTypeName, item, dateSelected){
        //console.log(mealTypeName);
        //console.log(item);
        //console.log(dateSelected);
        
        var m = $localStorage.mealDates[dateSelected][mealTypeName];
        m.length = 0;
        delete $localStorage.mealDates[dateSelected][mealTypeName];
        
      }

      cart.addItem = function(mealTypeName, item, dateSelected){

        //var singleMealTypes = ['Breakfast', 'Lunch', 'Dinner'];
        //console.log('services : addItem');
        //console.log(item);
        //console.log('qty: '+qty);
        //console.log('date: '+date);
        //console.log('remove: '+remove);

        // set default qty
        var deleteItem = false;
        //if( (qty === undefined) || (qty == 0) || (qty == '') || (qty === null) || (remove == true) ) deleteItem = true;

        // local storage ------------>
        if(!$localStorage.mealDates){
          //console.log('Storage does not exist. Creating it now.');
          $localStorage.mealDates = {};
        }
        var mealDates = $localStorage.mealDates;


        // Date is not yet in cart, add a new date object and add the first item to it.
        if(!(dateSelected in mealDates)){
          console.log('Date does not exist. Creating it now.');
          
          $localStorage.mealDates[dateSelected] = {};
          // add the meal type array
          $localStorage.mealDates[dateSelected][mealTypeName] = [{
            meal_id       : item.meal_id,
            meal_category : item.meal_category
          }];
          return;
        }


        // if the date exists in the cart
        if(dateSelected in mealDates){
          // if the meal type does not exist in the  cart
          if(!(mealTypeName in mealDates[dateSelected])){
            $localStorage.mealDates[dateSelected][mealTypeName] = [{
              meal_id       : item.meal_id,
              meal_category : item.meal_category
            }];
            console.log('Added meal type');
            return;
          }

          // Date and meal type exists at this point
          
          var m = mealDates[dateSelected][mealTypeName];
          //console.log('Date exists, adding to it');
          // check for meal_id
          var itemExists = false;
          // if there are meals in the cart for the date
          if(m.length > 0){
            console.log(m);
            var deleteItems = [];
            $.each(m, function(key, value) {
              // If items exists in the cart
              var delMeal = {
                meal_id        : value.meal_id,
                meal_category  : value.meal_category
              }
              deleteItems.push(delMeal);
              // end item exists
            });
            console.log(deleteItems);
          }
          $.each(m, function(key, meal){
            //cart.removeItem(mealTypeName, meal.meal_id, dateSelected);
            m.length = 0;
          });

          // Add item.
          var newMeal = {
            meal_id       : item.meal_id,
            meal_category : item.meal_category
          }

          m.push(newMeal);


          // delete date if not items exist for that date
          //if(deleteItem && ($localStorage.mealDates[dateSelected].length < 1)) delete $localStorage.mealDates[dateSelected];

        }
        console.log('end services : addItem');

      }


      cart.getItemByIndex = function(index){

        var items = cookies.get(this.itemsCookie);
        return items[index];

      }

      cart.updateQuantity = function(index, qty){


        // local storage ------------>
        if(!$localStorage.mealDates){
          //console.log('Storage does not exist. Creating it now.');
          $localStorage.mealDates = {};
        }
        var mealDates = $localStorage.mealDates;

      }

      /*removeItem: function(index){
        //var dateSelected = cookies.get(TFD.PREFIX+'dateSelected');
        var dateSelected = $.cookie(TFD.PREFIX+'dateSelected');

      },*/

      // set meal ids and names for reference
    /*  setMealIds: function(items){
        //console.log(items);

        // local storage ------------>
        if(!$localStorage.mealsRef){
          //console.log('Storage does not exist. Creating it now.');
          $localStorage.mealsRef = {};
          var m = {};
          $.each(items, function(key, mealObj) { // loop dates
            $.each(mealObj.meals, function(mealKey, mealData) {
              m[mealData.meal_id] = mealData.long_name;
            });
          });
          $localStorage.mealsRef = m;
        }

        var m = $localStorage.mealsRef;
        //console.log(m);
        //console.log(Object.keys(m).length);

        // check for meal_id
        if(Object.keys(m).length > 0){
          $.each(items, function(key, mealObj) { // loop dates
            $.each(mealObj.meals, function(mealKey, mealData) {
            var itemExists = false;
              if(mealData.meal_id in m){
                //console.log('exists');
              }else{
                //console.log('not exists');
                m[mealData.meal_id] = mealData.long_name;
              }
            });
          });
        }
        $localStorage.mealsRef = m;
      },*/

      // clear all local storage (cart) 
      cart.reset = function(){
        $localStorage.$reset();

      }



    
    return cart;


  }])

.service('allIngredients', function($rootScope, $http)  {
    
   var  allIngredients = {};

    this.get = function(promo) {
    var ingredients = $http.get('/apiController.php?fn=get_ingredients&promo='+promo);
    
return ingredients;
   // return angular.fromJson(ingredients);
  }
})

.service('dislikes', function($rootScope, $localStorage){
	
	var loaded={};
		
  loaded.getDislikes = function(ingredients){
	
	var loadedIds=[];
	if ($localStorage.dislikes != undefined){
        	for (i=0; i< $localStorage.dislikes.length; i++){
                	loadedIds.push($localStorage.dislikes[i]['idFood']);
       	 	}
	}
	
	$.each(ingredients, function(key,value){
		if($.inArray(value.idFood,loadedIds) == -1){
			ingredients[key]['selected']=false;
		} else {
			ingredients[key]['selected']=true;
		}
		
		if(value.icon == null || value.icon=="" || value.icon=="0"){
			ingredients[key]['icon']='//static.thefreshdiet.com/images/nutrition/fnf.jpg';
		} else{
			ingredients[key]['icon']="//static.thefreshdiet.com/images/icons/food/" + value.icon
		}
	});
	return ingredients;
  }
	return loaded;
})

.service('CalEvents', ['TFD', '$rootScope', '$http', '$filter', '$cookieStore', '$localStorage', function(TFD, $rootScope, $http, $filter, cookies, $localStorage){
    
   var calEvent = {};
    
   calEvent.setStyles = function(events, styles){
    //console.log(events);
    $.each(events, function(k, v){
      //console.log(v.has_meals);
      if(v.has_meals == true){
        v.color = styles.hasMeals.color;
        v.textColor = styles.hasMeals.textColor;
      }else{
        v.color = styles.noMeals.color;
        v.textColor = styles.noMeals.textColor;
      }
    });

    return events;
   }


   return calEvent;


  }])


;
