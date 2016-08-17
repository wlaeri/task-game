app.controller('SignupCtrl', function($scope, $mdDialog, $state, $http){
    $scope.email = null;
    $scope.password = null;

    $scope.handleSubmit = function () {
        $scope.error = null;

        let signupInfo = {
            email: $scope.email,
            password: $scope.password
        };

        $http.post('/user', signupInfo)
        .then(function(){
            $state.go('u.account');
            return $mdDialog.hide();
        })
        .catch(function(err){
            $scope.error = err.message;
        });
    };

    $scope.handleCancel = function () {
        console.log("Triggered handleCancel function!")
        return $mdDialog.hide();
    };
});
