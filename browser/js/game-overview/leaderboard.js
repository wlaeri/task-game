app.directive('tgLeaderboard', function(){
  return{
    restrict: 'E',
    templateUrl: 'js/game-overview/leaderboard.html',
    scope: {
      events: '=',
      players: '='
    },
    link: function(scope){
      scope.players.forEach(p=>{
        var total = 0;
        var foundEvents = scope.events.filter(function(e){return e.completedById == p.id})
        console.log(foundEvents);
        if(foundEvents[0]) p.points = foundEvents.reduce(function(total, e){return total+parseInt(e[points])});
        else p.points =0;
      })
    }
}});
