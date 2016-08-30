'use strict';


let db = require('../_db');
var Sequelize = require('sequelize');

module.exports = db.define('task', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT
    },
    points: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});
