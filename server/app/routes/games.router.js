var express = require('express');
var router = new express.Router();

var db = require('../../db');

var User = db.User;
var Game = db.Game;
var Task = db.Task;
var Event = db.Event;

router.get('/game/:id', function(req, res, next){
  Game.findById(req.params.id, {
    include: [{model: Task},{model: Event}, {model: User}]
            })
  .then(game=> res.send(game))
  .catch(next);
})

router.post('/game', function(req, res, next){
  Game.create(req.body)
  .then(game=> res.send(game))
  .catch(next)
})

module.exports = router;
