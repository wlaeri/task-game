app.controller('UserCtrl', function($scope, $state, $stateParams, AuthService, usersGames, $mdDialog) {
    $scope.user = $stateParams.user;

    $scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

    $scope.menuItems = usersGames.filter(game => game.status !== 'Completed');

    // awaiting usage
    $scope.completedGames = usersGames.filter(game => game.status === 'Completed');

    $scope.goToEdit = function(commissionerID, locked) {
        return (commissionerID === $scope.user.id) && !locked;
    }

    $scope.invite = function() {
        $mdDialog.show({
            templateUrl: 'js/invite-friends/invite-friends.html',
            controller: 'InviteFriendsCtrl',
            scope: $scope
        });
    }
    $scope.logout = function() {
        console.log("In the logout function on scope.")
        AuthService.logout()
        .then(function () {
            $state.go('home');
        })
        .catch(function (err) {
            console.log(err);
        });
    }
    $scope.dashBoard = function(){
        $state.go('u.dash')
    }
})
