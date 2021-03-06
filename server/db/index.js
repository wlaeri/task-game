'use strict';
var db = require('./_db');

db.User = require('./models/user.model.js');
db.Game = require('./models/game.model.js');
db.Task = require('./models/task.model.js');
db.Event = require('./models/event.model.js');
db.Cron = require('./models/cron.model.js');
db.Message = require('./models/messages.model.js');

db.Thread = require('./models/thread.model.js');
db.GamePlayers = require('./models/GamePlayers.model.js');



// db.User.hasMany(db.Game);
// db.User.hasMany(db.Event, {as: 'completedTask'});


db.User.belongsToMany(db.Game, {through: db.GamePlayers});
// db.User.belongsToMany(db.Game, {as: "Invites", through: 'InvitedPlayers', foreignKey: "userId"});
// db.User.hasMany(db.Event, {as: 'db.Task'});

db.Game.belongsTo(db.User, {as: 'commissioner'});
db.Game.belongsToMany(db.User, {through: db.GamePlayers});
// db.Game.belongsToMany(db.User, {as: "Invitations", through: 'InvitedPlayers', foreignKey: "gameId"});
db.Game.hasMany(db.Task);
db.Game.hasMany(db.Event);

db.Task.belongsTo(db.Game);
// db.Task.hasMany(db.Event);
db.Cron.belongsTo(db.Game);



db.Event.belongsTo(db.User, {as: 'completedBy'});
db.Event.belongsTo(db.Game);
db.Event.belongsTo(db.Task);

db.Game.belongsToMany(db.Thread, {through: 'threadGames'});

db.Message.belongsTo(db.User, {as: 'author'});
db.Message.belongsTo(db.Game);
// db.Chat.hasMany(db.Message);
// db.Chat.belongsTo(db.Game);

module.exports = db;



