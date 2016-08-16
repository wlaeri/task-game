app.controller('HomeCtrl', function($scope, $mdDialog, $mdMedia){

	$scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function (loginInfo) {
    	console.log("*********** in SendLogin Function")

        $scope.error = null;

        AuthService.login(loginInfo).then(function () {
            $state.go('user');
        }).catch(function () {
            $scope.error = 'Invalid login credentials.';
        });
    };
$scope.status = ''
$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
  $scope.showAlert = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('This is an alert title')
        .textContent('You can specify some description text in here.')
        .ariaLabel('Alert Dialog Demo')
        .ok('Got it!')
        .targetEvent(ev)
    );
  };

function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}

$scope.showPrompt = function(ev) {
	console.log("In Show Prompt function")
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.prompt()
      .title('Username')
      .ariaLabel('Username')
      .initialValue('Buddy')
      .targetEvent(ev)
      .ok('Submit')
      .cancel('I\'m a cat person');
    $mdDialog.show(confirm).then(function(result) {
      $scope.status = 'You decided to name your dog ' + result + '.';
    }, function() {
      $scope.status = 'You didn\'t name your dog.';
    });
  };
});