orderApp.directive('datepicker', function(){
  return {
    restrict: 'A',
    require: 'ngModel',
    controller: function($scope, $http) {
        },
    link: function (scope, element, attr, ngModelCtrl) {

      scope.$watch('order', function() {
      
        $(function() {
          if (angular.isUndefined(scope.order))
            return;

          var stringStartDate = scope.order.start_date.toString();
          var dateArray = stringStartDate.split("-");
          var newJDate = dateArray[1]+'/'+dateArray[2]+'/'+dateArray[0];

          var inDays = function(d1, d2) {
            var t2 = d2.getTime();
            var t1 = d1.getTime();

            return parseInt((t2-t1)/(24*3600*1000));
          };

          var sql2JsDate = function(d) {
            var d = d.split('-');
            return d[1] + '-' + d[2] + '-' + d[0];
          };

          var startDateObj = new Date( sql2JsDate(newJDate) );
          var startDatePlusOne = startDateObj.setDate( startDateObj.getDate() + 1 );
          
          var minDate = inDays( 
            new Date(), 
            new Date( startDatePlusOne ) 
          );

          element.datepicker({
            beforeShowDay: function(date) {
              switch(parseInt(scope.promotion.diet)) {
                case 8:
                  if (scope.isMap && scope.promotion.program_days == 31 && date.getDay() == 0) return [false];
                  return [(date.getDay() == 0 || date.getDay() == 4) ? true : false];
                  break;
                case 15:
                  return [true];
                  break;
                default:
                  return [true];
                  break;
                }
            },
            dateFormat: "yy-mm-dd",
            minDate: minDate,
            //showOn: "button",
            //buttonImage: "assets/img/calendar.gif",
            //buttonImageOnly: true,
            onSelect: function(date) {
              scope.$apply(function() {
                ngModelCtrl.$setViewValue(date)
              });
            }
          }); 

        });
      });
    }
  }
});
