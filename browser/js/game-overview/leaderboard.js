app.directive('tgLeaderboard', function(){
  return{
    restrict: 'E',
    templateUrl: 'js/game-overview/leaderboard.html',
    scope: {
      events: '=',
      players: '=',
      tasks: '='
    },
    link: function(scope){
      scope.players = scope.players.map(function(player, i) {
        scope.players[i].points = scope.events.filter(function(event) {
          return event.completedById === player.id;
        }).map(function(event) {
          return scope.tasks.filter(function(task) {
            return task.id === event.taskId;
          })[0].points;
        }).reduce(function(prev, curr) { return prev + curr; }, 0);
        return scope.players[i];
      }).sort(function(a,b) {
        return b.points - a.points;
      });
    }
}});
