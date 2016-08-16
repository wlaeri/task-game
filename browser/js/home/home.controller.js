app.controller('HomeCtrl', function($scope, $mdDialog){
    $scope.login = function() {
        console.log("login function");
        $mdDialog.show({
            templateUrl: 'js/login/login.html',
            controller: 'LoginCtrl'
        });
    }
})
