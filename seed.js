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
'use strict';

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

function randomNumInRange(min, max) {
    return Math.floor(Math.random() * (max- min + 1)) + min;
}

function randomArrayGenerator(minLength, maxLength, minNum, maxNum) {
    var length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    var arr = [];

    for (var i = 0; i < length; i++) {
        var num = randomNumInRange(minNum, maxNum);
        while (arr.indexOf(num) > -1) {
            num = randomNumInRange(minNum, maxNum);
        }
        arr.push(num);
    }

    return arr;
}

var createGameUserAssociations = function(games) {
    // games is an array of all games in db
    var creatingAssociations = games.map(function(game) {
        var users = randomArrayGenerator(5, 10, 1, 100);
        return game.setCommissioner(users[0])
            .then(function() {
                return game.setUsers(users);
            })
        // return game.setUsers(users)
    });

    return Promise.all(creatingAssociations);
}

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
    .then(function() {
        return Game.findAll();
    })
    .then(function(games) {
        return createGameUserAssociations(games);
    })
    .then(function () {
        console.log(chalk.green('Seed successful!'));
        process.exit(0);
    })
    .catch(function (err) {
        console.error(err);
        process.exit(1);
    });
