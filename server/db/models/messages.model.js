'use strict';


let db = require('../_db');
var Sequelize = require('sequelize');

module.exports = db.define('message', {
    message: {
        type: Sequelize.TEXT,
        allowNull: false
    }, 
    gameId: {
    	type: Sequelize.INTEGER,
    	allowNull: false
    },
    username: {
    	type: Sequelize.STRING, 
    	allnowNull: false
    }
});