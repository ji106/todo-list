var express = require('express');
var router = express.Router();
var authMiddleware = require('../middlewares/auth');
var Database = require('../data/database');
const UsuarioDAO = require("../data/usuario-dao");
const TareaDAO = require('../data/tarea-dao');

// Inicio la base de datos y los daos necesarios

var db = Database.getInstance("db.sqlite");
var dao = new UsuarioDAO(db);
var datoTareas = new TareaDAO(db);

/**
 * Ruta GET /
 * Muestra la página principal (home)
 */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/**
 * Ruta GET /contact
 * Muestra la página de contacto
 */
router.get('/contact', function (req, res, next) {
  res.render('contact', {});
});

/**
 * Ruta GET /login
 * Muestra el formulario de login
 */
router.get('/login', function (req, res, next) {
  res.render('login', {});
});

/**
 * Ruta POST /login
 * Procesa el formulario de login, verifica credenciales y crea la sesión si son válidas
 */
router.post('/login', function (req, res, next) {
  const user = dao.findUserByEmail(req.body.name);

  if (!user) res.render('index', { title: 'Express' });

  if (req.body.password === user.password) {
    req.session.user = { email: user.email, id: user.id };
    res.redirect("/admin")
  } else {
    res.render('index', { title: 'Express' });
  }
});

/**
 * Ruta GET /logout
 * Cierra la sesión del usuario y redirige al home
 */
router.get('/logout', function (req, res, next) {
  req.session.user = null;
  res.redirect('/');
});

/**
 * Ruta GET /admin
 * Muestra la página de administración (requiere autenticación)
 * Muestra las tareas del usuario autenticado
 */
router.get('/admin', authMiddleware, function (req, res, next) {
  // hacer una consulta a la base de datos
  let salida = datoTareas.findTareasByUserId(req.session.user.id)
  console.log(salida);

  res.render('admin', { title: 'Express', user: req.session.user, layout: 'layout-admin', tareas: salida });
});

/**
 * Ruta GET /temp
 * Ruta de prueba temporal, devuelve "ok"
 */
router.get('/temp', function (req, res, next) {
  res.send("ok");
});


// Ruta POST /tareas/insertar
// Esta ruta recibe los datos del formulario para insertar una nueva tarea

router.post("/tareas/insertar", authMiddleware, function (req, res, next) {
  // req.body contiene los datos enviados desde el formulario de nueva tarea

  // Se crea un objeto "tarea" con la información proporcionada por el usuario autenticado
  let tarea = {
    id_usuario: req.session.user.id, // ID del usuario autenticado
    titulo: req.body.titulo,         // Título de la tarea
    descripcion: req.body.descripcion, // Descripción de la tarea
  }

  // Se guarda la tarea en la base de datos usando el DAO
  datoTareas.saveTarea(tarea.id_usuario, tarea.titulo, tarea.descripcion);

  // Luego de guardar, se redirige al panel de administración
  res.redirect("/admin");
});

module.exports = router;