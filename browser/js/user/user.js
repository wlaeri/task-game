app.config(function ($stateProvider) {
    $stateProvider.state('user', {
        url: '/users',
        templateUrl: 'js/user/user.html',
        controller: 'UserCtrl'
    });
});

app.controller('UserCtrl', function($scope, $mdSidenav, $mdMedia) {
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
    }]
})
