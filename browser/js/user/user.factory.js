app.factory('UserFactory', function($state, $http){

    let UserFactory = {};

    UserFactory.getUserInfo = function(id){
        return $http.get('/api/user/' + id)
        .then(function(user){
            return user.data
        })
    }

    UserFactory.createNewUser = function(signupInfo){
        return $http.post('/signup', signupInfo)
        .then(function(newUser){
            return newUser.data.user;
        })
    }

    UserFactory.updateUser = function(id){
        return $http.put('/api/user/'+id)
        .then(function(updatedUser){
            return updatedUser.data
        })
    }

    UserFactory.autocomplete = function(str){
        $http.get('/api/user/invite?username='+str)
        .then(users=>users.data);
    }

        return UserFactory;
})
