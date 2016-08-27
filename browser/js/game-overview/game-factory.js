'use strict';

app.factory('GameFactory', function($http) {
  var GameFactory = {};

  GameFactory.getGame = function(id) {
    return $http.get('api/games/' + id)
    .then(game => game.data);
  };

  GameFactory.createGame = function(data) {
    return $http.post('api/games/', data)
    .then(newGame => newGame.data);
  }

  GameFactory.updateGame = function(data) {
    return $http.put('api/games/', data)
    .then(newGame => newGame.data);
  }

  GameFactory.completeTask = function(data) {
    return $http.post('api/events', data)
    .then(newEvent => newEvent.data);
  }

  GameFactory.getUsersGames = function(id){
    return $http.get('api/games/user/'+id)
    .then(games=>games.data)
    .then(games=>{
      games.forEach(game=>game.timeTil = moment(game.start).fromNow())
      return games;
    }
      );
  }

  GameFactory.acceptInvite = function(user, game){
    return $http.get('api/email/acceptInvite', {params:{'user':user,'game':game}})
    .then(game=>game.data);
  }

  GameFactory.getActiveGames = function(id) {
      return $http.get('api/games/user/' + id + '/active')
          .then(games => games.data)
          .then(games => {
              games.forEach(game => {
                  let pieData = [];
                  game.users.forEach(user => {
                      user.points = game.events.filter(event => event.completedById === user.id)
                          .map(event => game.tasks.find(task => task.id === event.taskId).points)
                          .reduce((prev, curr) => prev + curr, 0);
                      let pieObj = { key: user.username, y: user.points }
                      pieData.push(pieObj);
                  });

                  game.pieChartData = pieData;

                  let total = pieData.reduce((prev, curr) => prev + curr.y, 0);
                  let barData = [{ label: "Over-Under", values: [] }];
                  pieData.forEach(e => {
                      let barObj = {};
                      if (total) barObj.value = (game.pledge * game.users.length) * (e.y / total) - game.pledge;
                      else barObj.value = 0;
                      barObj.label = e.key;
                      barData[0].values.push(barObj);
                  })
                  game.barChartData = barData;
                  game.timeLeft = moment(game.end).fromNow();
              });
              return games;
          });
  }

  GameFactory.getCompletedGames = function(id) {
    return $http.get('api/games/user/' + id + '/completed')
    .then(games => games.data);
  }

  GameFactory.getEventsbyId = function(taskId){
    return $http.get('api/events/task/' + taskId)
    .then(newEvent => newEvent.data);
  }

  GameFactory.confirmGame = function(data){
    console.log("In confirmGame route")
    return $http.post('api/cron', data)
    .then(res=>res)
  }

  GameFactory.sendMessage = function(data){
    console.log("message", data)
    return $http.post('api/games/message', data)
    .then(res=>res.data);
  }

  GameFactory.getMessages = function(id){
    console.log("get message function", id);
    return $http.get('api/games/messages/' + id)
    .then(res=>res.data);
    }

  return GameFactory;
})


// GameFactory.loadChat = function(gameId){
//   return $http.get('api/chat', gameId)
//   .then(chat=>chat.data);
// }

// app.factory('socket', function($rootScope){
//   var socket = io.connect();
//     return {
//         on: function (eventName, callback) {
//             socket.on(eventName, function () {
//                 var args = arguments;
//                 $rootScope.$apply(function () {
//                     callback.apply(socket, args);
//                 });
//             });
//         },
//         emit: function (eventName, data, callback) {
//             socket.emit(eventName, data, function () {
//                 var args = arguments;
//                 $rootScope.$apply(function () {
//                     if (callback) {
//                         callback.apply(socket, args);
//                     }
//                 });
//             })
//         },
//       removeAllListeners: function (eventName, callback) {
//           socket.removeAllListeners(eventName, function() {
//               var args = arguments;
//               $rootScope.$apply(function () {
//                 callback.apply(socket, args);
//               });
//           }); 
//       }
//     };
// });
