app.controller('AddFriendsCtrl', function($scope, $state, $mdDialog){


    $scope.addFriend = function(email) {
        let newFriendNum = $scope.friends.length + 1;
        $scope.friends.push({
            id:'friend' + newFriendNum,
            email: email
        });
    };

    $scope.removeFriend = function(friendId) {
        if(friendId === 'friend1') return;
        $scope.friends = $scope.friends.filter(e=>e.id !== friendId);
    };

    $scope.handleSubmit = function () {
        return $mdDialog.hide();
    }

    $scope.handleCancel = function () {
        return $mdDialog.hide();
    };

})
