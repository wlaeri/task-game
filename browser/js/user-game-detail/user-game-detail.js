app.config(function($stateProvider) {
  $stateProvider.state('userGameDetail', {
    url: '/game/user',
    templateUrl: 'js/user-game-detail/user-game-detail.html',
    controller: 'UserGameCtrl'
  });
});

app.controller('UserGameCtrl', function($scope, $mdSidenav, $mdMedia) {
  $scope.openLeftMenu = function() {
      $mdSidenav('left').toggle()
  }
  $scope.menuItems = [{
      name: "Keep Apartment PHA Clean"
  }, {
      name: "Game2"
  }, {
      name: "Game3"
  }, {
      name: "Game4"
  },{
      name: "Game5"
  }];
  $scope.tasks = [];
  for (var i = 0; i < 5; i++) {
    $scope.tasks.push({name: 'Task', points: (Math.floor(Math.random() * 10) + 1), time: (new Date(new Date() - (Math.floor(Math.random() * 1e9) + 1)).toString().split(" ").slice(0,5).join(" "))});
  }
  $scope.totalPoints = $scope.tasks.reduce((prev, curr) => prev + curr.points, 0);
  $scope.elipses = ($scope.menuItems.length>4);
});
