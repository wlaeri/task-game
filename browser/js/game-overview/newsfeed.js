app.directive('tgNewsfeed', function(){
  return{
    restrict: 'E',
    templateUrl: 'js/game-overview/newsfeed.html',
    scope: {
      events: '=',
      users: '=',
      tasks: '='
    },
    link: function(scope){

      scope.events.forEach(e=> e.userName = scope.users.find(function(user){
        return user.id == e.completedById;
      }).firstName);

      scope.events.forEach(e=>{
        var foundTask = scope.tasks.find(function(task){return task.id == e.taskId})
        e.task = foundTask.name;
        e.points = foundTask.points;
      });

    }
  }
});
