var express = require('express');
var router = new express.Router();

var db = require('../../db');

var User = db.User;
var Game = db.Game;
var Task = db.Task;
var Event = db.Event;

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
  Game.create(req.body.game)
  .tap(game=>game.setUsers(invitedPlayers, {
    status: "Invited"
  }))
  .tap(game=>game.setUsers(req.body.players.unconfirmed[0].id, {
    status: "Unconfirmed"
  }))
  .then(game=>game.setCommissioner(req.body.commissioner))
  .tap(game=>{
    let taskProms = req.body.tasks.map(taskObj=>Task.create(taskObj));
    Promise.all(taskProms)
    .then(function(tasks){
        return tasks.map(function(task) {
          return task.setGame(game.id);
        })
    });
  })
  .tap(game=> res.send(game.id))
  // .then(game=>) add email invites here
  .catch(next)
})

router.put('/', function(req, res, next){
  let invitedPlayers = req.body.players.invited.map(u=>+u.id);

  GamePlayers.findAll({
    where: {
      gameId: req.body.game.id
    }
  })
  Game.create(req.body.game)
  .tap(game=>game.setUsers(invitedPlayers, {
    status: "Invited"
  }))
  .tap(game=>game.setUsers(req.body.players.unconfirmed[0].id, {
    status: "Unconfirmed"
  }))
  .then(game=>game.setCommissioner(req.body.commissioner))
  .tap(game=>{
    let taskProms = req.body.tasks.map(taskObj=>Task.create(taskObj));
    Promise.all(taskProms)
    .then(function(tasks){
        return tasks.map(function(task) {
          return task.setGame(game.id);
        })
    });
  })
  .tap(game=> res.send(game.id))
  // .then(game=>) add email invites here
  .catch(next)
})

module.exports = router;
