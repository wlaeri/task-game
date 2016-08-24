var express = require('express');
var router = new express.Router();
const nodemailer = require('nodemailer');

var db = require('../../db');

var User = db.User;
var Game = db.Game;
var Task = db.Task;
var Event = db.Event;

function passwordConfirmation(user){
    // let template = swig.compileFile(path.join(__dirname, '/inviteFriends.html'));
    // let output = template({
    //     user: user
    // });
    console.log("In passwordConfirmation function****", user)
    console.log("user.email", user.email);
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'gamr12344321@gmail.com', // Your email id
            pass: 'KevinSp@cey!' // Your password
        }
    });
    let mailOptions = {
        from: '"GAMR" <gamr@gamr.life>', // user address
        to: user.email, // list of receivers
        subject: "Your new GAMR password", // Subject line
        text: 'Your password has been succesfully updated: +2 points, :). Gamify everything.', // plaintext body// html body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) return console.log(error);
        else return console.log('Message sent: ' + info.response);
    });
};

//For use in autocomplete to invite players
router.get('/invite/:username', function(req,res, next){
  console.log(req.params.username);
  User.findAll({where:{
    username: {$like: req.params.username+'%'}
  }, attributes:['username', 'id']})
  .then(users=>{
    console.log(users);
    res.send(users)})
  .catch(next);
})

router.get('/allUsernames', function(req, res, next){
  User.findAll({})
  .then(users=>{
    var userNames = users.map(function(user){
      return user.username;
    })
  return userNames
  })
  .then(userNames=> res.send(userNames))
});

router.get('/:id', function(req, res, next){
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
  console.log("***** I hit the User put route", "req.params.id", req.params.id, "req.body", req.body)
  User.findById(req.params.id)
  .then(user=> user.update(req.body))
  .then(user=>{ 
    passwordConfirmation(user);
    res.send(user)
  }) 
  .catch(next);
})

module.exports = router;
