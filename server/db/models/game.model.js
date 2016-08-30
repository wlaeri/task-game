'use strict';

let db = require('../_db');
let Sequelize = require('sequelize');
let Task = require('./task.model.js');
let Cron = require('./cron.model.js');
let GamePlayers = require('./GamePlayers.model.js');

module.exports = db.define('game', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    start: {
        type: Sequelize.DATE,
        allowNull: false
    },
    end: {
        type: Sequelize.DATE,
        allowNull: false
    },
    pledge: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    locked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    status: {
        type: Sequelize.ENUM('Pending', 'Confirmed', 'Active', 'Completed'),
        get: function() {
            var now = new Date();
            if (this.start > now && !(this.locked)) {
                return 'Pending';
            }
            if (this.start > now && this.locked) {
                return 'Confirmed';
            }
            if (this.end > now) {
                return 'Active';
            }
            return 'Completed';
        }
    }
}, {
    instanceMethods: {
        addPlayersSetComm: function(users, commissioner) {
            //Sets players status within the GamePlayers table as part of this game
            //Returns all of the users on the game
            let invited = users.invited.map(user => user.id);
            return this.addUsers(invited, { status: 'Invited' })
            .tap(() => this.addUsers(commissioner, { status: 'Unconfirmed'}))
            .tap(() => this.setCommissioner(commissioner))
            .then(() => this.getUsers())
        },
        addPlayersGameUpdate: function(usersObj, currGPs, isLocked, commissioner) {
            let alreadyInvited = currGPs.filter(gp => gp.status === 'Invited').map(gp => gp.id);
            let newInvites = usersObj.invited.map(user => user.id).filter(user => alreadyInvited.indexOf(user) === -1 );
            this.addUsers(newInvites, { status: 'Invited' })
            .then(() => {
                if (isLocked) {
                    return GamePlayers.findOne({
                        where: {
                            gameId: this.id,
                            userId: commissioner
                        }
                    })
                    .then(gp => {
                        gp.update({ status: 'Confirmed' });
                        return gp;
                    })
                } else { return; }
            })
        },
        updateTasks: function(incomingTasks) {
            Promise.all(incomingTasks.map(task => {
                if (task.id) { delete task.id; }
                return Task.create(task);
            }))
            .then(tasks => {
                this.setTasks(tasks.map(task => task.id));
            })
        },
        updateGameFromReqBody: function(input) {
            let updatedGame = Object.assign({}, input);
            delete updatedGame.users;
            delete updatedGame.tasks;
            delete updatedGame.events;
            return this.update(updatedGame);
        },
        createCron: function() {
            Cron.create({
                startDate: this.start,
                endDate: this.end
            })
            .then(cron => cron.setGame(this.id))
        }
    }
});
