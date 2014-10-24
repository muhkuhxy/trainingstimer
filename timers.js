(function(w) {
   var inc, dec, roundCount = 1, reps = 1, repModMode = 1;

   function update(d) {
      var time = document.querySelector('#time');
      return function() {
         var num = parseInt(time.textContent, 10);
         //console.log(num);
         return time.textContent = d(num);
      }
   }
   var increase = update(function(val) {
      return val + 1;
   });
   var decrease = update(function(val) {
      return val - 1;
   });
   var repMod = function() {
      reps += repModMode;
      return reps;
   }

   function addRound() {
      var li = document.createElement('li');
      li.textContent = 'runde ' + roundCount + ', ' +
         reps + ' wiederholungen, ' +
         document.querySelector('#time').textContent + ' sekunden';
      rounds.appendChild(li);
      roundCount += 1;
   }

   var train = (function() {
      var start = document.querySelector('#start'),
         status = document.querySelector('#status'),
         round = document.querySelector('#round'),
         rounds = document.querySelector('#rounds');
      return function() {
         status.textContent = reps + ' wiederholung(en)';
         start.disabled = true;
         round.disabled = false;
         clearInterval(dec);
         inc = setInterval(increase, 1000);
         round.onclick = function() {
            clearInterval(inc);
            start.disabled = false;
            round.disabled = true;
            status.textContent = 'pause';
            addRound();
            dec = setInterval(function() {
               var t = decrease();
               if( t === 0 ) {
                  if( repMod() > 0 ) {
                     train();
                  } else {
                     clearInterval(dec);
                     round.disabled = true;
                     status.textContent = 'fertig';
                  }
               }
            }, 1000);
         };
      }
   })();
   document.querySelector('#start').onclick = train;
   document.querySelector('#peak').onclick = function() {
      repModMode = -1;
   };
   document.querySelector('#reset').onclick = function() {
      var ul = document.querySelector('#rounds');
      while(ul.firstChild) {
         ul.removeChild(ul.firstChild)
      }
      repModMode = reps = roundCount = 1;
   };
})(window)

