app.config(function ($stateProvider) {
    $stateProvider.state('u', {
        url: '/user/:id',
        templateUrl: 'js/user/user.html',
        controller: 'UserCtrl',
        resolve:{
            usersGames: function($stateParams, GameFactory){
                return GameFactory.getUsersGames($stateParams.id);
            }
        }
    });
});

app.controller('UserCtrl', function($scope, $mdSidenav, $mdMedia, usersGames) {
    $scope.openLeftMenu = function() {
        $mdSidenav('left').toggle()
    }
    $scope.menuItems = usersGames;
})
