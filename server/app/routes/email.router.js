const router = new require('express').Router();
const emails = require('../emails');
const db = require('../../db');
const GamePlayer = db.GamePlayer;
const User = db.User;

router.post('/inviteFriends', function(req,res,next){
    let sender = req.body.user.firstName + ' ' + req.body.user.lastName;
    let receivers = req.body.emails;
    res.json(emails.inviteFriends(sender, receivers));
});

router.post('/invitePlayers', function(req,res,next){
    let game = req.body.game;
    res.json(emails.invitePlayers(game));
});

router.get('/acceptInvite', function(req, res, next){
    let email = req.query.email;
    let game = req.query.game;

    User.findOne({
        where: {
            email: email
        }
    })
    .then(function(user){
        return GamePlayer.findOne({
            where: {
                userId: user.id,
                gameId: game.id
            }
        });
    })
    .then(function(gamePlayer){
        return gamePlayer.update({
            status: Unconfirmed
        });
    })
    .then(function(updatedGamePlayer){
        res.json(updatedGamePlayer)
    });
})

router.post('/lockGame', function(req,res,next){
    let game = req.body.game;
    res.json(emails.lockGame(game));
});

router.get('/confirmGame', function(req, res, next){
    let email = req.query.email;
    let game = req.query.game;

    User.findOne({
        where: {
            email: email
        }
    })
    .then(function(user){
        return GamePlayer.findOne({
            where: {
                userId: user.id,
                gameId: game.id
            }
        });
    })
    .then(function(gamePlayer){
        return gamePlayer.update({
            status: Confirmed
        });
    })
    .then(function(updatedGamePlayer){
        res.json(updatedGamePlayer)
    });
})

router.post('/startGame', function(req,res,next){
    let game = req.body.game;
    res.json(emails.startGame(game));
});

router.post('/endGame', function(req,res,next){
    let game = req.body.game;
    res.json(emails.endGame(game));
});

module.exports = router;
