var express = require('express');
var router = express.Router();
var finale = require('finale-rest')
var db = require('../models/index');

/*
    *** API LIST ***
    GET -> /api/subjects -> restituisce la lista delle lezioni -> se si aggiunge al path ?startDate=blablabla&endDate=blablabla filtra per data
    GET -> /api/subjects/:id -> restituisce la singola materia
    DELETE -> /api/subjects/:id -> elimina la singola prenotazione
    PUT -> /api/subjects/:id -> modifica dettagli della materia
    POST -> /api/subjects -> body:{campi della tabella} -> crea una materia
*/  

module.exports = function () {

    // Initialize finale
    finale.initialize({
        app: router,
        sequelize: db
    });

    // Create REST resource
    finale.resource({
        model: db.subjects,
        endpoints: ['/','/:id'], //MANAGE GET, POST, PUT, DELETE
        include: [{
            model:db.lectures, as:'lectures'
        }]
    });
    
    return router;
}