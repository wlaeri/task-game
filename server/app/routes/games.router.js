var express = require('express');
var router = new express.Router();

var db = require('../../db');

var User = db.User;
var Game = db.Game;
var Task = db.Task;
var Event = db.Event;

router.get('/user/:id', function(req, res, next){
  let gmap;
  User.findById(req.params.id)
  .then(user=>user.getGames({where:{status:{$not: "Completed"}}}, {include: [{model: Task},{model: Event}, {model: User}]}))
  .then(function(games){
    return games.map(function(e){
      return{id: e.dataValues.id, name: e.dataValues.name}
    })
  })
  .tap(games=> console.log("&&&&&&&&finally", games))
  .then(games=>res.send(games))
  .catch(next);
})


router.get('/:id', function(req, res, next){
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
  let invitedPlayers = req.body.players.invited.forEach(u=>u.id);
  Game.create(req.body.game)
  .tap(game=>game.setInvitees(invitedPlayers))
  .tap(game=>game.setPlayers(req.body.players.accepted))
  .then(game=>game.setCommissioner(req.body.commissioner))
  .tap(game=>{
    let taskProms = req.body.tasks.map(taskObj=>Task.create(taskObj));
    return Promise.all(taskProms).map(function(task, index) {
        return task.setGame(game.id);
    });
  })
  .tap(game=> res.send(game.id))
  // .then(game=>) add email invites here
  .catch(next)
})

module.exports = router;
