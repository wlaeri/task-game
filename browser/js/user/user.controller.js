app.controller('UserCtrl', function($scope, $state, $stateParams, AuthService, usersGames, $mdDialog, user) {
    $scope.user = user;

    $scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

    $scope.games = usersGames;

    $scope.menuItems = usersGames.filter(game => game.status !== 'Completed');


    $scope.goToEdit = function(commissionerId, locked) {
        return (commissionerId === $scope.user.id) && !locked;
    }

    $scope.invite = function() {
        $mdDialog.show({
            templateUrl: 'js/invite-friends/invite-friends.html',
            controller: 'InviteFriendsCtrl',
            scope: $scope
        });
    }
    $scope.logout = function() {
        AuthService.logout()
        .then(function () {
            $state.go('home');
        })
        .catch(function (err) {
            //Change to a 404 redirect?
            console.log(err);
        });
    }
    $scope.dashBoard = function(){
        $state.go('u.dash')
    }
})
