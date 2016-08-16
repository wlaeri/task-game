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
            $state.go('user');
        })
        .catch(function () {
            $scope.error = 'Invalid login credentials.';
        });
    }

    $scope.handleCancel = function () {
        return $mdDialog.hide();
    };
});
