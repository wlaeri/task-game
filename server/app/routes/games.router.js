var express = require('express');
var router = new express.Router();

var db = require('../../db');

var User = db.User;
var Game = db.Game;
var Task = db.Task;
var Event = db.Event;

router.get('/:id', function(req, res, next){
  console.log('Hello....give me something here. Please :(')
  Game.findById(req.params.id, {
    include: [{model: Task},{model: Event}, {model: User}]
            })
  .then(game=> {
    console.log('******** Got to this point');
    res.send(game)
  })
  .catch(next);
})

router.post('/', function(req, res, next){
  Game.create(req.body)
  .then(game=> res.send(game))
  .catch(next)
})

module.exports = router;
