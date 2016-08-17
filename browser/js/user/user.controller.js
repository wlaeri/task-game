app.controller('UserCtrl', function($scope, $state, $stateParams, AuthService) {
    $scope.user = $stateParams.user;
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
