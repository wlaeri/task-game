app.config(function ($stateProvider) {
    $stateProvider.state('u', {
        url: '/user',
        templateUrl: 'js/user/user.html',
        controller: 'UserCtrl'
    });
});
