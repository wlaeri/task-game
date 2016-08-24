app.factory('UserFactory', function($state, $http){

    let UserFactory = {};

    UserFactory.getAllUsernames = function(){
        console.log("In get All Usernames")
        return $http.get('api/user/allUsernames')
        .then(function(userNames){
            console.log("returned from get all userNames with:", userNames.data)
            return userNames.data;
        })
    }
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

    UserFactory.updateUser = function(id, newUserInfo){
        return $http.put('/api/user/'+id, newUserInfo)
        .then(function(updatedUser){
            return updatedUser.data
        })
    }

    UserFactory.autocomplete = function(str){
        return $http.get('/api/user/invite/'+str)
        .then(users=>users.data);
    }

        return UserFactory;
})
