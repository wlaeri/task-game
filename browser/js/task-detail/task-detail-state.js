app.config(function ($stateProvider) {
    $stateProvider.state('u.task', {
        url: '/taskDetail/:taskId',
        templateUrl: 'js/task-detail/task-detail.html',
        controller: 'TaskDeetsCtrl',
        params: {task: null},
        resolve: {
          task: function($stateParams){
        	return $stateParams.task;
    		}
        }
    });
});
