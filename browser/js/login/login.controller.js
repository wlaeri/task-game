app.controller('LoginCtrl', function($scope, $mdDialog, $state, AuthService){
    $scope.email = null;
    $scope.password = null;

    $scope.handleSubmit = function () {
        $scope.error = null;

        let loginInfo = {
            email: $scope.email,
            password: $scope.password
        }

        AuthService.login(loginInfo)
        .then(function () {
            console.log("login successful");
            $state.go('u.dash');
            return $mdDialog.hide();
        })
        .catch(function (err) {
            console.log(err);
            $scope.error = 'Invalid login credentials.';
        });
    }

    $scope.handleCancel = function () {
        return $mdDialog.hide();
    };
});
