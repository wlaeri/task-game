app.config(function ($stateProvider) {
    $stateProvider.state('u.edit', {
        url: '/edit/:gameId',
        templateUrl: 'js/edit-game/edit-game.html',
        controller: 'EditGameCtrl',
        resolve: {
            Comm: function(GameFactory, $stateParams){
                console.log($stateParams.gameId);
                return GameFactory.getGame($stateParams.gameId)
                .then(function(gameObj){
                    let invited = gameObj.users.filter(user => {
                        return user.GamePlayers.status === 'Invited';
                    });
                    let unconfirmed = gameObj.users.filter(user => {
                        return user.GamePlayers.status === 'Unconfirmed';
                    });
                    gameObj.users = {
                        invited: invited,
                        unconfirmed: unconfirmed
                    };
                    gameObj.tasks = gameObj.tasks.map((task, index) =>{
                        task.elemId = index;
                        return task;
                    });
                    return gameObj;
                })
            }
        }
    });
});
