app.config(function($stateProvider){
  $stateProvider.state('u.account', {
    url: '/user/accountSettings/:id',
    templateUrl: 'js/account-settings/account-settings.html',
    controller: 'AccountSettingsCtrl'
  });
});

app.controller('AccountSettingsCtrl', function($scope){
  $scope.hello = "hello";
});
