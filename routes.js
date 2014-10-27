module.exports = function(app) {
   var planCtrl = require('./controllers/planCtrl');
   app.get('/', planCtrl.index);

   var dayCtrl = require('./controllers/dayCtrl');
   app.get('/week/:week/day/:day', dayCtrl.index);
}

