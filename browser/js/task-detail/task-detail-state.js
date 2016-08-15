app.config(function ($stateProvider) {
    $stateProvider.state('taskDetail', {
        url: '/taskDetail',
        templateUrl: 'js/task-detail/task-detail.html',
        controller: 'TaskDeetsCtrl'
    });
});
