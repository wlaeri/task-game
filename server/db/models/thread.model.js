'use strict';

let db = require('../_db');
var Sequelize = require('sequelize');

module.exports = db.define('thread', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  games: {
    type: Sequelize.ARRAY(Sequelize.INTEGER),
    allowNull: false
  }
});
