'use strict';

let user = require('./user.model.js');
let game = require('./game.model.js');
let task = require('./task.model.js');
let event = require('./event.model.js');

user.hasMany(game);
user.hasMany(event, {as: 'completedTask'});

game.hasOne(user, {as: 'commissioner'});
game.hasMany(user, {as: 'player'});
game.hasMany(task);
game.hasMany(event);

task.hasOne(game);
task.hasMany(event);

event.hasMany(user, {as: 'completedBy'});
event.hasOne(game);
event.hasOne(task);

module.exports = {
	user: user,
	game: game,
	task: task,
	event: event
};