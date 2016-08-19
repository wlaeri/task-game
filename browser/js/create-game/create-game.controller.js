app.controller('CreateGameCtrl', function($scope, $mdDialog, $state, UserFactory, $log, GameFactory){
    $scope.selectedItem;
    $scope.searchText = "";

    $scope.comm = {};
    $scope.comm.commissioner = $scope.user.id;
    $scope.comm.players = {
        unconfirmed: [{
            id: $scope.user.id,
            email: $scope.user.email}],
        invited: []

    };

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
    $scope.getMatches = function(text) {
        console.log(text);
        UserFactory.autocomplete(text)
        .then(users=>{
            $scope.foundMatches = users;
            console.log(users);
        }
            )
        .catch(err=>$log.error)

    }
    $scope.addPlayer= function(selectedItem){
        if(selectedItem){
        $scope.comm.players.invited.push(selectedItem);
        $scope.foundMatches = [];
    }
    }

    $scope.create = function(){
        GameFactory.createGame($scope.comm)
        .then(gameId=>$state.go('u.game', {gameId:gameId}))
    }

})
