app.config(function($stateProvider){
  $stateProvider.state('u.game',{
    url: 'game/overview/:gameId',
    templateUrl: 'js/game-overview/user-games.html',
    controller: 'GameOverviewCtrl',
    resolve: {
      gameObj: function($stateParams, GameFactory){
        return GameFactory.getGame($stateParams.gameId);
    }
  }
  })
})

app.controller('GameOverviewCtrl', function($scope, gameObj, GameFactory){

    $scope.game = gameObj;

    $scope.createCron = GameFactory.confirmGame;


})
