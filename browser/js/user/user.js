app.config(function ($stateProvider) {
    $stateProvider.state('u', {
        url: '/user',
        templateUrl: 'js/user/user.html',
        controller: 'UserCtrl'
    });
});

app.controller('UserCtrl', function($scope, $mdSidenav, $mdMedia, UserFactory) {
    $scope.openLeftMenu = function() {
        $mdSidenav('left').toggle()
    }
    $scope.menuItems = [{
        name: "Keep Apartment PHA Clean"
    }, {
        name: "Game2"
    }, {
        name: "Game3"
    }, {
        name: "Game4"
    }]

    $scope.getUserInfo = UserFactory.getUserInfo;
    $scope.createNewUser = UserFactory.createNewUser;
    $scope.updateUser = UserFactory.updateUser

    UserFactory.getUserInfo(10).then(function(userTest){
        $scope.user = userTest;
    });
})

app.factory('UserFactory', function($state, $http){

var UserFactory = {};

UserFactory.getUserInfo = function(id){
    console.log("Called getUserInfo")
    return $http.get('/api/user/' + id)
    .then(function(user){
        console.log("Returned from get request with something")
        console.log(user);
        return user.data
    }) 
}

UserFactory.createNewUser = function(){
    return $http.post('/api/user')
    .then(function(newUser){
        return newUser.data;
    })
}

UserFactory.updateUser = function(id){
    return $http.put('/api/user/'+id)
    .then(function(updatedUser){
        return updatedUser.data
    })
}

    

    return UserFactory;
})
