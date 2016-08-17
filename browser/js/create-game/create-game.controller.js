app.controller('CreateGameCtrl', function($scope, $mdDialog){

    $scope.addFriends = function() {
        $mdDialog.show({
            templateUrl: 'js/add-friends/add-friends.html',
            controller: 'AddFriendsCtrl'
        });
    }

})
