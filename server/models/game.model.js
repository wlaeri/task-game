'use strict';

let db = require('...');

module.exports = db.define('game', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    start: {
        type: Sequelize.DATE,
        allowNull: false
    },
    end: {
        type: Sequelize.DATE,
        allowNull: false
    },
    pledge: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    thread: {
        type: Sequelize.INTEGER
    }
});