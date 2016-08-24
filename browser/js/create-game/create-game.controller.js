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

    // $scope.friends = [{
    //     id: 'friend1',
    //     email: $scope.user.email
    // }];

    $scope.comm.tasks = [{
        elemId: 'task0',
        name: '',
        decription: '',
        points: ''
    }];

    $scope.addTask = function() {
        let newTaskNum = $scope.comm.tasks.length;
        $scope.comm.tasks.push({
            elemId:'task'+newTaskNum,
            name: '',
            decription: '',
            points: ''
        });
    };

    $scope.removeTask = function(elemId) {
        $scope.comm.tasks = $scope.comm.tasks.filter(e=>e.elemId !== elemId);
    };

    // $scope.addFriends = function() {
    //     // $state.go('u.create.friends', {
    //     //     friends: $scope.players
    //     // });
    //     $mdDialog.show({
    //         templateUrl: 'js/add-friends/add-friends.html',
    //         controller: 'AddFriendsCtrl',
    //         scope: $scope
    //     });
    // }
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
        $scope.comm.tasks = $scope.comm.tasks.map(task => {
            delete task.elemId;
            return task
        });
        GameFactory.createGame($scope.comm)
        .then(gameId=>$state.go('u.edit', {gameId:gameId}))
    }

})
