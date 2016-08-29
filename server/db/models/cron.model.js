'use strict';

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

// var getMinutes = function(date){
//     var temp = date.getMinutes();
//     if(+temp < 10){
//         temp = "0" + temp.toString();
//     }
//     if (((Math.floor(temp/2).toString()).length) === 1){
//         return "0" + Math.floor(temp/2).toString()
//     }
// return Math.floor(temp/2).toString()
// }

var getMinutes = function(date){
    var temp = date.getMinutes().toString();
    if(+temp < 10){
        temp = "0" + temp;
    }
return temp;
}

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
        var endYear = endDate.getFullYear().toString();
        var endMonth = getMonth(endDate);
        var endDay = getDate(endDate);
        var endHour = getHours(endDate);
        var endMinute = getMinutes(endDate);
        var onlyEndDay = endYear+"-"+endMonth+"-"+endDay+'T'+endHour + ':' + endMinute; 
        console.log("onlyEndDay", onlyEndDay)
        var formattedEndDay = new Date(onlyEndDay);
        console.log("formatted End Date", formattedEndDay)
        cron.endDay = formattedEndDay;

        //reformatting startDate to extract just the day/month/year
		var startDate = new Date(cron.startDate);
        console.log("cron.startDate:", cron.startDate);
        console.log("startDate", startDate);
		var startYear = startDate.getFullYear().toString();
		var startMonth = getMonth(startDate);
		var startDay = getDate(startDate);
        var startHour = getHours(startDate);
        var startMinute = getMinutes(startDate);
        var onlyStartDay = startYear+"-"+startMonth+"-"+startDay+'T'+startHour + ':' + startMinute; 
        console.log("onlyStartDay", onlyStartDay);
        var formattedStartDay = new Date(onlyStartDay);
		console.log("formatted Start Date", formattedStartDay);
		cron.startDay = formattedStartDay; 
	}

}
});

module.exports = Cron