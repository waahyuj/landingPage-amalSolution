const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const neo4j = require('neo4j-driver');
const bcrypt = require('bcrypt');
const session = require('express-session')
const app = express();
// variable router, router bisa ditambah. notes penambahan router harus jelas dan jangan ngasal
const index = require('./routes/index');
const common = require('./routes/common');
// const indexTestingRouter = require('./routes/indexTesting');
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
app.use(session({
  secret: 'some secret',
  cookie: { maxAge: 30000 },
  saveUninitialized: false
}));

app.post('/login', function(req, res) {
  const { username, password } = req.body;

  const session = driver.session();
  //1. ketika post, get auth dulu ke DB (cari user berdasarkan data di neo4j)
  session
    .run('MATCH (u:User {username: $username}) RETURN u', { username })
    .then((result) => {
      session.close();

      if (!result.records.length) {
        // jika user tidak ada di database
        console.log('user belum terdaftar');
        return res.status(401).send('User belum terdaftar');
      }

      // Mengambil data user dari hasil query
      const user = result.records[0].get('u').properties;

      //2. Sudah di get masukkan data ke cookieSer
      const userData = {
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        createdBy: user.createdBy
      };

      res.cookie('landing_page_amal', cookieSer.ser(userData));

      console.log('Data pengguna:', userData);
      // res.redirect('/newPage');
      res.redirect('/');
    })
    .catch((error) => {
      session.close();
      console.error('Error executing Neo4j query:', error);
      res.status(500).send('Internal server error.');
    });
});

//option halaman ketika setelah berhasil login
app.get('/newPage', function(req, res) {
  res.send('Hello World!!!');
});

//halaman testing (testingPage)
app.get('/testingPage', function(req, res) {
  res.render('indexTesting'); 
});

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

    // membuat data user baru di database neo4j
    session
      .run(
        'CREATE (u:User {username: $username, email: $email, password: $password, createdAt: TIMESTAMP(), createdBy: $username}) WITH u MATCH (l:Level), (u:User) WHERE l.label = "user" AND u.username = $username CREATE (l)-[:HAS_USER]->(u) RETURN u ',
        { username, email, password: hashedPassword }
      )
      .then(result => {
        session.close();
        res.redirect('/');
      })
      .catch(error => {
        console.error('Error creating user:', error);
        session.close();
        res.redirect('/');
      });
  });
});

app.get('/logout', function (req, res) {
  res.clearCookie('landing_page_amal')
  res.redirect('/')
})

app.use(function (req, res, next) {
  const ck = req.cookies['landing_page_amal']
  console.log(ck)
  console.log("ck")
  // notes: console diatas melihat apakah ada cookie atau tidak, cokie akan berbentuk encode
  if (ck) {
    // notes: jika ada cookie akan masuk ke sini
    const cookie = cookieSer.dser(req.cookies['landing_page_amal'])
    console.log(cookie)
    // notes: console diatas untuk melihat data cookie yang telah di decode

    // notes: untuk fungsi dibawah masukan data cookie ke res agar dapat dipanggil di view
    res.locals.username = cookie.username
    res.locals.email = cookie.email
    res.locals.createdAt = cookie.createdAt
    res.locals.createdBy = cookie.createdBy
    res.locals.common = {
      username: cookie.username,
      email: cookie.email
    }
    return next()
  } else {
    // notes: jika tidak ada cookir akan masuk ke sini
    return next()
  }
});

// ketika menambah router daftarkan juga disini
app.use('/', index);
app.use('/common', common);

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
