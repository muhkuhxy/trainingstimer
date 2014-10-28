var log = require('debug')('trainingstimer')
module.exports.index = function(req, res) {
   log('render '+req.params.timer)
   res.render(req.params.timer, {
      title: "Tuerklimmzug"
   });
}
