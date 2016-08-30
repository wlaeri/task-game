app.controller('InviteFriendsCtrl', function($scope, $state, $mdDialog, $http){

    $scope.friends = [];


    $scope.addFriend = function(email) {
        let emailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
        if(!email.match(emailRegex)) return;
        let newFriendNum = $scope.friends.length + 1;
        $scope.friends.push({
            id:'friend' + newFriendNum,
            email: email
        });
    };

    $scope.removeFriend = function(friendId) {
        $scope.friends = $scope.friends.filter(e=>e.id !== friendId);
    };

    $scope.handleSubmit = function () {
        let emails = [];
        $scope.friends.forEach(friend => emails.push(friend.email));
        $http.post('/api/email/inviteFriends', {
            emails: emails,
            user: {
                firstName: $scope.user.firstName,
                lastName: $scope.user.lastName
            }
        })
        .then(function(){
            $mdDialog.show({
                templateUrl: 'js/invite-friends/success.html',
                controller: 'InviteSuccessCtrl',
                locals : {dataToPass : $scope.friends}
            });
            return $mdDialog.hide();
        })
        .catch(function(error){
            console.log(error);
        })
    }

    $scope.handleCancel = function () {
        return $mdDialog.hide();
    };

})
