var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const common = res.locals.common
  res.render('index', common);
  //res.render('index', { title: 'Express' });
});

module.exports = router;
