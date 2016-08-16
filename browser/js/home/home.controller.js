app.controller('HomeCtrl', function($scope, $mdDialog){
    $scope.login = function() {
        $mdDialog.show({
            templateUrl: 'js/login/login.html',
            controller: 'LoginCtrl'
        });
    }

    $scope.signup = function() {
        $mdDialog.show({
            templateUrl: 'js/signup/signup.html',
            controller: 'SignupCtrl'
        });
    }

})
