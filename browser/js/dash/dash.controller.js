app.controller('DashCtrl', function($scope, gameData){
console.log("Got to Dash Ctrl: ", gameData);

// "values": [createdAt, cumulativePoints]
// I'm thinking do a players.forEach, filter objects by player.id, then sort by date. Then go over each event, assign values[1] to be cumTotal of all points for that player.
$scope.gameData = gameData;
// $scope.players = gameData.users;
// $scope.tasks = gameData.tasks;
// $scope.events = gameData.events;
$scope.test = function(){console.log("Testing")};

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

$scope.pieChart = function(game){
    let data= [];
    game.users.forEach(user => {
        user.points = game.events.filter(event => event.completedById === user.id)
        .map(event => game.tasks.find(task => task.id === event.taskId).points)
        .reduce((prev, curr) => prev + curr, 0);
        let obj = {key: user.username, y: user.points}
        data.push(obj);
      });
    return data;
  }

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
$scope.barChart = function(game){
  let pie = $scope.pieChart(game);
  let total = pie.reduce((prev, curr)=> prev+curr.y, 0);
  console.log(total);
  let data = [{label: "Over-Under", values:[]}];
  pie.forEach(e=>{
    let obj = {};
    if(total) obj.value = (game.pledge*game.users.length)*(e.y/total)-game.pledge;
    else obj.value =0;
    obj.label = e.key;
    data[0].values.push(obj);
  })
  return data;
}
});
// $scope.data = [];
// $scope.players.forEach(function(player) {
  //     let obj = {"key": player.username, "values": []}
  //     let playerEvents = $scope.events.filter(event => event.completedById === player.id)
  //     playerEvents.forEach(event =>{
  //       event.points = $scope.tasks.find(task => task.id === event.taskId).points;
  //     })
  //     console.log("playerEvents after filter", playerEvents);
  //     playerEvents.sort((a,b) => new Date(b.date) - new Date(a.date));
  //       let total =0;
  //       playerEvents.forEach(function(e, total){
  //         let arr = [];
  //         arr[0] = new Date(e.createdAt);
  //         arr[1] = total + e.points;
  //         obj["values"].push(arr);
  //       })
  //       $scope.data.push(obj);
  //     })
  // console.log("*****Dash data: ", $scope.data);

  // $scope.options = {
  //   chart: {
  //               type: 'stackedAreaChart',
  //               height: 450,
  //               margin : {
  //                   top: 20,
  //                   right: 20,
  //                   bottom: 30,
  //                   left: 40
  //               },
  //               x: function(d){return d[0]; },
  //               y: function(d){return d[1]; },
  //               useVoronoi: false,
  //               clipEdge: true,
  //               duration: 100,
  //               useInteractiveGuideline: true,
  //               xAxis: {
  //                   showMaxMin: false,
  //                   tickFormat: function(d) {
  //                       return d3.time.format('%x')(new Date(d))
  //                   }
  //               },
  //               yAxis: {
  //                   tickFormat: function(d){
  //                       return d3.format(',.2f')(d);
  //                   }
  //               },
  //               zoom: {
  //                   enabled: true,
  //                   scaleExtent: [1, 10],
  //                   useFixedDomain: false,
  //                   useNiceScale: false,
  //                   horizontalOff: false,
  //                   verticalOff: true,
  //                   unzoomEventType: 'dblclick.zoom'
  //               }
  //   }
  // };
