'use strict';
var db = require('./_db');
module.exports = db;

let User = require('./models/user.model.js');
let Game = require('./models/game.model.js');
let Task = require('./models/task.model.js');
let Event = require('./models/event.model.js');



// User.hasMany(Game);
// User.hasMany(Event, {as: 'completedTask'});

Game.belongsTo(User, {as: 'commissioner'});
Game.belongsToMany(User, {through: 'GamePlayers'});
// Game.hasMany(Task);
// Game.hasMany(Event);

Task.belongsTo(Game);
// Task.hasMany(Event);

Event.belongsTo(User, {as: 'completedBy'});
Event.belongsTo(Game);
Event.belongsTo(Task);

