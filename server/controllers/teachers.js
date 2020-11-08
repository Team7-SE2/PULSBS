var express = require('express');
var router = express.Router();
var finale = require('finale-rest')
var db = require('../models/index');
const Op = db.Sequelize.Op;

module.exports = function () {

    // Initialize finale
    finale.initialize({
        app: router,
        sequelize: db
    });

    // Create REST resource
    /*var studentResource = finale.resource({
        model: db.users,
        endpoints: ['/', ],
        excludeAttributes: [
            "password","salt"
        ],
        // include: [{
        //     model: db.lectures,
        // }]
    });*/  

    return router;
}