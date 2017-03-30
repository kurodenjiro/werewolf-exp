var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);



var index = require('./routes/index');
var users = require('./routes/users');
var event = require('./routes/event');
var publish = require('./routes/publish');
var login = require('./routes/login');
var signup = require('./routes/signup');
var users = require('./routes/users');
var games = require('./routes/games');
var gamePage = require('./routes/gamePage');
var test = require('./routes/test');
var tournament = require('./routes/tournament');
var uploadSuccess = require('./routes/uploadSuccess');
var app = express();
var db = require('./db');
var passport = require('passport');
require('./passport');
var flash = require('connect-flash');
var mysql = require('mysql')


var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'logo.png')));
app.use(logger('dev'))
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({ extended: false }))
   .use(cookieParser())
   .use(express.static(path.join(__dirname, 'public')))
   .use(session({
   	store: new RedisStore({
   		port: 6379,
   		host: 'localhost'
   	}),
   	secret: "egiang",
   	resave: false, 
   	saveUninitialized: false
   }))
   .use(flash())
   .use(passport.initialize())
   .use(passport.session())








app
	.use(index)
	.use(tournament)
	.use(login)
	.use(signup)
	.use(event)
	.use(publish)
	.use(users)
	.use(test)
	.use(uploadSuccess)
	.use(games)
	.use(gamePage)
	// .get('/users', (req, res, next) => {
	// 	db('users').then((users) => {
	// 		res.send(users);
	// 	}, next)
	// })
	// .get('/set', (req, res, next) => {
	// 	req.session.name = "peter";
	// 	res.send(req.session);
	// })
	// .post('/users', (req, res, next) => {

	// 	db('users')
	// 	.insert(req.body)
	// 	.then((userIds) => {
	// 		res.send(userIds);
	// 	}, next)
	// })
	// .put('/users/:id', (req, res, next) => {
	// 	const { id } = req.params;

	// 	db('users')
	// 	.where('id', id)
	// 	.update(req.body)
	// 	.then((result) => {
	// 		if (result === 0) {
	// 			return res.send(404)
	// 		}
	// 		res.send(200);
	// 	}, next)
	// })
	// .delete('/users/:id', (req, res, next) => {
	// 	const { id } = req.params;

	// 	db('users')
	// 	.where('id', id)
	// 	.delete(req.body)
	// 	.then((result) => {
	// 		if (result === 0) {
	// 			return res.send(404)
	// 		}
	// 		res.send(200);
	// 	}, next)
	// })
	// .get('/users/:id', (req, res, next) => {
	// 	const { id } = req.params;
	// 	db("users")
	// 	.where("id", id)
	// 	.first()
	// 	.then((users) => {
	// 		if (users == "") {
	// 			res.send('user not found')
	// 		} else {
	// 			res.send(users)
	// 		}
	// 	}, next)
	// })
	// app.use('/', index);
	// app.use('/users', users);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
