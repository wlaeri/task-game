app.factory('UserFactory', function($state, $http){

    let UserFactory = {};

    UserFactory.getAllUsernames = function(){
        return $http.get('api/user/allUsernames')
        .then(function(userNames){
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

    UserFactory.connectDwolla = function(){
        return $http.get('/auth/dwolla');
    }

        return UserFactory;
})
