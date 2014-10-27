module.exports.index = function(req, res) {
   res.render('timer', {
      title: "Timer",
      timer: req.param.timer
   });
}
