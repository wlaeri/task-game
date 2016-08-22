'use strict';
var schedule = require('node-schedule');
var db = require('../../db');
var router = require('express').Router();
var nodemailer = require('nodemailer');
var express = require('express');
var router = new express.Router();
var nodemailer = require('nodemailer');

var User = db.User;
var Game = db.Game;
var Task = db.Task;
var Event = db.Event;
var Cron = db.Cron;



var User = db.User;
var Game = db.Game;
var Task = db.Task;
var Event = db.Event;

var rule = new schedule.RecurrenceRule();
rule.hour = 2;

schedule.scheduleJob(rule, function(){
	console.log("Scheduling jobs")
	var currentday = new Date(Date.now());
	var year = currentday.getYear().toString();
	var month = currentday.getMonth().toString();
	var day = currentday.getDay().toString();
	var formattedCurrDate = day+"/"+month+"/"+year;
	var testDate = new Date(formattedCurrDate);
	console.log("formatted Date in router", testDate);
	Cron.findAll({where: {startDay: testDate}})
	.then(function(crons){
		var scheduledCrons = []; 
		console.log("Found crons that match:", crons)
		for (var j = 0; j<crons.length; j++){
			scheduledCrons.push(crons[j]);
		}
		for(var i = 0; i<scheduledCrons.length; i++){
		var currentDate = new Date(Date.now()+20000);
		console.log("In the second for loop, scheduling child jobs");
		console.log("scheduled Cron:", scheduledCrons[i].dataValues);
		var emailStart = scheduledCrons[i].dataValues.startDate
		schedule.scheduleJob(currentDate, function(){
		  let transporter = nodemailer.createTransport({
        	service: 'Gmail',
        	auth: {
            user: 'gamr12344321@gmail.com', // Your email id
            pass: 'KevinSp@cey!' // Your password
        	}
    	  })
    	  let mailOptions = {
        	from: '"GAMR" <gamr@gamr.life>', // sender address
        	to: "John.J.Henry4@gmail.com", // list of receivers
        	subject: 'New Game', // Subject line
        	text: 'Your game has begun on ' + emailStart, // plaintext body
        	html: '<h1>GAMR</h1><br><button>Start Playing</button>' // html body
    	};
    	transporter.sendMail(mailOptions, function(error, info){
        	if(error){
            	return console.log(error);
        	}else{
            	console.log('Message sent: ' + info.response);
        	}
    	});
			console.log("Cron created");
		})
	};
	})
});


// var cronRecord = {}; 

// Cron = {
// 	addTask: function(tracker, date){
// 		var lastRun = null; 
// 		cronRecord[tracker]:{
// 			tracker: tracker, 
// 			Execdate: date
// 		}
// 	}, 
// 	removeTask: function(tracker){
// 		delete cronRecord[tracker];
// 	}, 

// 	run: function(req, res, send){
// 		var scheduledCrons = []; 
// 		var currentTime = date.now();

// 		for (record in cronRecord){
// 			if (checkifTaskIsDue(record, currentTime)){
// 				scheduledCrons.push(record)
// 			}
// 		}
// 	}
// }

// function scheduleCron(date){
// var date = new Date(date); // use CronJob format to set job for this date
// var tracker = date.getMinutes() + date.getSeconds(); 
// var newJob = new CronJob(******, function(){
// 	console.log("Hey there, I'm a cron job");
// })
// Cron.addTask(newJob, date);
// };


// function checkIfTaskIsSoon(taskRecord, currentTime){
// 	var difference = currentTime - taskRecord.date; 
// 	if (difference <= 20000) return true 
// return false;
// }

// function removeTask(tracker){
// 	delete cronRecord[tracker]
// }

router.post('/', function(req, res){
	console.log("****** In cron route, here is the req", req.body)
	Cron.create(req.body)
	.then(function(cron){
		console.log("*****", cron)
		res.status(200);
	})
})

module.exports = router;