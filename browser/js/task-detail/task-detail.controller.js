app.controller('TaskDeetsCtrl', function($scope, $mdSidenav, $mdMedia, $stateParams, task, GameFactory) {


    $scope.task = task;

    $scope.events = GameFactory.getEventsbyId($scope.task.id).then(function(events){console.log(events)}).then(events=>events);

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
