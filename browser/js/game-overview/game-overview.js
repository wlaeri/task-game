app.config(function($stateProvider){
  $stateProvider.state('u.game',{
    url: 'user/game/overview/:gameId',
    templateUrl: 'js/game-overview/user-games.html',
    controller: 'GameOverviewCtrl',
    resolve: {
      gameObj: function($stateParams, GameFactory){
        return GameFactory.getGame($stateParams.gameId);
    }
  }
  })
})

app.controller('GameOverviewCtrl', function($scope, gameObj){

  $scope.menuItems = [{
        name: "Keep Apartment PHA Clean"
    }, {
        name: "Game2"
    }, {
        name: "Game3"
    }, {
        name: "Game4"
    }, {
        name: "Game5"
    }];
    $scope.game = gameObj;

    $scope.elipses = ($scope.menuItems.length > 4);
    console.log($scope.elipses);

})
