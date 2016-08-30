const express = require('express');
const router = new express.Router();

const db = require('../../db');

const User = db.User;
const Game = db.Game;
const Task = db.Task;
const Event = db.Event;
const GamePlayers = db.GamePlayers;
const email = require('../emails');
const Cron = db.Cron;
const Message = db.Message;

router.get('/user/:id/active', function(req, res, next) {
  User.findById(req.params.id)
  .then(user => {
    return user.getGames({include: [{model: Task},{model: Event}, {model: User}]});
  })
  .then(games => {
    return games.filter(game => {
      return game.status === 'Active';
    })})
  .then(games => res.send(games))
  .catch(next);
});


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
  .then(games => res.send(games))
  .catch(next);
})

router.get('/user/:id', function(req, res, next){
  let gameStats;
  GamePlayers.findAll({where: {userId: req.params.id}})
  .tap(gamePlayers=>gameStats=gamePlayers)
  User.findById(req.params.id)
  .then(user => {
    console.log("*******", gameStats)
    return user.getGames();
  })
  .then(games => {
    return games.map(game => {
      return { id: game.id, name: game.name, start: game.start, end: game.end, status: game.status, commissionerId: game.commissionerId, locked: game.locked, playerStatus:gameStats.find(g=>g.gameId==game.id).status};
    });
  })
  .then(games => res.send(games))
  .catch(next);
})

router.get('/:id', function(req, res, next){
  Game.findById(req.params.id, {
    include: [{model: Task}, {model: Event}, {model: User}]
            })
  .then(game=> res.send(game))
  .catch(next);
})

// creates a game

router.post('/', function(req, res, next){
  let players, commissioner, game;
  Game.create(req.body.game)
  .then(g => {
    game = g;
    return game.addPlayersSetComm(req.body.players, req.body.players.unconfirmed[0].id)
  })
  .then(users => players = users)
  .then(()=>{
    Promise.all(req.body.tasks.map(taskObj => {
      taskObj.gameId = game.id;
      Task.create(taskObj)
    }));
  })
  .tap(() => res.send({id: game.id}))
  .then(() => {
    commissioner = players.filter(player => {
      return player.id == game.commissionerId;
    })[0];
    players.forEach(player => {
      email.invitePlayers(game, player, commissioner)
    })
  })
  .catch(next)
})

// updates all facets of a game on lock or update

router.put('/', function(req, res, next){
  GamePlayers.findAll({ where: { gameId: req.body.id }})
  .then(gamePlayers => {
    return Game.findById(req.body.id, { include: [{ model: Task }] })
    .tap(game => game.addPlayersGameUpdate(req.body.users, gamePlayers, req.body.locked, req.body.commissionerId))
  })
  .tap(game => game.updateTasks(req.body.tasks))
  .then(game => game.updateGameFromReqBody(req.body))
  .tap(game => {
    if (game.locked) { game.createCron(); }
  })
  .tap(updatedGame => res.send(updatedGame))
  .catch(next);
})

router.post('/message', function(req, res, next){
  console.log("req.body", req.body),
  Message.create(req.body)
  .then(message=> {
    res.send(message);
  })
  .catch(next);
})

router.get('/messages/:id', function(req, res, next){
  console.log("in chat route, req.body", req.params.id)
  Message.findAll({where:{gameId: req.params.id}})
  .then(messages=> {
    console.log("Found messages", messages);
    res.send(messages)

  })
})

module.exports = router;
