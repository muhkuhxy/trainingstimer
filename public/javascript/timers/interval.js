var timerApp = angular.module('timers', []);

timerApp.controller('intervalTimer', ['$scope', '$timeout', '$filter', function($scope, $timeout, $filter) {
   var sets = 3, startedOn, pause, started, setFinished,
      dateFilter = $filter('date'),
      resetClockVars = function() {
         pause = false;
         started = true;
         startedOn = Date.now();
      },
      ticking = function() {
         return !$scope.done;
      };
   $scope.intervalLengthMin = 3;
   $scope.intervalLengthMs = $scope.intervalLengthMin*60*1000;
   $scope.sets = [];
   $scope.clock = '00:00,0';
   function updateClock() {
      var now = Date.now(),
         clockValue = pause ? startedOn + $scope.intervalLengthMs - now : now - startedOn;
      if( clockValue < 0 ) {
         if(!pause) throw new Error("clockValue became negative, but not in countdown mode");
         resetClockVars();
         clockValue = 0;
      }
      $scope.clock = dateFilter(clockValue, 'mm:ss,sss').substr(0, 7);
      if(setFinished) {
         finishSet();
         pause = true;
         setFinished = false;
      }
      if(ticking()) {
         $timeout(updateClock, 100);
      }
   }
   function finishSet() {
      $scope.sets.push({ reps: 6, time: $scope.clock });
      $scope.done = $scope.sets.length >= sets;
   }
   $scope.start = function() {
      if(!started) {
         resetClockVars();
         updateClock();
      }
   };
   $scope.stop = function() {
      if(!pause && !setFinished) {
         setFinished = true;
      }
   };

}]);

