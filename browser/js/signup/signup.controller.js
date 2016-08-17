app.controller('SignupCtrl', function($scope, $mdDialog, $state, UserFactory){
    $scope.email = null;
    $scope.password = null;

    $scope.handleSubmit = function () {
        $scope.error = null;

        let signupInfo = {
            email: $scope.email,
            password: $scope.password
        };

        UserFactory.createNewUser(signupInfo)
        .then(function(user){
            $state.go('u.account', {user: user});
            return $mdDialog.hide();
        })
        .catch(function(err){
            $scope.error = err.message;
        });
    };

    $scope.handleCancel = function () {
        return $mdDialog.hide();
    };
});
