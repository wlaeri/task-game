app.controller('CreateGameCtrl', function($scope, $mdDialog, $state, UserFactory, $log){
    $scope.comm = {};
    $scope.comm.commissioner = $scope.user.id;
    $scope.comm.players = [{
        id: 'player1',
        email: $scope.user.email
    }];

    $scope.friends = [{
        id: 'friend1',
        email: $scope.user.email
    }];

    $scope.comm.tasks = [{
        id: 'task1',
        name: '',
        decription: '',
        points: ''
    }];

    $scope.addTask = function() {
        let newTaskNum = $scope.comm.tasks.length + 1;
        $scope.comm.tasks.push({
            id:'task'+newTaskNum,
            name: '',
            decription: '',
            points: ''
        });
    };

    $scope.removeTask = function(taskId) {
        $scope.comm.tasks = $scope.comm.tasks.filter(e=>e.id !== taskId);
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
    $scope.getMatches = function() {
        UserFactory.autocomplete($scope.searchText)
        .then(users=>$scope.foundMatches = users)
        .catch(err=>$log.error)

    }

    $scope.create = function(){
        GameFactory.createGame($scope.comm)
        .then(gameId=>$state.go('u.game', {gameId:gameId}))
    }

})
