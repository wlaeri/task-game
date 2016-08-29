'use strict';
var schedule = require('node-schedule');
var db = require('../../db');
var router = require('express').Router();
var nodemailer = require('nodemailer');
var express = require('express');
var router = new express.Router();
var wrapUp = require('../../../wrapup.js');

var User = db.User;
var Game = db.Game;
var Task = db.Task;
var Event = db.Event;
var Cron = db.Cron;

var email = require('../emails');

var getMonth = function(date){
   var temp = (date.getMonth()+1).toString(); 
   if (+temp < 10){
       temp = "0" + temp;
   }
return temp;
}

var getDate = function(date){
   var temp = (date.getDate()).toString(); 
   if (+temp < 10){
       temp = "0" + temp;
   }
return temp;
}

var getHours = function(date){
   var temp = date.getHours().toString();
   if(+temp < 10){
       temp = "0" + temp;
   }
return temp;
}

var getMinutes = function(date){
   var temp = date.getMinutes().toString();
   if(+temp < 10){
       temp = "0" + temp;
   }
return temp;
}

// var getMinutes = function(date){
//    var temp = date.getMinutes();
//    if(+temp < 10){
//        temp = "0" + temp.toString();
//    }
//    if (((Math.floor(temp/2).toString()).length) === 1){
//        return "0" + Math.floor(temp/2).toString()
//    }
// return Math.floor(temp/2).toString()
// }


var rule = new schedule.RecurrenceRule();
rule.hour = 1;

schedule.scheduleJob(rule, function(){
	console.log("Scheduling jobs")
	var currentday = new Date(Date.now());
	var endYear = currentday.getFullYear().toString();
	var endMonth = getMonth(currentday);
	var endDay = getDate(currentday);
	var endHour = currentday.getHours().toString();
	var endMinute = currentday.getMinutes().toString();
	var onlyEndDay = endYear+"-"+endMonth+"-"+endDay+'T'+endHour + ':' + endMinute; 
	var testDate = new Date(onlyEndDay);
	console.log("formatted Date in router", testDate);
	Cron.findAll({where: {endDay: testDate}})
	.then(function(crons){
		var scheduledCrons = [];
		console.log("Found crons that match:", crons)
		for (var j = 0; j<crons.length; j++){
			scheduledCrons.push(crons[j]);
		}
		for(let i = 0; i<scheduledCrons.length; i++){
		var endDateTime = new Date(scheduledCrons[i].dataValues.endDate);
		console.log("In the second for loop, scheduling child jobs");
		console.log("scheduled Cron:", scheduledCrons[i].dataValues);
		schedule.scheduleJob(endDateTime, function(){
			console.log('Scheduled crons test:',scheduledCrons[i]);
			scheduledCrons[i].getGame()
			.then(game => {
				console.log('&&&&&&*********#######',game.dataValues.id);
				wrapUp(156);
			})
			.catch(console.error)
		})
	};
	})
});


schedule.scheduleJob(rule, function(){
	console.log("Scheduling jobs")
	var currentday = new Date(Date.now());
	var startYear = currentday.getFullYear().toString();
	var startMonth = getMonth(currentday);
	var startDay = getDate(currentday);
	var startHour = getHours(currentday);
	var startMinute = getMinutes(currentday);
	var onlyStartDay = startYear+"-"+startMonth+"-"+startDay+'T'+startHour + ':' + startMinute; 
	var testDate = new Date(onlyStartDay);
	console.log("formatted Date in router", testDate);
	Cron.findAll({where: {startDay: testDate}})
	.then(function(crons){
		var scheduledCrons = [];
		console.log("Found crons that match:", crons)
		for (var j = 0; j<crons.length; j++){
			scheduledCrons.push(crons[j]);
		}
		for(let i = 0; i<scheduledCrons.length; i++){
		var startDateTime = new Date(scheduledCrons[i].dataValues.startDate);
		console.log("In the second for loop, scheduling child jobs");
		console.log("scheduled Cron:", scheduledCrons[i].dataValues);
		schedule.scheduleJob(startDateTime, function(){
			console.log('Scheduled crons test:',scheduledCrons[i]);
			scheduledCrons[i].getGame()
			.then(game => {
				console.log('&&&&&&*********#######',game);
				email.startGame(game)
			})
			.catch(console.error)
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
