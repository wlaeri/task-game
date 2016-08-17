app.config(function ($stateProvider) {
    $stateProvider.state('u', {
        url: '/',
        templateUrl: 'js/user/user.html',
        controller: 'UserCtrl',
        params: {
            user: null
        },
        resolve:{
            usersGames: function($stateParams, GameFactory){
                return GameFactory.getUsersGames($stateParams.user.id);
            }
        }
    });
});
