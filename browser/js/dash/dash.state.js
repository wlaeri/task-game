app.config(function ($stateProvider) {
    $stateProvider.state('u.dash', {
        url: '/dash',
        templateUrl: 'js/dash/dash.html',
        controller: 'DashCtrl',
        resolve: {
          gameData: function(GameFactory, $stateParams){
            return GameFactory.getActiveGames($stateParams.userId);
          }
        }
        })
});
