'use strict';
var schedule = require('node-schedule');
var underscore require('_');
var models = require("../../db/models");
var Product = models.Product;
var User = models.User;
var router = require('express').Router();
var Order = models.Order;
var Orderproduct = models.Orderproduct;
var nodemailer = require('nodemailer');
var Promise = require('bluebird');

var rule = new schedule.RecurrenceRule();
rule.hour = 0;

var scheduledTasks = [];

var DailyGameCheck = schedule.scheduleJob(rule, function(){
	var scheduledCrons = []; 
	var currentday = Date.now().getDay();
	Cron.findAll({where: {day: currentDay}})
	.then(function(crons){
		For (cron in crons){
			scheduleCrons.push(cron);
		}
	})
	for(var i = 0; i<scheduledCrons.length; i++){
		schedule.scheduleJob(scheduledCrons[i].startDate, function(){
			console.log("Cron created: ", i);
			//Cron sends notification to players
		})
	}
})

var cronRecord = {}; 

Cron = {
	addTask: function(tracker, date){
		var lastRun = null; 
		cronRecord[tracker]:{
			tracker: tracker, 
			Execdate: date
		}
	}, 
	removeTask: function(tracker){
		delete cronRecord[tracker];
	}, 

	run: function(req, res, send){
		var scheduledCrons = []; 
		var currentTime = date.now();

		for (record in cronRecord){
			if (checkifTaskIsDue(record, currentTime)){
				scheduledCrons.push(record)
			}
		}
	}
}

function scheduleCron(date){
var date = new Date(date); // use CronJob format to set job for this date
var tracker = date.getMinutes() + date.getSeconds(); 
var newJob = new CronJob(******, function(){
	console.log("Hey there, I'm a cron job");
})
Cron.addTask(newJob, date);
};


function checkIfTaskIsSoon(taskRecord, currentTime){
	var difference = currentTime - taskRecord.date; 
	if (difference <= 20000) return true 
return false;
}

function removeTask(tracker){
	delete cronRecord[tracker]
}

router.post('/cron', function(req, res){
	Cron.create(req.body.cron)
	.then(function(cron){
		console.log("*****", cron)
		res.status(200);
	})
})