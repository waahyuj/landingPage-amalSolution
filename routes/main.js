// routes/main.js

const express = require('express');
const router = express.Router();
const neo4j = require('neo4j-driver');

// Read route
router.get('/products', function(req, res) {
  const driver = neo4j.driver("bolt://localhost:7474", neo4j.auth.basic("neo4j", "12345678"));
  const session = driver.session();

  session
    .run('MATCH (p:Product {id: 0}) RETURN p')
    .then(result => {
      const products = result.records.map(record => record.get('p').properties);
      res.send(products);
    })
    .catch(error => {
      console.log(error);
      res.status(500).send('Error retrieving products');
    })
    .finally(() => {
      session.close();
      driver.close();
    });
});

module.exports = router;
