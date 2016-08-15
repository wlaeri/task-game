app.config(function($stateProvider){
  $stateProvider.state('accountSettings', {
    url: '/accountSettings/:id',
    templateUrl: 'js/account-settings/account-settings.html',
    controller: 'AccountSettingsCtrl'
  })
})

app.controller('AccountSettingsCtrl', function($scope){

})
