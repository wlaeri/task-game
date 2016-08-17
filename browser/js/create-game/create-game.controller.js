app.controller('CreateGameCtrl', function($scope, $mdDialog){

    $scope.players = [{
        id: 'player1',
        email: $scope.user.email
    }];

    $scope.friends = [{
        id: 'friend1',
        email: $scope.user.email
    }];

    $scope.tasks = [{
        id: 'task1',
        name: '',
        decription: '',
        points: ''
    }];

    $scope.addTask = function() {
        let newTaskNum = $scope.tasks.length + 1;
        $scope.tasks.push({
            id:'task'+newTaskNum,
            name: '',
            decription: '',
            points: ''
        });
    };

    $scope.removeTask = function(taskId) {
        $scope.tasks = $scope.tasks.filter(e=>e.id !== taskId);
    };

    $scope.addFriends = function() {
        // $state.go('u.create.friends', {
        //     friends: $scope.players
        // });
        $mdDialog.show({
            templateUrl: 'js/add-friends/add-friends.html',
            controller: 'AddFriendsCtrl',
            scope: $scope
        });
    }

})
