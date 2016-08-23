app.config(function ($stateProvider) {
    $stateProvider.state('u', {
        url: '/u/:userId',
        templateUrl: 'js/user/user.html',
        controller: 'UserCtrl',
        data: {authenticate: true},
        resolve:{
            usersGames: function($stateParams, GameFactory, AuthService){
                return AuthService.getLoggedInUser().then(user=>{
                    return GameFactory.getUsersGames(user.id)});
            },
            user : function($stateParams, AuthService){
                return AuthService.getLoggedInUser();
            }
        }
    });
});
