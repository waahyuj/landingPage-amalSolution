const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const neo4j = require('neo4j-driver');
const bcrypt = require('bcrypt');
const session = require('express-session')
const app = express();
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const driver = neo4j.driver(
  'neo4j://localhost:7687',
  neo4j.auth.basic('neo4j', '12345678'),
  { disableLosslessIntegers: true }
);
const cookieSer = require('./lib/cookie');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('node_modules'));
app.use (session({
  secret: 'some secret',
  cookie: {maxAge: 30000},
  saveUninitialized: false
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post('/login', function(req, res) {

  const session = driver.session();

  session
    .run('MATCH (u:User {username: $username}) RETURN u', { username:req.body.username })
    .then(result => {
      // Check if the user exists
      // if (result.records.length === 0) {
      //   // User not found, redirect to an error page or show an error message
      //   res.redirect('/signin/error');
      //   return;
      // }

      const user = result.records[0].get('u');
      
      res.cookie(
        'landing_page_amal',
        cookieSer.ser({
          email: user.properties.email,
          username: user.properties.username,
        })
      )

      // Compare the hashed password stored in the database with the provided password
      // bcrypt.compare(decodedPassword, user.properties.password, function(err, isMatch) {
      //   if (err) {
      //     console.error('Error comparing passwords:', err);
      //     res.redirect('/signin/error');
      //     return;
      //   }

      //   if (isMatch) {
      //     console.log(user)
      //     res.redirect('/signin/success');
      //   } else {
      //     // Passwords do not match, user authentication failed
      //     res.redirect('/signin/error');
      //   }
      // });
    })
    .catch(error => {
      console.error('Error finding user:', error);

      // Close the session
      session.close();

      // Handle the error and redirect to an error page or show an error message
      res.redirect('/signin/error');
    });
});

app.use(function (req, res, next) {
  const ck = req.cookies['landing_page_amal']
  console.log(ck)
  console.log("ck")
  if (ck) {
    const cookie = cookieSer.dser(req.cookies['landing_page_amal'])

    console.log(cookie)
    console.log("1")
    return next()
  }else{
    res.clearCookie('landing_page_amal')
    console.log("2")
    return next()
  }
})

//SIGNIN FUNCTION
app.post('/signin', function(req, res) {
  const { username, password } = req.body;
  const decodedPassword = Buffer.from(password, 'base64').toString('utf-8');

  const session = driver.session();

  // Retrieve the user from the Neo4j database based on the provided username

});


//SIGNUP FUNCTION
app.post('/signup', function(req, res) {
  const { username, email, password } = req.body;
  const decodedPassword = Buffer.from(password, 'base64').toString('utf-8');

  const session = driver.session();

  // Hash the password
  bcrypt.hash(decodedPassword, 10, function(err, hashedPassword) {
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