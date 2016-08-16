var express = require('express');
var router = new express.Router();

var db = require('../../db');

var User = db.User;
var Game = db.Game;
var Task = db.Task;
var Event = db.Event;

router.get('/:id', function(req, res, next){
  console.log("**************", "In get user route!!")
  User.findById(req.params.id)
  .then(user=> res.send(user))
  .catch(next);
})

router.post('/', function(req, res, next){
  User.create(req.body)
  .then(user=> res.send(user))
  .catch(next);
})

router.put('/:id', function(req, res, next){
  User.findById(req.params.id)
  .then(user=> user.update(req.body))
  .then(user=> res.send(user))
  .catch(next);
})

module.exports = router;
