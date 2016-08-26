const swig = require('swig');
const nodemailer = require('nodemailer');
const path = require('path');
//const wrapup = require('');


function inviteFriends (sender, receivers){
    let template = swig.compileFile(path.join(__dirname, '/inviteFriends.html'));
    let output = template({
        sender: sender
    });
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'gamr12344321@gmail.com', // Your email id
            pass: 'KevinSp@cey!' // Your password
        }
    });
    let mailOptions = {
        from: '"GAMR" <gamr@gamr.life>', // sender address
        to: receivers, // list of receivers
        subject: sender + ' wants you to join GAMR', // Subject line
        text: 'Gamify everything. Sign up to play GAMR.', // plaintext body
        html: output // html body
    };

    return transporter.sendMail(mailOptions, function(error, info){
        if (error) return console.log(error);
        else return console.log('Message sent: ' + info.response);
    });
}

function invitePlayers (gameObj, userObj, commissioner){
    let gameName = gameObj.name;
    commissioner = commissioner.firstName + ' ' + commissioner.lastName;
    let template = swig.compileFile(path.join(__dirname, '/invitePlayers.html'));
    let output = template({
        game: gameObj,
        commissioner: commissioner,
        user: userObj
    });
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'gamr12344321@gmail.com', // Your email id
            pass: 'KevinSp@cey!' // Your password
        }
    });
    let mailOptions = {
        from: '"GAMR" <gamr@gamr.life>', // sender address
        to: "gamr12344321@gmail.com", // list of receivers
        subject: commissioner + ' would like you to join ' + gameName, // Subject line
        text: commissioner + ' would like you to join ' + gameName, // plaintext body
        html: output // html body
    };

    return transporter.sendMail(mailOptions, function (error, info){
        if (error) return console.log(error);
        else return console.log('Message sent: ' + info.response);
    });
}

function lockGame(gameObj) {
    let gameName = gameObj.name;
    let template = swig.compileFile(path.join(__dirname, '/lockGame.html'));
    let output = template({
        game: gameObj
    });
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'gamr12344321@gmail.com', // Your email id
            pass: 'KevinSp@cey!' // Your password
        }
    });
    let mailOptions = {
        from: '"GAMR" <gamr@gamr.life>', // sender address
        to: "gamr12344321@gmail.com", // list of receivers
        subject: gameName + 'has been locked.', // Subject line
        text: gameName + 'has been locked. Please confirm the game before it begins. You must confirm the game to play.', // plaintext body
        html: output // html body
    };

    return transporter.sendMail(mailOptions, function (error, info){
        if (error) return console.log(error);
        else return console.log('Message sent: ' + info.response);
    });
}

function startGame(gameObj) {
    let gameName = gameObj.name;
    let template = swig.compileFile(path.join(__dirname, '/startGame.html'));
    let output = template({
        game: gameObj
    });
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'gamr12344321@gmail.com', // Your email id
            pass: 'KevinSp@cey!' // Your password
        }
    });
    let mailOptions = {
        from: '"GAMR" <gamr@gamr.life>', // sender address
        to: "gamr12344321@gmail.com", // list of receivers
        subject: gameName + ' has begun!', // Subject line
        text: gameName + ' has begun!', // plaintext body
        html: output // html body
    };

    return transporter.sendMail(mailOptions, function (error, info){
        if (error) return console.log(error);
        else return console.log('Message sent: ' + info.response);
    });
}

function endGame(gameObj) {
    let transactions; //= wrapup(gameObj);
    let gameName = gameObj.name;
    let template = swig.compileFile(path.join(__dirname, '/endGame.html'));
    let output = template({
        game: gameObj,
        transactions: transactions
    });
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'gamr12344321@gmail.com', // Your email id
            pass: 'KevinSp@cey!' // Your password
        }
    });
    let mailOptions = {
        from: '"GAMR" <gamr@gamr.life>', // sender address
        to: "gamr12344321@gmail.com", // list of receivers
        subject: gameName + ' has ended', // Subject line
        text: gameName + ' has ended', // plaintext body
        html: output // html body
    };

    return transporter.sendMail(mailOptions, function (error, info){
        if (error) return console.log(error);
        else return console.log('Message sent: ' + info.response);
    });
}

module.exports = {
    inviteFriends: inviteFriends,
    invitePlayers: invitePlayers,
    lockGame: lockGame,
    startGame: startGame,
    endGame: endGame
};
