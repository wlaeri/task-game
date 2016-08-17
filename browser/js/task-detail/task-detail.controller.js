app.controller('TaskDeetsCtrl', function($scope, $mdSidenav, $mdMedia, $stateParams, task) {



    $scope.task = task;
    
    $scope.console = function (){
        console.log("Task **********", $scope.task)
        console.log('Task1 **********', $scope.task1);
    }
    $scope.console();

    $scope.task1 = $stateParams.task;

    $scope.exampleTasks = [{
        name: "Took out trash", 
        points: 10
    }, {
        name: "Cleaned living room",
        points: 15
    }, {
        name: "Cleaned roof", 
        points: 10
    }, {
        name: "Did dishes", 
        points: 12
    }]
})
