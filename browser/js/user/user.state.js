app.config(function ($stateProvider) {
    $stateProvider.state('u', {
        url: '/',
        templateUrl: 'js/user/user.html',
        controller: 'UserCtrl',
        params: {
            user: null
        }
    });
});
