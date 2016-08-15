app.config(function ($stateProvider) {
    $stateProvider.state('u.task', {
        url: '/taskDetail/:taskId',
        templateUrl: 'js/task-detail/task-detail.html',
        controller: 'TaskDeetsCtrl',
        resolve: {
          taskId: $stateParams => $stateParams.taskId
        }
    });
});
