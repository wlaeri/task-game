app.controller('InviteSuccessCtrl', function($scope, $mdDialog, dataToPass){

    $scope.friends = dataToPass;

    $scope.close = function () {
        return $mdDialog.hide();
    };

})
