'use strict';

let db = require('../_db');
var Sequelize = require('sequelize');

var Cron = db.define('cron', {
    startDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    endDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    startDay: {
    	type: Sequelize.STRING
    }, 
    endDay: {
        type: Sequelize.STRING
    }
}, { 
hooks: {
	beforeCreate: function(cron){
        //reformatting endDate to extract just the day/month/year
        console.log("cron.endDate:", cron.endDate)
        var endDate = new Date(cron.endDate);
        console.log("endDate", endDate);
        var endYear = endDate.getYear().toString();
        var endMonth = endDate.getMonth().toString();
        var endDay = endDate.getDay().toString();
        var onlyEndDay = endDay+"/"+endMonth+"/"+endYear; 
        var formattedEndDay = new Date(onlyEndDay);
        console.log("formatted End Date", formattedEndDay)
        cron.endDay = formattedEndDay;

        //reformatting startDate to extract just the day/month/year
		var startDate = new Date(cron.startDate);
        console.log("cron.startDate:", cron.startDate);
        console.log("startDate", startDate);
		var startYear = startDate.getYear().toString();
		var startMonth = startDate.getMonth().toString();
		var startDay = startDate.getDay().toString();
        var onlyStartDay = startDay+"/"+startMonth+"/"+startYear; 
        var formattedStartDay = new Date(onlyStartDay);
		console.log("formatted Start Date", formattedStartDay);
		cron.startDay = formattedStartDay; 
	}

}
});

module.exports = Cron;