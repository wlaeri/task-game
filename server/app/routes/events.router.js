var express = require('express');
var router = new express.Router();

var db = require('../../db');

var User = db.User;
var Game = db.Game;
var Task = db.Task;
var Event = db.Event;

router.get('/task/:id', function(req, res, next){
	Event.findAll({where: {taskId: req.params.id}})
	.tap(events=>console.log(events))
	.then(events=>res.send(events))
	.catch(next);
	});

router.post('/', function(req, res, next){
console.log("***************In create event route");
  Event.create(req.body)
  .tap(event=> console.log("******************New Event", event))
  .then(event=> res.send(event))
  .catch(next);
})

module.exports = router;
