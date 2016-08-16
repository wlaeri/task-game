'use strict';

app.factory('GameFactory', function($http) {
  var GameFactory = {};

  GameFactory.getGame = function(id) {
    return $http.get('api/game/' + id)
    .then(game => game.data);
  };

  GameFactory.createGame = function(data) {
    return $http.post('api/game/', data)
    .then(newGame => newGame.data);
  }

  GameFactory.completeTask = function(data) {
    return $http.post('api/events', data)
    .then(newEvent => newEvent.data);
  }

  return GameFactory;
})
