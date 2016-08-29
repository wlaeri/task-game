app.controller('TaskDeetsCtrl', function($scope, $rootScope, $mdSidenav, $mdMedia, $mdDialog, $stateParams, GameFactory, UserFactory, events) {

    $scope.convertDate = function(SequelizeDate){
        var YearMonthDay = SequelizeDate.match(/[^T]*/);
        YearMonthDay = YearMonthDay[0].split('-');
        var Year = YearMonthDay[0];
        var Month = YearMonthDay[1];
        var Day = YearMonthDay[2];
        var time = SequelizeDate.slice(SequelizeDate.indexOf("T")+1,-8);
        console.log(time);
        // return YearMonthDay + " " + time;
        return Month + "/" + Day + "/" + Year + " " + time;
    };

    $scope.task = $stateParams.task;

    $scope.events = events.map(function(event){
        event.createdAt = $scope.convertDate(event.createdAt)
        return event;
    })

    $scope.testEventObj();

    $scope.status = null;

    $scope.showConfirm = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you completed this task?')
          .textContent('Tasks will be verified by the other players in the game')
          .ariaLabel('Yes, I did')
          .targetEvent(ev)
          .ok('Yes, I did')
          .cancel('No, I have not');
    $mdDialog.show(confirm).then(function() {
      $scope.status = 'Completed';
      console.log($scope.status);
      GameFactory.completeTask({completedById: $scope.user.id, taskId: $scope.task.id, gameId: $scope.task.gameId})
      .then(task=>{
        task.name = $scope.user.firstName + " "+$scope.user.lastName;
        $scope.events.push(task)}
        ); }
    , function() {
      $scope.status = 'Not Completed';
      console.log($scope.status);
    });
  };
})
