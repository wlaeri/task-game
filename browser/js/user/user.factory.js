app.factory('UserFactory', function($state, $http){

    let UserFactory = {};

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
