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
      console.log(scope.events);
      scope.events.forEach(e=>{
        var foundTask = scope.tasks.find(function(task){return task.id == e.taskId})
        // e.task = foundTask.name;
        console.log("Found Task:  ", foundTask);
        e.points = foundTask.points;
        console.log("Found TP: ", foundTask.points);
        console.log("E points", e.points);
        scope.players.find(player=>player.id == e.completedById).points+= parseInt(e.points);
        console.log(scope.players.find(player=>player.id == e.completedById));
      });
    }
}});
      // scope.players.forEach((p, i)=>{
      //   var total = 0;
      //   var foundEvents = scope.events.filter(function(e){return e.completedById == p.id})

      //   console.log(foundEvents);
      //   console.log(foundEvents[0]);
      //   if(foundEvents[0]) scope.players[i].points = foundEvents.reduce(function(prev, curr){
      //     console.log("Curr is: ", curr);
      //     console.log(curr.points);
      //     return prev + parseInt(curr.points)}, 0);
      //   else scope.players[i].points =0;
      // })
