'use strict';
var schedule = require('node-schedule');
var db = require('../../db');
var router = require('express').Router();
var nodemailer = require('nodemailer');
var express = require('express');
var router = new express.Router();

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
rule.second = 0;

schedule.scheduleJob(rule, function(){
	console.log("Scheduling jobs")
	var scheduledCrons = []; 
	var currentday = new Date(Date.now());
	var year = currentday.getYear().toString();
	var month = currentday.getMonth().toString();
	var day = currentday.getDay().toString();
	var formattedDate = day+"/"+month+"/"+year;
	var testDate = new Date(formattedDate);
	console.log("formatted Date in router", testDate);
	Cron.findAll({where: {startDay: testDate}})
	.then(function(crons){
		console.log("Found crons that match:", crons)
		for (var j = 0; j<crons.length; j++){
			scheduledCrons.push(crons[i]);
		}
		for(var i = 0; i<scheduledCrons.length; i++){
		var currentDate = new Date(Date.now()+20000);
		console.log("In the second for loop, scheduling child jobs")
		schedule.scheduleJob(currentDate, function(){
			console.log("Cron created");
			//Cron sends notification to players
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