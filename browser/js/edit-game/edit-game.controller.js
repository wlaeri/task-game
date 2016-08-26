app.controller('EditGameCtrl', function($scope, $mdDialog, $state, UserFactory, $log, GameFactory, Comm){
    $scope.selectedItem;
    $scope.searchText = '';

    $scope.comm = Comm;

    console.log($scope.comm);

    $scope.addTask = function() {
        let newTaskNum = $scope.comm.tasks.length;
        $scope.comm.tasks.push({
            elemId:'task'+newTaskNum,
            name: '',
            description: '',
            points: ''
        });
    };

    $scope.removeTask = function(elemId) {
        $scope.comm.tasks = $scope.comm.tasks.filter(e=>e.elemId !== elemId);
    };

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
            $scope.comm.users.invited.push(selectedItem);
            $scope.foundMatches = [];
        }
    }

    $scope.update = function(){
        // we need to make sure we are not sending back game status either
        //perhap hit the api route with a game id
        $scope.comm.tasks = $scope.comm.tasks.map(task => {
            delete task.elemId;
            return task
        });
        delete $scope.comm.status;
        console.log($scope.comm)
        GameFactory.updateGame($scope.comm)
        .then(gameId=>$state.go('u.edit', $scope.comm.id))
    }

    $scope.lock = function(){
        $scope.comm.tasks = $scope.comm.tasks.map(task => {
            delete task.elemId;
            return task
        });
        $scope.comm.locked = true;
        GameFactory.updateGame($scope.comm)
        // .tap(game => {
        //     GameFactory.confirmGame({
        //         startDate: game.start,
        //         endDate: game.end
        //     })
        // })
        .then(gameId=>$state.go('u.game', {gameId: $scope.comm.id}))
    }

})
