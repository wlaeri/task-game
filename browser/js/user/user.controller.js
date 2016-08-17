app.controller('UserCtrl', function($scope, $state, $stateParams, AuthService, usersGames) {
    $scope.user = $stateParams.user;
    $scope.menuItems = usersGames;
    $scope.logout = function() {
        console.log("In the logout function on scope.")
        AuthService.logout()
        .then(function () {
            $state.go('home');
        })
        .catch(function (err) {
            console.log(err);
        });
    }
})
