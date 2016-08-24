app.controller('DashCtrl', function($scope, gameData){
console.log("Got to Dash Ctrl: ", gameData);


$scope.gameData = gameData;

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
