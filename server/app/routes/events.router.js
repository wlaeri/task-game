var express = require('express');
var router = new express.Router();

var db = require('../../db');

var User = db.User;
var Game = db.Game;
var Task = db.Task;
var Event = db.Event;

router.post('/events', function(req, res, next){
  Event.create(req.body)
  .then(event=> res.send(event))
  .catch(next);
})

module.exports = router;
