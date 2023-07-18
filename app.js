const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const neo4j = require('neo4j-driver');
const bcrypt = require('bcrypt');
const app = express();
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const driver = neo4j.driver(
  'neo4j://localhost:7687',
  neo4j.auth.basic('neo4j', '12345678'),
  { disableLosslessIntegers: true }
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('node_modules'));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post('/signup', function(req, res) {
  const { username, email, password } = req.body;

  const session = driver.session();

  // Hash the password
  bcrypt.hash(password, 10, function(err, hashedPassword) {
    if (err) {
      console.error('Error hashing password:', err);
      res.redirect('/signup/error');
      return;
    }

    // Create a new user node in the Neo4j database
    session
      .run(
        'CREATE (u:User {username: $username, email: $email, password: $password, createdAt: TIMESTAMP(), createdBy: $username}) WITH u MATCH (l:Level), (u:User) WHERE l.label = "user" AND u.username = $username CREATE (l)-[:HAS_USER]->(u) RETURN u ',
        { username, email, password: hashedPassword }
      )
      .then(result => {
        // Close the session
        session.close();

        // Redirect to the success page or any other desired route
        res.redirect('/signup/success');
      })
      .catch(error => {
        console.error('Error creating user:', error);

        // Close the session
        session.close();

        // Handle the error and redirect to an error page or show an error message
        res.redirect('/signup/error');
      });
  });
});

app.get('/getall', function(req, res, next) {
  var session = driver.session();
  session
    .run('MATCH (n) RETURN n', {})
    .then(result => {
      var dataArray = [];
      result.records.forEach(function(rec) {
        dataArray.push(rec.get(0).properties);
      });
      console.log(dataArray);
      res.json(dataArray);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    })
    .finally(() => {
      session.close();
    });
});

// ...

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
