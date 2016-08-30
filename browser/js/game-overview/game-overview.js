app.config(function($stateProvider){
  $stateProvider.state('u.game',{
    url: '/game/overview/:gameId',
    templateUrl: 'js/game-overview/user-games.html',
    controller: 'GameOverviewCtrl',
    resolve: {
      gameObj: function($stateParams, GameFactory){
        return GameFactory.getGame($stateParams.gameId);
    },
      messages: function($stateParams, GameFactory){
        return GameFactory.getMessages($stateParams.gameId)
      }
  }
  })
})

app.controller('GameOverviewCtrl', function($scope, gameObj, GameFactory, messages, socket){

  $scope.game = gameObj;

  $scope.content = messages;


    socket.on('connect', function () {
    socket.emit('adduser', $scope.user.id, $scope.game.id)
  })

  socket.on('updatechat', function (data) {
    $scope.content.push({username: data.username, message: data.content, createdAt: Date.now()});
    })

  $scope.message = '';

  $scope.openMessages = false;

  $scope.openMessageBox = function(){
    $scope.openMessages = !($scope.openMessages)
  };

  $scope.sendMessage = function (){

    GameFactory.sendMessage({gameId: $scope.game.id, username: $scope.user.username, message: $scope.message})
    .then($scope.content.push({gameId: $scope.gameId, username: $scope.user.username, message: $scope.message, createdAt: Date.now()}));

    $scope.socketEmit($scope.message);

    $scope.message = '';

  }

  $scope.socketEmit = function (){
    socket.emit('send:message', {
      content: $scope.message,
      username: $scope.user.username,
      me: false
    })

   $scope.message = '';
  }


  $scope.confirmed = $scope.game.users.filter(user => user.GamePlayers.status === "Confirmed");
  $scope.unconfirmed = $scope.game.users.filter(user => user.GamePlayers.status === "Unconfirmed");
  $scope.invited = $scope.game.users.filter(user => user.GamePlayers.status === "Invited");

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


})
