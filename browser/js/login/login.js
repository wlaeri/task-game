app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

app.controller('LoginCtrl', function($scope, $mdDialog){
    let vm = this;
    vm.username = null;
    vm.password = null;

    vm.handleSubmit = handleSubmit;
    vm.handleCancel = handleCancel;

    function handleSubmit() {
        return $mdDialog.hide();
    }

    function handleCancel() {
        return $mdDialog.hide();
    }
    function loginInfo () {
        console.log("*********** in SendLogin Function")

        $scope.error = null;

        AuthService.login(loginInfo).then(function () {
            $state.go('user');
        }).catch(function () {
            $scope.error = 'Invalid login credentials.';
        });
    };
});
