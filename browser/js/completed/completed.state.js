app.config(function ($stateProvider) {
    $stateProvider.state('u.completed', {
        url: '/completed',
        templateUrl: 'js/completed/completed.html',
        controller: 'CompletedCtrl',
        params: {
            user: null
        },
        resolve: {
            completedGames: function($stateParams, GameFactory) {
                return GameFactory.getCompletedGames($stateParams.user.id);
            }
        }
    });
});
