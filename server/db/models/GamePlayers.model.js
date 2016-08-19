'use strict';

let db = require('../_db');
var Sequelize = require('sequelize');

module.exports = db.define('GamePlayers',{
  status: {
    type: Sequelize.ENUM("Invited", "Unconfirmed", "Confirmed")
  }
})
