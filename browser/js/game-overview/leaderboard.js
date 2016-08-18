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
      scope.players = scope.players.map(player => {
        player.points = scope.events.filter(event => event.completedById === player.id)
        .map(event => scope.tasks.find(task => task.id === event.taskId).points)
        .reduce((prev, curr) => prev + curr, 0);
        return player;
      }).sort((a,b) => b.points - a.points);
    }
}});
