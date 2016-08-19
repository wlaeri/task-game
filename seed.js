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
var Event = db.model('event');
var Promise = require('sequelize').Promise;

var seedDataUsers = require('./seedData/seed.users.js');
var seedDataNotStartedGames = require('./seedData/seed.notStartedGames.js');
var seedDataStartedGames = require('./seedData/seed.startedGames.js');
var seedDataTasks = require('./seedData/seed.tasks.js');

var seedUsers = function () {

    var users = seedDataUsers.users;

    var creatingUsers = users.map(function (userObj) {
        return User.create(userObj);
    });

    return Promise.all(creatingUsers);

};

var seedGames = function () {

    var notStartedGames = seedDataNotStartedGames.games;
    var startedGames = seedDataStartedGames.games;

    var creatingGames = notStartedGames.map(function (gameObj) {
        return Game.create(gameObj);
    }).concat(startedGames.map(function(gameObj) {
        return Game.create(gameObj);
    }));

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
    var creatingAssociations = games.map(function(game) {
        var users = randomArrayGenerator(5, 10, 1, 100);
        return game.setCommissioner(users[0])
        .then(function() {
            if (game.status === 'Active' || game.status === 'Completed') {
                return game.setUsers(users, {
                    status: 'Confirmed'
                });
            }
            if (game.status === 'Confirmed') {
                if (Math.random() < 0.5) {
                    return game.setUsers(users, { status: 'Unconfirmed' });
                } else {
                    return game.setUsers(users, { status: 'Confirmed' })
                }
            }
            if (game.status === 'Pending') {
                if (Math.random() < 0.5) {
                    return game.setUsers(users, { status: 'Invited' });
                } else {
                    return game.setUsers(users, { status: 'Unconfirmed' });
                }
            }
        });
    });

    return Promise.all(creatingAssociations);
}

var createTaskGameAssociations = function(tasks) {
    // tasks is an array of all tasks in db
    var count = 0;
    var creatingAssociations = tasks.map(function(task, index) {
        if (index % 5 === 0) {
            count++;
        }
        return task.setGame(count);
    });

    return Promise.all(creatingAssociations);
}

function randomArrayIndex(arr) {
    return Math.floor(Math.random() * (arr.length - 0));
}

var createEvents = function(games) {
    var events, length;

    var creatingEvents = games.map(function(game) {
        if (game.status === 'Pending' || game.status === 'Confirmed') {
            return [];
        }
        return Promise.all([game.getTasks(), game.getUsers()])
        .spread(function(gameTasks, gameUsers) {
            events = [];
            length = randomNumInRange(0, 20);
            for (var i = 0; i < length; i++) {
                events.push({
                    task: gameTasks[randomArrayIndex(gameTasks)],
                    user: gameUsers[randomArrayIndex(gameUsers)]
                });
            }
            return;
        })
        .then(function() {
            var eventCreation = events.map(function(event) {
                return Event.create({
                    gameId: game.id,
                    completedById: event.user.id,
                    taskId: event.task.id
                });
            })

            return Promise.all(eventCreation);
        })

    })

    return Promise.all(creatingEvents);
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
    .then(function() {
        return Task.findAll();
    })
    .then(function(tasks) {
        return createTaskGameAssociations(tasks);
    })
    .then(function() {
        return Game.findAll();
    })
    .then(function(games) {
        return createEvents(games);
    })
    .then(function () {
        console.log(chalk.green('Seed successful!'));
        process.exit(0);
    })
    .catch(function (err) {
        console.error(err);
        process.exit(1);
    });
