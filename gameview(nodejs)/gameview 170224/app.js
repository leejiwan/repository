var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var passport = require('passport');
var redis = require('redis');
var redisClient = redis.createClient();
var RedisStore = require('connect-redis')(session);

var notice = require('./routes/notice')
var members = require('./routes/members');
var auth = require('./routes/auth');
var reviews = require('./routes/reviews');
var game = require('./routes/game');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb'}))
// express 설정 코드 (여기서부터)
app.use(logger('dev'));
app.use(bodyParser.json()); //얘는 미들웨어를 리턴.
app.use(bodyParser.urlencoded({ extended: false }));//extended의 false와 true의 차이?
app.use(cookieParser('2449d10c-a055-4d93-885c-d89c89a85fd2'));

 app.use(session({
      secret: '2449d10c-a055-4d93-885c-d89c89a85fd2',//쿠키에 암호화된 키를 넘겨줌
      store: new RedisStore({ //세션 정보를 redis에 넣음
        host: "127.0.0.1",
        port: 6379,
        client: redisClient
      }),
      resave: true,
      saveUninitialized: false,
      cookie: {
        path: '/',
       httpOnly: true,
        secure: true, maxAge: 1000* 60 * 60 * 24 * 30
     } //이 쿠키는 30일간 유효함 (밀리세컨드(1000이 1초), 60초, 60분, 24시간, 30일)
   }));
app.use(passport.initialize()); //초기화된 프레임워크에 접근할 수 있는 미들웨어를 반환한다.
app.use(passport.session()); //이것을 통해 express.session이 관장하는 redis와의 연동이 passport가 역할을 하게 됨
app.use(express.static(path.join(__dirname, 'public')));
//static 으로 img url service 만듬
//app.use(express.cookieParser('2449d10c-a055-4d93-885c-d89c89a85fd2'));


//(여기까지 다 next호출)

app.use('/auth', auth);
app.use('/members', members);
app.use('/reviews', reviews);
app.use('/game', game);


app.use('/notice', notice)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found app');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500); //최소한 클라이언트에서의 오류인지 서버에서의 오류인지 코드를 보내줘야 함
  res.json({
    error:{
      message: err.message,
      status: err.status,
      //stack: err.stack //스택은 json으로 뿌리면 지저분
    }
  });
});

module.exports = app;


