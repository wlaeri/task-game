app.config(function ($stateProvider) {
    $stateProvider.state('u.create', {
        url: '/create',
        templateUrl: 'js/create-game/create-game.html',
        controller: 'CreateGameCtrl'
    });
});
