app.config(function ($stateProvider) {
    $stateProvider.state('u.create.friends', {
        url: '/friends',
        templateUrl: 'js/add-friends/add-friends.html',
        controller: 'AddFriendsCtrl',
        params: {
            friends: null
        }
    });
});
