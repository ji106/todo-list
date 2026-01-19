var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
var expressSession = require('express-session');

var authMiddleware = require('./middlewares/auth');

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);


// Middleware para hacer logging de cada petición entrante.
// Esta función se ejecuta en cada solicitud HTTP recibida por el servidor.
// req: el objeto de la solicitud (request).
// res: el objeto de la respuesta (response).
// next: función para pasar el control al siguiente middleware.
app.use((req, res, next) => {
  console.log(`Nueva peticion en ${req.hostname} a las ${(new Date()).toISOString()} `)
  // Llama a next() para que Express continúe con el siguiente middleware o ruta.
  next()
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
  secret: 'mi-clave-secreta-supersegura',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Si usas HTTPS, cambia a true
}));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;