module.exports = function(app) {
   var planCtrl = require('./controllers/planCtrl');
   app.get('/', planCtrl.index);

   var dayCtrl = require('./controllers/dayCtrl');
   app.get('/week/:week/day/:day', dayCtrl.index);

   var timerCtrl = require('./controllers/timerCtrl');
   app.get('/timer/:timer', timerCtrl.index);
}

