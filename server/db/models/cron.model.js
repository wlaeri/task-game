'use strict';

let db = require('../_db');
var Sequelize = require('sequelize');

module.exports = db.define('cron', {
    startDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    endDate: {
        type: Sequelize.DATE,
        allowNull: false
    }
});
