app.controller('EditGameCtrl', function($scope, $mdDialog, $state, UserFactory, $log, GameFactory, Comm){
    $scope.selectedItem;
    $scope.searchText = '';

    $scope.comm = Comm;

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
        $scope.comm.tasks = $scope.comm.tasks.map(task => {
            delete task.elemId;
            return task
        });
        console.log($scope.comm)
        GameFactory.updateGame($scope.comm)
        .then(gameId=>$state.go('u.edit', {gameId:gameId}))
    }

    $scope.lock = function(){
        $scope.comm.tasks = $scope.comm.tasks.map(task => {
            delete task.elemId;
            return task
        });
        $scope.comm.locked = true;
        GameFactory.updateGame($scope.comm)
        .then(gameId=>$state.go('u.game', {gameId:gameId}))
    }

})
