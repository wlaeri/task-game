'use strict';
var db = require('./_db');
module.exports = db;

let user = require('./models/user.model.js');
let game = require('./models/game.model.js');
let task = require('./models/task.model.js');
let event = require('./models/event.model.js');

// Cyclicality error: User is dependent upon itself 


// user.hasMany(game);
// user.hasMany(event, {as: 'completedTask'});

// game.hasOne(user, {as: 'commissioner'});
// game.hasMany(user, {as: 'player'});
// game.hasMany(task);
// game.hasMany(event);

// task.hasOne(game);
// task.hasMany(event);

// event.hasMany(user, {as: 'completedBy'});
// event.hasOne(game);
// event.hasOne(task);

