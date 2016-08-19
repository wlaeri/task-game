'use strict';

let db = require('../_db');
var Sequelize = require('sequelize');

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
    locked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    status: {
        type: Sequelize.ENUM('Pending', 'Confirmed', 'Active', 'Complete'),
        defaultValue: 'Pending',
        get: function() {
            var now = new Date();
            return this.start < now && !this.locked ? 'Pending' : this.start < now && this.locked ? 'Confirmed' : this.end < now ? 'Complete' : 'Active';
        }
    }
});
