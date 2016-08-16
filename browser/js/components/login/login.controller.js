app.controller('LoginCtrl', function($scope, $mdDialog){
    let vm = this;
    vm.username = null;
    vm.password = null;

    vm.handleSubmit = handleSubmit;
    vm.handleCancel = handleCancel;

    function handleSubmit() {
        return $mdDialog.hide();
    }

    function handleCancel() {
        return $mdDialog.hide();
    }
});
