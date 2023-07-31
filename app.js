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

app.post('/login', function(req, res) {
  // tugas
  // 1. ketika post, get auth dulu ke DB
  // 2. sudah di get masukan data ke cookieSer
  res.cookie(
    'landing_page_amal',
    cookieSer.ser({
      email: 'user.properties.email',
      username: 'user.properties.username',
      name: 'user.properties.name',
      firstname: 'user.properties.firtname',
    })
  )
  console.log('masuk')
  console.log(req.cookies['landing_page_amal'])
  res.redirect('/')
});

//SIGNIN FUNCTION
app.post('/signin', function(req, res) {
  const { username, password } = req.body;
  const decodedPassword = Buffer.from(password, 'base64').toString('utf-8');

  const session = driver.session();

  // Retrieve the user from the Neo4j database based on the provided username

});

app.use(function (req, res, next) {
  const ck = req.cookies['landing_page_amal']
  console.log(ck)
  console.log("ck")
  // notes: console diatas melikat apakah ada cookie atau tidak, cokie akan berbentuk encode
  if (ck) {
    // notes: jika ada cookie akan masuk ke sini
    const cookie = cookieSer.dser(req.cookies['landing_page_amal'])
    console.log(cookie)
    // notes: console diatas untuk melihat data cookie yang telah di decode

    // notes: untuk fungsi dibawah masukan data cookie ke res agar dapat dipanggil di view
    res.locals.username = cookie.username
    res.locals.firstname = cookie.firstname
    res.locals.common = {
      username: cookie.username,
      user: cookie.firstname
    }
    return next()
  }else{
    // notes: jika tidak ada cookir akan masuk ke sini
    return next()
  }
})

app.use('/', indexRouter);
app.use('/users', usersRouter);

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