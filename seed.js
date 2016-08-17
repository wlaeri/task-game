/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var chalk = require('chalk');
var db = require('./server/db');
var User = db.model('user');
var Game = db.model('game');
var Task = db.model('task');
var Promise = require('sequelize').Promise;

var seedDataUsers = require('./seedData/seed.users.js');
var seedDataGames = require('./seedData/seed.games.js');
var seedDataTasks = require('./seedData/seed.tasks.js');

var seedUsers = function () {

    var users = seedDataUsers.users;

    var creatingUsers = users.map(function (userObj) {
        return User.create(userObj);
    });

    return Promise.all(creatingUsers);

};

var seedGames = function () {

    var games = seedDataGames.games;

    var creatingGames = games.map(function (gameObj) {
        return Game.create(gameObj);
    });

    return Promise.all(creatingGames);

};

var seedTasks = function () {

    var tasks = seedDataTasks.tasks;

    var creatingTasks = tasks.map(function (taskObj) {
        return Task.create(taskObj);
    });

    return Promise.all(creatingTasks);

};

db.sync({ force: true })
    .then(function () {
        return seedUsers();
    })
    .then(function() {
        return seedGames();
    })
    .then(function() {
        return seedTasks();
    })
    .then(function () {
        console.log(chalk.green('Seed successful!'));
        process.exit(0);
    })
    .catch(function (err) {
        console.error(err);
        process.exit(1);
    });
