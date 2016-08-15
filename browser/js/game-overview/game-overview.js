app.config(function($stateProvider){
  $stateProvider.state('gameOverview',{
    url: '/game/overview/',
    templateUrl: 'js/game-overview/user-games.html',
    controller: 'GameOverviewCtrl'
  })
})

app.controller('GameOverviewCtrl', function($scope){

  $scope.menuItems = [{
        name: "Keep Apartment PHA Clean"
    }, {
        name: "Game2"
    }, {
        name: "Game3"
    }, {
        name: "Game4"
    }, {
        name: "Game5"
    }];
    $scope.game = {
        name: "Keep Apartment PHA Clean",
        tasks: [{
            name: "Task",
            description: "Task description is here",
            points: 10
        }, {
            name: "Task",
            description: "Task description is here",
            points: 10
        }, {
            name: "Task",
            description: "Task description is here",
            points: 10
        }, {
            name: "Task",
            description: "Task description is here",
            points: 10
        }, {
            name: "Task",
            description: "Task description is here",
            points: 10
        }, ],
        events: [{
            user: "Barry",
            task: "Cleaned a bunch of things",
            time: "8/16/2016 11:59pm",
            points: 20
        }, {
            user: "Chris",
            task: "Cleaned a bunch of things",
            time: "8/20/2016 11:59pm",
            points: 20
        }, {
            user: "John",
            task: "Cleaned a bunch of things",
            time: "8/14/2016 11:59pm",
            points: 20
        }, {
            user: "Will",
            task: "Cleaned a bunch of things",
            time: "8/15/2016 11:59pm",
            points: 20
        }],
        players: [{name:"Barry", points:45}, {name:"Will", points:60}, {name:"John", points:30}, {name:"Chris", points:80}]
    };

    $scope.elipses = ($scope.menuItems.length > 4);
    console.log($scope.elipses);

})
