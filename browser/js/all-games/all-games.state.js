app.config(function($stateProvider){
	$stateProvider.state('u.allGames', {
		url:'/allGames', 
		templateUrl: 'js/all-games/all-games.html', 
		controller: 'AllGamesCtrl', 
		params: {games: null}
	})

})