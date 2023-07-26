var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  
  const ck = req.cookies['landing_page_amal']
  console.log(ck)
  console.log("ck")
  res.render('index', { title: 'Express' });
});

module.exports = router;
