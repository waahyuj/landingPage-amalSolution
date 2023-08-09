var express = require('express');
var router = express.Router();

/* direct untuk content header */
router.get('/contentHeader', function(req, res, next) {
  const common = res.locals.common
  // alamat folder content header
  res.render('menu/contentHeader/index', {
    data: common
  });
});

/* direct untuk content support */
router.get('/support', function(req, res, next) {
  const common = res.locals.common
  // alamat folder content support
  res.render('menu/support/index', {
    data: common
  });
});

/* direct untuk content tree */
router.get('/tree', function(req, res, next) {
  const common = res.locals.common
   // alamat folder content tree
  res.render('menu/tree/index', {
    data: common
  });
});

module.exports = router;
