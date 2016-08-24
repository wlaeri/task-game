app.config(function($stateProvider){
  $stateProvider.state('u.account', {
    url: '/user/accountSettings/:id',
    templateUrl: 'js/account-settings/account-settings.html',
    controller: 'AccountSettingsCtrl'
  });
});

app.controller('AccountSettingsCtrl', function($scope, UserFactory){

  $scope.updatePassword = function(){
  	UserFactory.updateUser($scope.user.id, {password: $scope.password1});
}

  $scope.newEmail = '';

  $scope.updateEmail = function(){
    console.log($scope.newEmail);
    UserFactory.updateUser($scope.user.id, {email: $scope.newEmail})
  }

  $scope.displayEmailChange = false;
  $scope.displayPasswordChange = false; 

  $scope.password = {password1: '', password2: ''};

  $scope.passwordsMatch = false

  $scope.matching = function(){
  //   var password1 = document.getElementById("passwordField1").value;
  //   var password2 = document.getElementById("passwordField2").value
  //   console.log('password1', password1, 'password2', password2);
  //   if (password1 === password2 && password1.length>6){
  //      $scope.passwordsMatch = true;
  //   }
  //   else{
  //     $scope.passwordsMatch = false;
  //   }
  // }

  	if ($scope.password.password1 === $scope.password.password2 && $scope.password.password1.length>6){
  		 $scope.passwordsMatch = true;
  	}
    else{
      $scope.passwordsMatch = false;
    }
  }

  $scope.openPasswordChange = function(){
  	$scope.displayPasswordChange = !$scope.displayPasswordChange;
  }
  $scope.openEmailChange = function(){
    $scope.displayEmailChange = !$scope.displayEmailChange;
  }

  $( "input" ).on('keyup', function() {
  $scope.matching();
});

});
