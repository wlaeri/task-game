app.controller('TaskDeetsCtrl', function($scope, $mdSidenav, $mdMedia) {
    $scope.openLeftMenu = function() {
        $mdSidenav('left').toggle()
    }
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
