app.controller('AllGamesCtrl', function($scope, $mdSidenav, $mdMedia, $stateParams) {

	$scope.games = $stateParams.games;

	$scope.testGames = function(){
		console.log($stateParams)
		console.log($scope.games);
	}; 

	$scope.testGames();
});