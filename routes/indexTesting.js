var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const common = res.locals.common
  res.render('indexTesting', {
    data: common
  });
});

module.exports = router;
