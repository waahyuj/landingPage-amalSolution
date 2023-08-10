var express = require('express');
var router = express.Router();

const neo4j = require('neo4j-driver');
const driver = neo4j.driver(
  'neo4j://localhost:7687',
  neo4j.auth.basic('neo4j', '12345678'),
  { disableLosslessIntegers: true }
);

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
  const session = driver.session();
  const resultdata = []
  session
      .run(
        'MATCH (p:Player) RETURN p.name AS name, p.salary AS salary, p.contract AS contract, p.status AS status',
      )
      .then(result => {
        result.records.map(record => {
          resultdata.push({
            name: record.get('name'),
            salary: record.get('salary'),
            contract: record.get('contract'),
            status: record.get('status')
          });
        });
        session.close();
        const common = res.locals.common
        // alamat folder content tree
        res.render('menu/tree/index', {
          data: common, 
          resultdata: resultdata
        });
      })
      .catch(error => {
        console.error('Error creating user:', error);
        session.close();
        res.redirect('/');
      });
  
});

module.exports = router;
