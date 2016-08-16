app.controller('SignupCtrl', function($scope, $mdDialog, $state, $http){
    $scope.email = null;
    $scope.password = null;

    $scope.handleSubmit = function () {
        $scope.error = null;

        let signupInfo = {
            email: $scope.email,
            password: $scope.password
        };

        $http.post('/signup', signupInfo)
        .then(function(){
            $state.go('u');
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
