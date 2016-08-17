const nodemailer = require('nodemailer');

app.controller('InviteFriendsCtrl', function($scope, $state, $mdDialog){

    $scope.friends = [];

    console.log('invitefriends',$scope.friends);

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


        $mdDialog.show({
            templateUrl: 'js/invite-friends/success.html',
            controller: 'InviteSuccessCtrl',
            locals : {dataToPass : $scope.friends}
        });
        return $mdDialog.hide();
    }

    $scope.handleCancel = function () {
        return $mdDialog.hide();
    };

})
