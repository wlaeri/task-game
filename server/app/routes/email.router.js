const router = new require('express').Router();
const emails = require('../emails');
const db = require('../../db');
const GamePlayers = db.GamePlayers;
const User = db.User;

router.post('/inviteFriends', function(req,res,next){
    let sender = req.body.user.firstName + ' ' + req.body.user.lastName;
    let receivers = req.body.emails;
    res.json(emails.inviteFriends(sender, receivers));
});

router.post('/invitePlayers', function(req,res,next){
    let game = req.body.game;
    let commissioner = req.body.user;
    let invites = req.body.invites;
    invites.forEach(function(user){
        res.json(emails.invitePlayers(game, user, commissioner));
    })

});

router.get('/acceptInvite', function(req, res, next){
    let user = req.query.user;
    let game = req.query.game;

   GamePlayers.findOne({
            where: {
                userId: user,
                gameId: game
            }
        })
    .then(function(gamePlayer){
        console.log(gamePlayer);
        return gamePlayer.update({
            status: 'Unconfirmed'
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
    let user = req.query.user;
    let game = req.query.game;

    GamePlayers.findOne({
        where: {
            userId: user,
            gameId: game
        }
    })
    .then(function(gamePlayer){
        return gamePlayer.update({
            status: 'Confirmed'
        });
    })
    .then(function(gamePlayer){
        return gamePlayer.update({
            status: "Confirmed"
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
