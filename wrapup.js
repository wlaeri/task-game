'use strict';

const chalk = require('chalk');
const db = require('./server/db');
const User = db.model('user');
const Game = db.model('game');
const Task = db.model('task');
const Event = db.model('event');
const GamePlayers = db.model('GamePlayers');
const nodemailer = require('nodemailer');
const Promise = require('sequelize').Promise;

let gameId = 102;
let pledge;
let gameTitle;

Game.findOne({
  where: {
    id: gameId
  },
  include: [{
    model: User
  }]
})
.then(function(game) {
  pledge = game.pledge;
  gameTitle = game.name;
  return game.users.filter(function(player) {
    return player.GamePlayers.status === 'Confirmed';
  });
})
.then(function(players) {

  let totals = {};

  for (let i = 0; i < players.length; i++) {
    totals[players[i].username] = {
      email: players[i].email,
      total: 0
    };
  }
  console.log(totals);

  return Event.findAll({
    where: {
      gameId: gameId
    },
    include: [{
      model: Task
    }, {
      model: User,
      as: 'completedBy'
    }]
  })
  .then(function(events) {
    events.forEach(function(event) {
      console.log(event.task.points);
      totals[event.completedBy.username].total += (+event.task.points);
    });

    return totals;
  })
})
.then(function(totals) {
  let balances = [];

  for (let key in totals) {
    balances.push({ player: key, balance: totals[key].total });
  }

  let grandTotal = balances.reduce((prev, curr) => prev + curr.balance, 0);
  let numPlayers = balances.length;
  let pot = pledge * numPlayers;

  balances = balances.map(player => {
    player.balance = (+(player.balance / grandTotal * pot - pledge).toFixed(2)) * 100;
    return player;
  }).sort((a,b) => {
    return a.balance - b.balance;
  });

  let transactions = [];

  let payer = 0;
  let payee = balances.length - 1;

  while (balances[payer].balance < 0 && payer !== payee) {
    if(balances[payer].balance * -1 > balances[payee].balance) {
      transactions.push({
        from: balances[payer].player,
        to: balances[payee].player,
        amount: balances[payee].balance
      });
      balances[payer].balance += balances[payee].balance;
      balances[payee].balance = 0;
      payee--;
    }
    else {
      transactions.push({
        from: balances[payer].player,
        to: balances[payee].player,
        amount: balances[payer].balance * -1
      });
      balances[payee].balance += balances[payer].balance;
      balances[payer].balance = 0;
      payer++;
    }
  }

  transactions = transactions.map(t => {
    t.amount = (t.amount / 100).toFixed(2);
    return t;
  })

  console.log(transactions);

  var summary = transactions.map(t => {
    return t.from + ' pays ' + t.to + ' $' + t.amount;
  }).join('\n');

  summary = 'Here is the wrap-up for ' + gameTitle + ':\n' + summary + '\nThank you for playing a Gamr game!';

  let sendingTo = [];

  // for (let key in totals) {
  //   sendingTo.push(totals[key].email);
  // }

  sendingTo.push('gamr12344321@gmail.com');

  console.log(summary);
  let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'gamr12344321@gmail.com', // Your email id
            pass: 'KevinSp@cey!' // Your password
        }
    });
    let mailOptions = {
        from: '"GAMR" <gamr@gamr.life>', // sender address
        to: sendingTo, // list of receivers
        subject: 'Game results for: ' + gameTitle, // Subject line
        text: summary // plaintext body
         // html body
    };
    return transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }else{
            return console.log('Message sent: ' + info.response);
        }
    });

  return;
})
