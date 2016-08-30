app.config(function($stateProvider){
  $stateProvider.state('u.account', {
    url: '/accountSettings/:id',
    templateUrl: 'js/account-settings/account-settings.html',
    controller: 'AccountSettingsCtrl',
    resolve: { allUsernames: function(UserFactory){
      return UserFactory.getAllUsernames().then(usernames=>usernames)
    }
    }
  });
});

app.controller('AccountSettingsCtrl', function($scope, $mdDialog, UserFactory, allUsernames){


$scope.allUsernames = allUsernames;

  $scope.validateEmail = function (email)
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
};

$scope.showConfirmEmail = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('')
          .textContent('Your email has been successfully updated')
          .ariaLabel('Lucky day')
          .ok('OK');
    $mdDialog.show(confirm)
  };

$scope.showConfirmUsername = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('')
          .textContent('Your username has been successfully updated')
          .ariaLabel('Lucky day')
          .ok('OK');
    $mdDialog.show(confirm)
  };

  $scope.showConfirmPassword = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('')
          .textContent('Your password has been successfully updated')
          .ariaLabel('Lucky day')
          .ok('OK');
    $mdDialog.show(confirm)
  };

  $scope.showRejectEmail = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('')
          .textContent('Invalid Email. Please try again')
          .ariaLabel('Nah')
          .ok('OK');
    $mdDialog.show(confirm)
  };

  $scope.showRejectPassword = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('')
          .textContent('Your passwords do not match. Please retype your new password')
          .ariaLabel('Nah')
          .ok('OK');
    $mdDialog.show(confirm)
  };

  $scope.showRejectPassword = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('')
          .textContent('Your username is taken or does not meet our requirements. Please try again')
          .ariaLabel('Nah')
          .ok('OK');
    $mdDialog.show(confirm)
  };

  $scope.updatePassword = function(){
    if (!$scope.passwordsMatch){
      $scope.showRejectPassword()
    }
    else{
      UserFactory.updateUser($scope.user.id, {password: $scope.password.password1}).then(function(newUser){
        $scope.showConfirmPassword();
      });
    }
}

$scope.updateUsername = function(){
  if(!$scope.usernamePasses){
    $scope.showRejectPassword()
  }
  else {
    UserFactory.updateUser($scope.user.id, {username: $scope.username.username}).then(function(newUser){
        $scope.showConfirmUsername();
      });
  }

}

  $scope.updateEmail = function(){
    var test = $scope.validateEmail($scope.newEmail);
    if(!test){
      $scope.showRejectEmail();
    }
    else{
        UserFactory.updateUser($scope.user.id, {email: $scope.newEmail})
        .then(function(user){
        $scope.showConfirmEmail();
        })
    }
  }

  $scope.newEmail = '';

  $scope.displayEmailChange = false;
  $scope.displayPasswordChange = false;
  $scope.displayUsernameChange = false;

  $scope.password = {password1: '', password2: ''};

  $scope.passwordsMatch = false;
  $scope.usernameAvailable = false;
  $scope.usernameLength = false;
  $scope.username = {};

  $scope.matching = function(){


  	if ($scope.password.password1 === $scope.password.password2 && $scope.password.password1.length>6){
  		 $scope.passwordsMatch = true;
  	}
    else{
      $scope.passwordsMatch = false;
    }
  }
$scope.usernameTest = function(){
  if($scope.allUsernames.indexOf($scope.username.username) !== -1){
    $scope.usernameAvailable = false
  }
  else if ($scope.username.username.length < 7){
    $scope.usernameAvailable = true;
    $scope.usernameLength = false;
  }
  else{
    $scope.usernameAvailable = true;
    $scope.usernameLength = true;
  }
}

  $scope.connectDwolla = function(){
    UserFactory.connectDwolla();
  }
  $scope.openPasswordChange = function(){
  	$scope.displayPasswordChange = !$scope.displayPasswordChange;
  }
  $scope.openEmailChange = function(){
    $scope.displayEmailChange = !$scope.displayEmailChange;
  }
  $scope.openUsernameChange = function(){
    $scope.displayUsernameChange = !$scope.displayUsernameChange;
  }

  $( "#passwordField1" ).on('keyup', function() {
  $scope.matching();
  });
  $( "#passwordField2" ).on('keyup', function() {
  $scope.matching();
  });
  $( "#UsernameField" ).on('keyup', function() {
  $scope.usernameTest();
  });


});
