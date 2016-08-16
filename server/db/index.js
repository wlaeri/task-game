'use strict';
var db = require('./_db');

db.User = require('./models/user.model.js');
db.Game = require('./models/game.model.js');
db.Task = require('./models/task.model.js');
db.Event = require('./models/event.model.js');

db.Thread = require('./models/thread.model.js');



// db.User.hasMany(db.Game);
// db.User.hasMany(db.Event, {as: 'completedTask'});


// db.User.hasMany(db.Game);
// db.User.hasMany(db.Event, {as: 'db.Task'});

db.Game.belongsTo(db.User, {as: 'commissioner'});
db.Game.belongsToMany(db.User, {through: 'GamePlayers'});
db.Game.hasMany(db.Task);
db.Game.hasMany(db.Event);

db.Task.belongsTo(db.Game);
// db.Task.hasMany(db.Event);



db.Event.belongsTo(db.User, {as: 'completedBy'});
db.Event.belongsTo(db.Game);
db.Event.belongsTo(db.Task);

db.Game.belongsToMany(db.Thread, {through: 'threadGames'});


module.exports = db;



