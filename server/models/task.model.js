'use strict';

let db = require('...');

module.exports = db.define('game', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    points: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    pledge: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});