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
    }
}, { 
hooks: {
	beforeCreate: function(cron){
        cron.startDay = "";
		console.log(cron.startDate);
		var date = new Date(cron.startDate);
		var year = date.getYear().toString();
		var month = date.getMonth().toString();
		var day = date.getDay().toString();
        var formattedDate = day+"/"+month+"/"+year; 
        var testDate = new Date(formattedDate);
		console.log("formatted Date", testDate);


		cron.startDay = testDate; 
	}

}
});

module.exports = Cron;