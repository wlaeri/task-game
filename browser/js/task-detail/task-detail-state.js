app.config(function ($stateProvider) {
    $stateProvider.state('u.task', {
        url: '/taskDetail/:taskId',
        templateUrl: 'js/task-detail/task-detail.html',
        controller: 'TaskDeetsCtrl',
        params: {task: null},
        resolve: {
         events: function($stateParams, GameFactory, UserFactory){
        	return GameFactory.getEventsbyId($stateParams.task.id)
        	.then(function(events) {
        		return Promise.all(events.map(function(event){
        			return UserFactory.getUserInfo(event.completedById)
        				.then(function(user){
            				event.name = user.firstName + " " + user.lastName;
            					return event
            			})
            	}))
            });
        	}
    	  // events: ['$http','$stateParams', function(GameFactory, $stateParams){
       //       			return GameFactory.getEventsById($stateParams.task.id).then(events=>events);
       //   		}]
    	}
    })
});
