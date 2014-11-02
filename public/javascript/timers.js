var timerApp = angular.module('timers', []);

timerApp.filter('clock', ['$filter', function($filter) {
   var dateFilter = $filter('date');
   return function(timeMs) {
      return dateFilter(timeMs, 'mm:ss,sss').substr(0, 7);
   }
}]);

timerApp.controller('stepInterval', ['$scope', '$timeout', '$filter', function($scope, $timeout, $filter) {
   var startedOn, reps = repMod = 1, setFinished, superStartedOn,
      formatClock = $filter('clock'),
      resetClockVars = function() {
         $scope.pause = false;
         $scope.started = true;
         startedOn = Date.now();
      },
      ticking = function() {
         return !$scope.done;
      };
   $scope.state = 'idle';
   $scope.sets = [];
   $scope.clock = '00:00,0';
   $scope.superClock = '00:00,0';
   function previousSetTime() {
      // only called when length > 0
      return $scope.sets[$scope.sets.length - 1].time;
   };
   function updateClock() {
      var now = Date.now(),
         clockValue = $scope.pause ? startedOn + 2*previousSetTime() - now : now - startedOn,
         superClockValue = now - superStartedOn;
      if( now - superStartedOn > 7.5*60*1000 ) {
         $scope.done = true;
      }
      if( clockValue < 0 ) {
         if(!$scope.pause) throw new Error("clockValue became negative, but not in countdown mode");
         resetClockVars();
         reps += repMod;
         $scope.done = reps === 0;
         clockValue = 0;
      }
      $scope.clock = formatClock(clockValue);
      $scope.superClock = formatClock(superClockValue);
      if(setFinished) {
         finishSet(clockValue);
         $scope.pause = true;
         setFinished = false;
      }
      if(ticking()) {
         $timeout(updateClock, 100);
      }
   }
   function finishSet(setTime) {
      $scope.sets.push({ reps: reps, time: setTime });
   }
   $scope.start = function() {
      if(!$scope.started) {
         $scope.state = 'started';
         superStartedOn = Date.now();
         resetClockVars();
         updateClock();
      }
   };
   $scope.stop = function() {
      if(!$scope.pause && !setFinished) {
         setFinished = true;
      }
   };
   $scope.peak = function() {
      $scope.peaked = true;
      repMod = -1;
   }
}]);

timerApp.controller('intervalTimer', ['$scope', '$timeout', '$filter', function($scope, $timeout, $filter) {
   var sets = 3, startedOn, pause, setFinished,
      formatClock = $filter('clock'),
      resetClockVars = function() {
         pause = false;
         $scope.started = true;
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
      $scope.clock = formatClock(clockValue);
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
      if(!$scope.started) {
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

