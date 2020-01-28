//REQUIRES 
var express = require('express');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var mdAutentificacion = require('../middleware/auth');

//Inicializar variables

var app = express();
var Usuario = require('../models/usuario');

//Rutas

//
//  Obtener tdoso los usaurios 
//
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role').exec((err, usuarios) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error mamastruoso',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            usuarios: usuarios
        });

    });


});

//Crear un usuario 

app.post('/', mdAutentificacion.verificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        rol: body.rol
    });

    usuario.save((err, usuarioguardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            body: usuarioguardado
        });

    });

});



//actualizar usuario

app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id' + id + 'no existe',
                errors: { message: ' No existe un usuario con ese id' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;
        usuario.save((err, usuarioguardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioguardado.password = ':)';

            res.status(200).json({
                ok: true,
                usuarios: usuarioguardado
            });

        });

    });


});

//Eliminar usuarios

app.delete('/:id', (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioborrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioborrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe ningun usuario con ese id',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            usuarios: usuarioborrado
        });


    });


});

module.exports = app;