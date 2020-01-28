//REQUIRES 
var express = require('express');
var mongoose = require('mongoose');
//Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var bodyParser = require('body-parser')


//Inicializar variables

var app = express();

//body parser 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, resp) => {

    if (err) throw err;
    console.log('Base de datos: \x1b[45m', 'online')
});

//Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

//Escuchar peticiones

app.listen(3000, () => {
    console.log('Express Server corriendo en el puerto 3000 : \x1b[45m', 'online')
});