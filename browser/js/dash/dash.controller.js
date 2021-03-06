app.controller('DashCtrl', function($scope, gameData, GameFactory, $log){


$scope.gameData = gameData;

$scope.acceptInvite = function(game){
  GameFactory.acceptInvite($scope.user.id, game)
  .then(game=> $scope.games.forEach(g => {if(g.id==game.gameId) g.playerStatus="Unconfirmed"})
  )
  .catch($log);
}

$scope.confirmJoinGame = function(game){
    GameFactory.confirmJoinGame($scope.user.id, game)
    .then(game=> $scope.games.forEach(g=> {
        console.log("Success!");
    if(g.id==game.gameId) g.playerStatus="Confirmed";
    }))
    .catch($log);
}

$scope.areConfirmed = function(){
  return $scope.games.some(g=>g.status=="Confirmed");
}

$scope.arePending = function(){
  return $scope.games.some(g=>g.status=="Pending");
}

$scope.isUnconfirmed = function(game){
  return game.playerStatus=="Unconfirmed"
}

$scope.isInvited = function(game){
  return game.playerStatus=="Invited";
}


$scope.pieChartOptions = {
    chart: {
        type: 'pieChart',
        height: 500,
        x: function(d){return d.key; },
        y: function(d){return d.y; },
        showLabels: false,
        duration: 500,
        labelThreshold: 0.01,
        labelSunbeamLayout: true,
        legend: {
            margin: {
                top: 5,
                right: 5,
                bottom: 5,
                left: 0
            }
        },
        legendPosition: 'center'
    },
    title: {
        enable: true,
        text: "Current Point Share",
        className: 'h4',
        css: {
          'font-size': '24px'
        }
    }
};

$scope.barChartOptions= {
    chart: {
        type: 'discreteBarChart',
        height: 450,
        margin : {
            top: 20,
            right: 20,
            bottom: 50,
            left: 55
        },
        x: function(d){return d.label; },
        y: function(d){return d.value; },
        showValues: true,
        valueFormat: function(d){
            return d3.format('$,.2f')(d);
        },
        duration: 500,
        xAxis: {
            axisLabel: 'X Axis'
        },
        yAxis: {
            axisLabel: '',
            axisLabelDistance: -10,
            tickFormat: function(d){return d3.format("$,.2f")(d); },
        },
        showXAxis: false,
    },
    title: {
        enable: true,
        text: "Current Net Payouts",
        className: 'h4',
        css: {
          'font-size': '24px'
        }
    }
};

});
