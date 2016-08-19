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
        get: function() {
            var now = new Date();
            if (this.start > now && !(this.locked)) {
                return 'Pending';
            }
            if (this.start > now && this.locked) {
                return 'Confirmed';
            }
            if (this.end > now) {
                return 'Active';
            }
            return 'Complete';
        }
    }
});
