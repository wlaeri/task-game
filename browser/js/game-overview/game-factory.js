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
    .then(games=>games.data);
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

  return GameFactory;
})
