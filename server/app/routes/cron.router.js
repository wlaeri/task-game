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
            email.startGame();
		})
	};
	})
});

router.post('/', function(req, res){
	console.log("****** In cron route, here is the req", req.body)
	Cron.create(req.body)
	.then(function(cron){
		console.log("*****", cron)
		res.status(200);
	})
})

module.exports = router;
