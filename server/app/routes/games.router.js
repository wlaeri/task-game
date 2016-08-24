const express = require('express');
const router = new express.Router();

const db = require('../../db');

const User = db.User;
const Game = db.Game;
const Task = db.Task;
const Event = db.Event;
const GamePlayers = db.GamePlayers;


router.get('/user/:id/completed', function(req, res, next) {
  User.findById(req.params.id)
  .then(user => {
    return user.getGames();
  })
  .then(games => {
    return games.filter(game => {
      return game.status === 'Completed';
    }).map(game => {
      return {id: game.id, name: game.name, start: game.start, end: game.end};
    })
  })
  .then(games => res.send(games));
})

router.get('/user/:id', function(req, res, next){
  User.findById(req.params.id)
  .then(user => {
    return user.getGames({
      include: [
        { model: Task },
        { model: Event },
        { model: User }
      ]
    });
  })
  .then(games => {
    return games.map(game => {
      return { id: game.id, name: game.name, status: game.status, commissionerId: game.commissionerId, locked: game.locked };
    });
  })
  .then(games => res.send(games))
  .catch(next);
})


router.get('/:id', function(req, res, next){
  Game.findById(req.params.id, {
    include: [{model: Task}, {model: Event}, {model: User}]
            })
  .then(game=> {
    console.log('******** Got to this point');
    res.send(game)
  })
  .catch(next);
})

router.post('/', function(req, res, next){
  let invitedPlayers = req.body.players.invited.map(u=>+u.id);
  console.log(invitedPlayers);
  Game.create(req.body.game)
  .tap(game=>game.addUsers(invitedPlayers, {
    status: "Invited"
  }))
  .tap(game=>game.addUsers(req.body.players.unconfirmed[0].id, {
    status: "Unconfirmed"
  }))
  .tap(game=>game.setCommissioner(req.body.commissioner))
  .tap(game=>{
    let taskProms = req.body.tasks.map(taskObj=>Task.create(taskObj));
    Promise.all(taskProms)
    .then(function(tasks){
        return tasks.map(function(task) {
          return task.setGame(game.id);
        })
    });
  })
  .then(game=> res.send({id: game.id}))
  // .then(game=>) add email invites here
  .catch(next)
})

router.put('/', function(req, res, next){
  console.log(req.body);
  let invitedPlayers = req.body.users.invited.map(u=>+u.id);

  GamePlayers.findAll({
    where: {
      gameId: req.body.id
    }
  })
  .then(function(gamePlayers){
    let prevInvitedPlayers = gamePlayers.filter(gamePlayer => {
      return gamePlayer.status === 'Invited';
    })
    .map(player => player.id)

    let newInvites = invitedPlayers.filter(player =>{
      return prevInvitedPlayers.indexOf(player) === -1;
    })

    return Game.findById(req.body.id, {
      include: [{
        model: Task
      }]
    })
    .tap(function (game){
      game.addUsers(newInvites, {status: 'Invited'})
    })
  })
  .tap(function (game){
    let newTasks = req.body.tasks.map(task => {
      if (task.id) {
        delete task.id;
      }
      if (!task.gameId) {
        task.gameId = game.id
      }
      return task;
    });
    console.log(newTasks);
    console.log('Here be the game as it exists prior to adding new tasks', game);
    Task.destroy({
      where: {
        gameId: game.id
      }
    })
    .then(function() {
      return newTasks.map(task => {
        Task.create(task);
      })
    })
  })
  .then(function (game){
    let updatedGame = Object.assign({}, req.body);
    delete updatedGame.users;
    delete updatedGame.tasks;
    delete updatedGame.events;
    return game.update(updatedGame)
  })
  .tap(function (updatedGame){
    console.log('*********** This is the updatedGame', updatedGame)
    res.sendStatus(200);
  })
  .catch(next);
})

module.exports = router;
