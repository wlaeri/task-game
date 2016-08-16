app.controller('UserCtrl', function($scope, $mdSidenav, $mdMedia, UserFactory) {
    $scope.menuItems = [{
        name: "Keep Apartment PHA Clean"
    }, {
        name: "Game2"
    }, {
        name: "Game3"
    }, {
        name: "Game4"
    }]

    $scope.getUserInfo = UserFactory.getUserInfo;
    $scope.createNewUser = UserFactory.createNewUser;
    $scope.updateUser = UserFactory.updateUser

    UserFactory.getUserInfo(10).then(function(userTest){
        $scope.user = userTest;
    });
})
