'use strict';

window.app = angular.module('Gamr', ['fsaPreBuilt', 'ui.router', 'ui.bootstrap', 'ngAnimate', 'ngMaterial', 'ngAria', 'ngMaterialDatePicker']);

app.config(function ($urlRouterProvider, $locationProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
    // Trigger page refresh when accessing an OAuth route
    $urlRouterProvider.when('/auth/:provider', function () {
        window.location.reload();
    });
});

// This app.run is for controlling access to specific states.
app.run(function ($rootScope, AuthService, $state) {

    // The given state requires an authenticated user.
    var destinationStateRequiresAuth = function destinationStateRequiresAuth(state) {
        return state.data && state.data.authenticate;
    };

    // $stateChangeStart is an event fired
    // whenever the process of changing a state begins.
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        if (!destinationStateRequiresAuth(toState)) {
            // The destination state does not require authentication
            // Short circuit with return.
            return;
        }

        if (AuthService.isAuthenticated()) {
            // The user is authenticated.
            // Short circuit with return.
            return;
        }

        // Cancel navigating to new state.
        event.preventDefault();

        AuthService.getLoggedInUser().then(function (user) {
            // If a user is retrieved, then renavigate to the destination
            // (the second time, AuthService.isAuthenticated() will work)
            // otherwise, if no user is logged in, go to "login" state.
            if (user) {
                $state.go(toState.name, toParams);
            } else {
                $state.go('login');
            }
        });
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('u.account', {
        url: '/user/accountSettings/:id',
        templateUrl: 'js/account-settings/account-settings.html',
        controller: 'AccountSettingsCtrl'
    });
});

app.controller('AccountSettingsCtrl', function ($scope) {
    $scope.hello = "hello" + $scope.user.email;
});

app.controller('AddFriendsCtrl', function ($scope, $state, $mdDialog) {

    console.log('$scope.friends', $scope.friends);

    $scope.addFriend = function (email) {
        var newFriendNum = $scope.friends.length + 1;
        $scope.friends.push({
            id: 'friend' + newFriendNum,
            email: email
        });
    };

    $scope.removeFriend = function (friendId) {
        if (friendId === 'friend1') return;
        $scope.friends = $scope.friends.filter(function (e) {
            return e.id !== friendId;
        });
    };

    $scope.handleSubmit = function () {
        //$state.go('u.create', {players: $scope.friends});
        return $mdDialog.hide();
    };

    $scope.handleCancel = function () {
        //$state.go('u.create');
        return $mdDialog.hide();
    };
});

// app.config(function ($stateProvider) {
//     $stateProvider.state('u.create.friends', {
//         url: '/friends',
//         templateUrl: 'js/add-friends/add-friends.html',
//         controller: 'AddFriendsCtrl',
//         params: {
//             friends: null
//         }
//     });
// });

app.controller('CompletedCtrl', function ($scope, completedGames) {
    $scope.completedGames = completedGames;
});

app.config(function ($stateProvider) {
    $stateProvider.state('u.completed', {
        url: '/completed',
        templateUrl: 'js/completed/completed.html',
        controller: 'CompletedCtrl',
        params: {
            user: null
        },
        resolve: {
            completedGames: function completedGames($stateParams, GameFactory) {
                return GameFactory.getCompletedGames($stateParams.user.id);
            }
        }
    });
});

app.controller('CreateGameCtrl', function ($scope, $mdDialog, $state, UserFactory, $log, GameFactory) {
    $scope.selectedItem;
    $scope.searchText = "";

    $scope.comm = {};
    $scope.comm.commissioner = $scope.user.id;
    $scope.comm.players = {
        unconfirmed: [{
            id: $scope.user.id,
            email: $scope.user.email }],
        invited: []

    };

    $scope.friends = [{
        id: 'friend1',
        email: $scope.user.email
    }];

    $scope.comm.tasks = [{
        id: 'task1',
        name: '',
        decription: '',
        points: ''
    }];

    $scope.addTask = function () {
        var newTaskNum = $scope.comm.tasks.length + 1;
        $scope.comm.tasks.push({
            id: 'task' + newTaskNum,
            name: '',
            decription: '',
            points: ''
        });
    };

    $scope.removeTask = function (taskId) {
        $scope.comm.tasks = $scope.comm.tasks.filter(function (e) {
            return e.id !== taskId;
        });
    };

    $scope.addFriends = function () {
        // $state.go('u.create.friends', {
        //     friends: $scope.players
        // });
        $mdDialog.show({
            templateUrl: 'js/add-friends/add-friends.html',
            controller: 'AddFriendsCtrl',
            scope: $scope
        });
    };
    $scope.getMatches = function (text) {
        console.log(text);
        UserFactory.autocomplete(text).then(function (users) {
            $scope.foundMatches = users;
            console.log(users);
        }).catch(function (err) {
            return $log.error;
        });
    };
    $scope.addPlayer = function (selectedItem) {
        if (selectedItem) {
            $scope.comm.players.invited.push(selectedItem);
            $scope.foundMatches = [];
        }
    };

    $scope.create = function () {
        GameFactory.createGame($scope.comm).then(function (gameId) {
            return $state.go('u.game', { gameId: gameId });
        });
    };
});

app.config(function ($stateProvider) {
    $stateProvider.state('u.create', {
        url: '/create',
        templateUrl: 'js/create-game/create-game.html',
        controller: 'CreateGameCtrl',
        params: {
            friends: null
        }
    });
});

app.controller('DashCtrl', function ($scope) {});

app.config(function ($stateProvider) {
    $stateProvider.state('u.dash', {
        url: '/',
        templateUrl: 'js/dash/dash.html'
    });
});

(function () {

    'use strict';

    // Hope you didn't forget Angular! Duh-doy.

    if (!window.angular) throw new Error('I can\'t find Angular!');

    var app = angular.module('fsaPreBuilt', []);

    app.factory('Socket', function () {
        if (!window.io) throw new Error('socket.io not found!');
        return window.io(window.location.origin);
    });

    // AUTH_EVENTS is used throughout our app to
    // broadcast and listen from and to the $rootScope
    // for important events about authentication flow.
    app.constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    });

    app.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
        var statusDict = {
            401: AUTH_EVENTS.notAuthenticated,
            403: AUTH_EVENTS.notAuthorized,
            419: AUTH_EVENTS.sessionTimeout,
            440: AUTH_EVENTS.sessionTimeout
        };
        return {
            responseError: function responseError(response) {
                $rootScope.$broadcast(statusDict[response.status], response);
                return $q.reject(response);
            }
        };
    });

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push(['$injector', function ($injector) {
            return $injector.get('AuthInterceptor');
        }]);
    });

    app.service('AuthService', function ($http, Session, $rootScope, AUTH_EVENTS, $q) {

        function onSuccessfulLogin(response) {
            var data = response.data;
            Session.create(data.id, data.user);
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            return data.user;
        }

        // Uses the session factory to see if an
        // authenticated user is currently registered.
        this.isAuthenticated = function () {
            return !!Session.user;
        };

        this.getLoggedInUser = function (fromServer) {

            // If an authenticated session exists, we
            // return the user attached to that session
            // with a promise. This ensures that we can
            // always interface with this method asynchronously.

            // Optionally, if true is given as the fromServer parameter,
            // then this cached value will not be used.

            if (this.isAuthenticated() && fromServer !== true) {
                return $q.when(Session.user);
            }

            // Make request GET /session.
            // If it returns a user, call onSuccessfulLogin with the response.
            // If it returns a 401 response, we catch it and instead resolve to null.
            return $http.get('/session').then(onSuccessfulLogin).catch(function () {
                return null;
            });
        };

        this.login = function (credentials) {
            return $http.post('/login', credentials).then(onSuccessfulLogin).catch(function () {
                return $q.reject({ message: 'Invalid login credentials.' });
            });
        };

        this.logout = function () {
            return $http.get('/logout').then(function () {
                Session.destroy();
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            });
        };
    });

    app.service('Session', function ($rootScope, AUTH_EVENTS) {

        var self = this;

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function () {
            self.destroy();
        });

        $rootScope.$on(AUTH_EVENTS.sessionTimeout, function () {
            self.destroy();
        });

        this.id = null;
        this.user = null;

        this.create = function (sessionId, user) {
            this.id = sessionId;
            this.user = user;
        };

        this.destroy = function () {
            this.id = null;
            this.user = null;
        };
    });
})();

'use strict';

app.factory('GameFactory', function ($http) {
    var GameFactory = {};

    GameFactory.getGame = function (id) {
        return $http.get('api/games/' + id).then(function (game) {
            return game.data;
        });
    };

    GameFactory.createGame = function (data) {
        return $http.post('api/games/', data).then(function (newGame) {
            return newGame.data;
        });
    };

    GameFactory.completeTask = function (data) {
        return $http.post('api/events', data).then(function (newEvent) {
            return newEvent.data;
        });
    };

    GameFactory.getUsersGames = function (id) {
        return $http.get('api/games/user/' + id).then(function (games) {
            return games.data;
        });
    };

    GameFactory.getCompletedGames = function (id) {
        return $http.get('api/games/user/' + id + '/completed').then(function (games) {
            return games.data;
        });
    };

    GameFactory.getEventsbyId = function (taskId) {
        return $http.get('api/events/task/' + taskId).then(function (newEvent) {
            return newEvent.data;
        });
    };

    GameFactory.confirmGame = function (data) {
        console.log("In confirmGame route");
        return $http.post('api/cron', data).then(function (res) {
            return res;
        });
    };

    return GameFactory;
});

app.config(function ($stateProvider) {
    $stateProvider.state('u.game', {
        url: '/game/overview/:gameId',
        templateUrl: 'js/game-overview/user-games.html',
        controller: 'GameOverviewCtrl',
        resolve: {
            gameObj: function gameObj($stateParams, GameFactory) {
                return GameFactory.getGame($stateParams.gameId);
            }
        }
    });
});

app.controller('GameOverviewCtrl', function ($scope, gameObj) {

    $scope.game = gameObj;
});

app.directive('tgLeaderboard', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/game-overview/leaderboard.html',
        scope: {
            events: '=',
            players: '=',
            tasks: '='
        },
        link: function link(scope) {
            scope.players = scope.players.map(function (player) {
                player.points = scope.events.filter(function (event) {
                    return event.completedById === player.id;
                }).map(function (event) {
                    return scope.tasks.find(function (task) {
                        return task.id === event.taskId;
                    }).points;
                }).reduce(function (prev, curr) {
                    return prev + curr;
                }, 0);
                return player;
            }).sort(function (a, b) {
                return b.points - a.points;
            });
        }
    };
});

app.directive('tgNewsfeed', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/game-overview/newsfeed.html',
        scope: {
            events: '=',
            users: '=',
            tasks: '='
        },
        link: function link(scope) {

            scope.events.forEach(function (e) {
                return e.userName = scope.users.find(function (user) {
                    return user.id == e.completedById;
                }).firstName;
            });

            scope.events.forEach(function (e) {
                var foundTask = scope.tasks.find(function (task) {
                    return task.id == e.taskId;
                });
                e.task = foundTask.name;
                e.points = foundTask.points;
            });
        }
    };
});

app.controller('HomeCtrl', function ($scope, $mdDialog) {
    $scope.login = function () {
        $mdDialog.show({
            templateUrl: 'js/login/login.html',
            controller: 'LoginCtrl'
        });
    };

    $scope.signup = function () {
        $mdDialog.show({
            templateUrl: 'js/signup/signup.html',
            controller: 'SignupCtrl'
        });
    };
});

app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html'
    });
});

app.controller('InviteFriendsCtrl', function ($scope, $state, $mdDialog, $http) {

    $scope.friends = [];

    console.log('invitefriends', $scope.friends);

    $scope.addFriend = function (email) {
        var emailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
        if (!email.match(emailRegex)) return;
        var newFriendNum = $scope.friends.length + 1;
        $scope.friends.push({
            id: 'friend' + newFriendNum,
            email: email
        });
    };

    $scope.removeFriend = function (friendId) {
        $scope.friends = $scope.friends.filter(function (e) {
            return e.id !== friendId;
        });
    };

    $scope.handleSubmit = function () {
        var emails = [];
        $scope.friends.forEach(function (friend) {
            return emails.push(friend.email);
        });
        $http.post('/api/invite', {
            emails: emails,
            user: {
                firstName: $scope.user.firstName,
                lastName: $scope.user.lastName
            }
        }).then(function () {
            $mdDialog.show({
                templateUrl: 'js/invite-friends/success.html',
                controller: 'InviteSuccessCtrl',
                locals: { dataToPass: $scope.friends }
            });
            return $mdDialog.hide();
        }).catch(function (error) {
            console.log(error);
        });
    };

    $scope.handleCancel = function () {
        return $mdDialog.hide();
    };
});

app.controller('InviteSuccessCtrl', function ($scope, $mdDialog, dataToPass) {

    $scope.friends = dataToPass;

    $scope.close = function () {
        return $mdDialog.hide();
    };
});

app.controller('LoginCtrl', function ($scope, $mdDialog, $state, AuthService) {
    $scope.email = null;
    $scope.password = null;

    $scope.handleSubmit = function () {
        $scope.error = null;

        var loginInfo = {
            email: $scope.email,
            password: $scope.password
        };

        AuthService.login(loginInfo).then(function (user) {
            $state.go('u.dash', { userId: user.id });
            return $mdDialog.hide();
        }).catch(function (err) {
            console.log(err);
            $scope.error = 'Invalid login credentials.';
        });
    };

    $scope.handleCancel = function () {
        return $mdDialog.hide();
    };
});

app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });
});

app.directive('navbar', function ($rootScope, AuthService, AUTH_EVENTS, $state) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function link(scope) {

            scope.items = [{ label: 'Home', state: 'home' }, { label: 'About', state: 'about' }, { label: 'Documentation', state: 'docs' }, { label: 'Members Only', state: 'membersOnly', auth: true }];

            scope.user = null;

            scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

            scope.logout = function () {
                AuthService.logout().then(function () {
                    $state.go('home');
                });
            };

            var setUser = function setUser() {
                AuthService.getLoggedInUser().then(function (user) {
                    scope.user = user;
                });
            };

            var removeUser = function removeUser() {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);
        }

    };
});

app.controller('SignupCtrl', function ($scope, $mdDialog, $state, UserFactory) {
    $scope.email = null;
    $scope.password = null;

    $scope.handleSubmit = function () {
        $scope.error = null;

        var signupInfo = {
            email: $scope.email,
            password: $scope.password
        };

        UserFactory.createNewUser(signupInfo).then(function (user) {
            $state.go('u.account', { user: user });
            return $mdDialog.hide();
        }).catch(function (err) {
            $scope.error = err.message;
        });
    };

    $scope.handleCancel = function () {
        return $mdDialog.hide();
    };
});

app.config(function ($stateProvider) {

    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'js/signup/signup.html',
        controller: 'SignupCtrl'
    });
});

app.factory('TaskDeetsFactory', function ($scope, $mdSidenav, $mdMedia, $state, $http) {});
app.config(function ($stateProvider) {
    $stateProvider.state('u.task', {
        url: '/taskDetail/:taskId',
        templateUrl: 'js/task-detail/task-detail.html',
        controller: 'TaskDeetsCtrl',
        params: { task: null },
        resolve: {
            events: function events($stateParams, GameFactory, UserFactory) {
                return GameFactory.getEventsbyId($stateParams.task.id).then(function (events) {
                    return Promise.all(events.map(function (event) {
                        return UserFactory.getUserInfo(event.completedById).then(function (user) {
                            event.name = user.firstName + " " + user.lastName;
                            return event;
                        });
                    }));
                });
            }
            // events: ['$http','$stateParams', function(GameFactory, $stateParams){
            //       			return GameFactory.getEventsById($stateParams.task.id).then(events=>events);
            //   		}]
        }
    });
});

app.controller('TaskDeetsCtrl', function ($scope, $rootScope, $mdSidenav, $mdMedia, $mdDialog, $stateParams, GameFactory, UserFactory, events) {

    $scope.convertDate = function (SequelizeDate) {
        var YearMonthDay = SequelizeDate.match(/[^T]*/);
        YearMonthDay = YearMonthDay[0].split('-');
        var Year = YearMonthDay[0];
        var Month = YearMonthDay[1];
        var Day = YearMonthDay[2];
        var time = SequelizeDate.slice(SequelizeDate.indexOf("T") + 1, -8);
        console.log(time);
        // return YearMonthDay + " " + time;
        return Month + "/" + Day + "/" + Year + " " + time;
    };

    $scope.task = $stateParams.task;

    $scope.events = events.map(function (event) {
        event.createdAt = $scope.convertDate(event.createdAt);
        return event;
    });
    // .map(function(event){
    //     return UserFactory.getUserInfo(event.completedById)
    //     .then(function(user){
    //         event.name = user.firstName + " " + user.lastName;
    //         return event});
    // })
    // ).then(function(eventArray){
    //     $scope.eventNames = eventArray;
    //     $scope.eventNames.map(function(event){
    //     event.createdAt = $scope.convertDate(event.createdAt) 
    //     return event;
    // })
    //     return eventArray
    // });

    // $scope.updatedEventDates = $scope.events.map(function(event){
    //     event.createdAt = $scope.convertDate(event.createdAt) 
    //     return event;
    // });

    // $scope.eventDates = $scope.events.map(function(event){
    //     event.date = $scope.convertDate(event.date);
    //     return event.date;
    // })

    // $scope.completeTask = GameFactory.completeTask(info);

    // $scope.events1 = events

    $scope.testEventObj = function () {
        console.log("***** events ", $scope.events);
        // console.log("events1 ", events1)
    };

    $scope.testEventObj();

    $scope.status = null;

    $scope.showConfirm = function (ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm().title('Are you sure you completed this task?').textContent('Tasks will be verified by the other players in the game').ariaLabel('Yes, I did').targetEvent(ev).ok('Yes, I did').cancel('No, I have not');
        $mdDialog.show(confirm).then(function () {
            $scope.status = 'Completed';
            console.log($scope.status);
            GameFactory.completeTask({ completedById: $scope.user.id, taskId: $scope.task.id, gameId: $scope.task.gameId }).then(function (task) {
                return task;
            });
        }, function () {
            $scope.status = 'Not Completed';
            console.log($scope.status);
        });
    };
});

app.controller('UserCtrl', function ($scope, $state, $stateParams, AuthService, usersGames, $mdDialog, user) {
    $scope.user = user;

    $scope.isLoggedIn = function () {
        return AuthService.isAuthenticated();
    };

    $scope.menuItems = usersGames.filter(function (game) {
        return game.status !== 'Completed';
    });

    // awaiting usage
    // $scope.completedGames = usersGames.filter(game => game.status === 'Completed');

    $scope.goToEdit = function (commissionerID, locked) {
        return commissionerID === $scope.user.id && !locked;
    };

    $scope.invite = function () {
        $mdDialog.show({
            templateUrl: 'js/invite-friends/invite-friends.html',
            controller: 'InviteFriendsCtrl',
            scope: $scope
        });
    };
    $scope.logout = function () {
        console.log("In the logout function on scope.");
        AuthService.logout().then(function () {
            $state.go('home');
        }).catch(function (err) {
            console.log(err);
        });
    };
    $scope.dashBoard = function () {
        $state.go('u.dash');
    };
});

app.factory('UserFactory', function ($state, $http) {

    var UserFactory = {};

    UserFactory.getUserInfo = function (id) {
        return $http.get('/api/user/' + id).then(function (user) {
            return user.data;
        });
    };

    UserFactory.createNewUser = function (signupInfo) {
        return $http.post('/signup', signupInfo).then(function (newUser) {
            return newUser.data.user;
        });
    };

    UserFactory.updateUser = function (id) {
        return $http.put('/api/user/' + id).then(function (updatedUser) {
            return updatedUser.data;
        });
    };

    UserFactory.autocomplete = function (str) {
        return $http.get('/api/user/invite/' + str).then(function (users) {
            return users.data;
        });
    };

    return UserFactory;
});

app.config(function ($stateProvider) {
    $stateProvider.state('u', {
        url: '/u/:userId',
        templateUrl: 'js/user/user.html',
        controller: 'UserCtrl',
        data: { authenticate: true },
        resolve: {
            usersGames: function usersGames($stateParams, GameFactory, AuthService) {
                console.log("Checking AuthServiceGLIU", AuthService.getLoggedInUser());
                return AuthService.getLoggedInUser().then(function (user) {
                    console.log("State USer Promise: ", user);
                    return GameFactory.getUsersGames(user.id);
                });
            },
            user: function user($stateParams, AuthService) {
                return AuthService.getLoggedInUser();
            }
        }
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('userGameDetail', {
        url: '/game/user',
        templateUrl: 'js/user-game-detail/user-game-detail.html',
        controller: 'UserGameCtrl'
    });
});

app.controller('UserGameCtrl', function ($scope, $mdSidenav, $mdMedia) {
    $scope.openLeftMenu = function () {
        $mdSidenav('left').toggle();
    };
    $scope.menuItems = [{
        name: "Keep Apartment PHA Clean"
    }, {
        name: "Game2"
    }, {
        name: "Game3"
    }, {
        name: "Game4"
    }, {
        name: "Game5"
    }];
    $scope.tasks = [];
    for (var i = 0; i < 5; i++) {
        $scope.tasks.push({ name: 'Task', points: Math.floor(Math.random() * 10) + 1, time: new Date(new Date() - (Math.floor(Math.random() * 1e9) + 1)).toString().split(" ").slice(0, 5).join(" ") });
    }
    $scope.totalPoints = $scope.tasks.reduce(function (prev, curr) {
        return prev + curr.points;
    }, 0);
    console.log($scope.tasks);
    $scope.elipses = $scope.menuItems.length > 4;
    console.log($scope.elipses);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFjY291bnQtc2V0dGluZ3MvYWNjb3VudC1zZXR0aW5ncy5qcyIsImFkZC1mcmllbmRzL2FkZC1mcmllbmRzLmNvbnRyb2xsZXIuanMiLCJhZGQtZnJpZW5kcy9hZGQtZnJpZW5kcy5zdGF0ZS5qcyIsImNvbXBsZXRlZC9jb21wbGV0ZWQuY29udHJvbGxlci5qcyIsImNvbXBsZXRlZC9jb21wbGV0ZWQuc3RhdGUuanMiLCJjcmVhdGUtZ2FtZS9jcmVhdGUtZ2FtZS5jb250cm9sbGVyLmpzIiwiY3JlYXRlLWdhbWUvY3JlYXRlLWdhbWUuc3RhdGUuanMiLCJkYXNoL2Rhc2guY29udHJvbGxlci5qcyIsImRhc2gvZGFzaC5zdGF0ZS5qcyIsImZzYS9mc2EtcHJlLWJ1aWx0LmpzIiwiZ2FtZS1vdmVydmlldy9nYW1lLWZhY3RvcnkuanMiLCJnYW1lLW92ZXJ2aWV3L2dhbWUtb3ZlcnZpZXcuanMiLCJnYW1lLW92ZXJ2aWV3L2xlYWRlcmJvYXJkLmpzIiwiZ2FtZS1vdmVydmlldy9uZXdzZmVlZC5qcyIsImhvbWUvaG9tZS5jb250cm9sbGVyLmpzIiwiaG9tZS9ob21lLnN0YXRlLmpzIiwiaW52aXRlLWZyaWVuZHMvaW52aXRlLWZyaWVuZHMuY29udHJvbGxlci5qcyIsImludml0ZS1mcmllbmRzL3N1Y2Nlc3MuY29udHJvbGxlci5qcyIsImxvZ2luL2xvZ2luLmNvbnRyb2xsZXIuanMiLCJsb2dpbi9sb2dpbi5zdGF0ZS5qcyIsIm9sZC1uYXZiYXIvbmF2YmFyLmpzIiwic2lnbnVwL3NpZ251cC5jb250cm9sbGVyLmpzIiwic2lnbnVwL3NpZ251cC5zdGF0ZS5qcyIsInRhc2stZGV0YWlsL3Rhc2stZGV0YWlsLWZhY3RvcnkuanMiLCJ0YXNrLWRldGFpbC90YXNrLWRldGFpbC1zdGF0ZS5qcyIsInRhc2stZGV0YWlsL3Rhc2stZGV0YWlsLmNvbnRyb2xsZXIuanMiLCJ1c2VyL3VzZXIuY29udHJvbGxlci5qcyIsInVzZXIvdXNlci5mYWN0b3J5LmpzIiwidXNlci91c2VyLnN0YXRlLmpzIiwidXNlci1nYW1lLWRldGFpbC91c2VyLWdhbWUtZGV0YWlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUNBLE9BQUEsR0FBQSxHQUFBLFFBQUEsTUFBQSxDQUFBLE1BQUEsRUFBQSxDQUNBLGFBREEsRUFFQSxXQUZBLEVBR0EsY0FIQSxFQUlBLFdBSkEsRUFLQSxZQUxBLEVBTUEsUUFOQSxFQU9BLHNCQVBBLENBQUEsQ0FBQTs7QUFVQSxJQUFBLE1BQUEsQ0FBQSxVQUFBLGtCQUFBLEVBQUEsaUJBQUEsRUFBQTtBQUNBO0FBQ0Esc0JBQUEsU0FBQSxDQUFBLElBQUE7QUFDQTtBQUNBLHVCQUFBLFNBQUEsQ0FBQSxHQUFBO0FBQ0E7QUFDQSx1QkFBQSxJQUFBLENBQUEsaUJBQUEsRUFBQSxZQUFBO0FBQ0EsZUFBQSxRQUFBLENBQUEsTUFBQTtBQUNBLEtBRkE7QUFJQSxDQVZBOztBQVlBO0FBQ0EsSUFBQSxHQUFBLENBQUEsVUFBQSxVQUFBLEVBQUEsV0FBQSxFQUFBLE1BQUEsRUFBQTs7QUFFQTtBQUNBLFFBQUEsK0JBQUEsU0FBQSw0QkFBQSxDQUFBLEtBQUEsRUFBQTtBQUNBLGVBQUEsTUFBQSxJQUFBLElBQUEsTUFBQSxJQUFBLENBQUEsWUFBQTtBQUNBLEtBRkE7O0FBSUE7QUFDQTtBQUNBLGVBQUEsR0FBQSxDQUFBLG1CQUFBLEVBQUEsVUFBQSxLQUFBLEVBQUEsT0FBQSxFQUFBLFFBQUEsRUFBQTtBQUNBLFlBQUEsQ0FBQSw2QkFBQSxPQUFBLENBQUEsRUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFlBQUEsWUFBQSxlQUFBLEVBQUEsRUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBQSxjQUFBOztBQUVBLG9CQUFBLGVBQUEsR0FBQSxJQUFBLENBQUEsVUFBQSxJQUFBLEVBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBQSxJQUFBLEVBQUE7QUFDQSx1QkFBQSxFQUFBLENBQUEsUUFBQSxJQUFBLEVBQUEsUUFBQTtBQUNBLGFBRkEsTUFFQTtBQUNBLHVCQUFBLEVBQUEsQ0FBQSxPQUFBO0FBQ0E7QUFDQSxTQVRBO0FBV0EsS0EzQkE7QUE2QkEsQ0F0Q0E7O0FDeEJBLElBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFBO0FBQ0EsbUJBQUEsS0FBQSxDQUFBLFdBQUEsRUFBQTtBQUNBLGFBQUEsMkJBREE7QUFFQSxxQkFBQSwyQ0FGQTtBQUdBLG9CQUFBO0FBSEEsS0FBQTtBQUtBLENBTkE7O0FBUUEsSUFBQSxVQUFBLENBQUEscUJBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQTtBQUNBLFdBQUEsS0FBQSxHQUFBLFVBQUEsT0FBQSxJQUFBLENBQUEsS0FBQTtBQUNBLENBRkE7O0FDUkEsSUFBQSxVQUFBLENBQUEsZ0JBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsU0FBQSxFQUFBOztBQUVBLFlBQUEsR0FBQSxDQUFBLGdCQUFBLEVBQUEsT0FBQSxPQUFBOztBQUVBLFdBQUEsU0FBQSxHQUFBLFVBQUEsS0FBQSxFQUFBO0FBQ0EsWUFBQSxlQUFBLE9BQUEsT0FBQSxDQUFBLE1BQUEsR0FBQSxDQUFBO0FBQ0EsZUFBQSxPQUFBLENBQUEsSUFBQSxDQUFBO0FBQ0EsZ0JBQUEsV0FBQSxZQURBO0FBRUEsbUJBQUE7QUFGQSxTQUFBO0FBSUEsS0FOQTs7QUFRQSxXQUFBLFlBQUEsR0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLFlBQUEsYUFBQSxTQUFBLEVBQUE7QUFDQSxlQUFBLE9BQUEsR0FBQSxPQUFBLE9BQUEsQ0FBQSxNQUFBLENBQUE7QUFBQSxtQkFBQSxFQUFBLEVBQUEsS0FBQSxRQUFBO0FBQUEsU0FBQSxDQUFBO0FBQ0EsS0FIQTs7QUFLQSxXQUFBLFlBQUEsR0FBQSxZQUFBO0FBQ0E7QUFDQSxlQUFBLFVBQUEsSUFBQSxFQUFBO0FBQ0EsS0FIQTs7QUFLQSxXQUFBLFlBQUEsR0FBQSxZQUFBO0FBQ0E7QUFDQSxlQUFBLFVBQUEsSUFBQSxFQUFBO0FBQ0EsS0FIQTtBQUtBLENBM0JBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBLElBQUEsVUFBQSxDQUFBLGVBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxjQUFBLEVBQUE7QUFDQSxXQUFBLGNBQUEsR0FBQSxjQUFBO0FBQ0EsQ0FGQTs7QUNBQSxJQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTtBQUNBLG1CQUFBLEtBQUEsQ0FBQSxhQUFBLEVBQUE7QUFDQSxhQUFBLFlBREE7QUFFQSxxQkFBQSw2QkFGQTtBQUdBLG9CQUFBLGVBSEE7QUFJQSxnQkFBQTtBQUNBLGtCQUFBO0FBREEsU0FKQTtBQU9BLGlCQUFBO0FBQ0EsNEJBQUEsd0JBQUEsWUFBQSxFQUFBLFdBQUEsRUFBQTtBQUNBLHVCQUFBLFlBQUEsaUJBQUEsQ0FBQSxhQUFBLElBQUEsQ0FBQSxFQUFBLENBQUE7QUFDQTtBQUhBO0FBUEEsS0FBQTtBQWFBLENBZEE7O0FDQUEsSUFBQSxVQUFBLENBQUEsZ0JBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxTQUFBLEVBQUEsTUFBQSxFQUFBLFdBQUEsRUFBQSxJQUFBLEVBQUEsV0FBQSxFQUFBO0FBQ0EsV0FBQSxZQUFBO0FBQ0EsV0FBQSxVQUFBLEdBQUEsRUFBQTs7QUFFQSxXQUFBLElBQUEsR0FBQSxFQUFBO0FBQ0EsV0FBQSxJQUFBLENBQUEsWUFBQSxHQUFBLE9BQUEsSUFBQSxDQUFBLEVBQUE7QUFDQSxXQUFBLElBQUEsQ0FBQSxPQUFBLEdBQUE7QUFDQSxxQkFBQSxDQUFBO0FBQ0EsZ0JBQUEsT0FBQSxJQUFBLENBQUEsRUFEQTtBQUVBLG1CQUFBLE9BQUEsSUFBQSxDQUFBLEtBRkEsRUFBQSxDQURBO0FBSUEsaUJBQUE7O0FBSkEsS0FBQTs7QUFRQSxXQUFBLE9BQUEsR0FBQSxDQUFBO0FBQ0EsWUFBQSxTQURBO0FBRUEsZUFBQSxPQUFBLElBQUEsQ0FBQTtBQUZBLEtBQUEsQ0FBQTs7QUFLQSxXQUFBLElBQUEsQ0FBQSxLQUFBLEdBQUEsQ0FBQTtBQUNBLFlBQUEs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QUFBLEdBQUEsVUFBQSxTQUFBLEVBQUEsSUFBQSxFQUFBO0FBQ0EsaUJBQUEsRUFBQSxHQUFBLFNBQUE7QUFDQSxpQkFBQSxJQUFBLEdBQUEsSUFBQTtBQUNBLFNBSEE7O0FBS0EsYUFBQSxPQUFBLEdBQUEsWUFBQTtBQUNBLGlCQUFBLEVBQUEsR0FBQSxJQUFBO0FBQ0EsaUJBQUEsSUFBQSxHQUFBLElBQUE7QUFDQSxTQUhBO0FBS0EsS0F6QkE7QUEyQkEsQ0FwSUE7O0FDQUE7O0FBRUEsSUFBQSxPQUFBLENBQUEsYUFBQSxFQUFBLFVBQUEsS0FBQSxFQUFBO0FBQ0EsUUFBQSxjQUFBLEVBQUE7O0FBRUEsZ0JBQUEsT0FBQSxHQUFBLFVBQUEsRUFBQSxFQUFBO0FBQ0EsZUFBQSxNQUFBLEdBQUEsQ0FBQSxlQUFBLEVBQUEsRUFDQSxJQURBLENBQ0E7QUFBQSxtQkFBQSxLQUFBLElBQUE7QUFBQSxTQURBLENBQUE7QUFFQSxLQUhBOztBQUtBLGdCQUFBLFVBQUEsR0FBQSxVQUFBLElBQUEsRUFBQTtBQUNBLGVBQUEsTUFBQSxJQUFBLENBQUEsWUFBQSxFQUFBLElBQUEsRUFDQSxJQURBLENBQ0E7QUFBQSxtQkFBQSxRQUFBLElBQUE7QUFBQSxTQURBLENBQUE7QUFFQSxLQUhBOztBQUtBLGdCQUFBLFlBQUEsR0FBQSxVQUFBLElBQUEsRUFBQTtBQUNBLGVBQUEsTUFBQSxJQUFBLENBQUEsWUFBQSxFQUFBLElBQUEsRUFDQSxJQURBLENBQ0E7QUFBQSxtQkFBQSxTQUFBLElBQUE7QUFBQSxTQURBLENBQUE7QUFFQSxLQUhBOztBQUtBLGdCQUFBLGFBQUEsR0FBQSxVQUFBLEVBQUEsRUFBQTtBQUNBLGVBQUEsTUFBQSxHQUFBLENBQUEsb0JBQUEsRUFBQSxFQUNBLElBREEsQ0FDQTtBQUFBLG1CQUFBLE1BQUEsSUFBQTtBQUFBLFNBREEsQ0FBQTtBQUVBLEtBSEE7O0FBS0EsZ0JBQUEsaUJBQUEsR0FBQSxVQUFBLEVBQUEsRUFBQTtBQUNBLGVBQUEsTUFBQSxHQUFBLENBQUEsb0JBQUEsRUFBQSxHQUFB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Q0EsSUFEQSxDQUNBLFVBQUEsSUFBQSxFQUFBO0FBQ0Esa0NBQUEsSUFBQSxHQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUEsR0FBQSxLQUFBLFFBQUE7QUFDQSxtQ0FBQSxLQUFBO0FBQ0EseUJBSkEsQ0FBQTtBQUtBLHFCQU5BLENBQUEsQ0FBQTtBQU9BLGlCQVRBLENBQUE7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQWZBO0FBTEEsS0FBQTtBQXVCQSxDQXhCQTs7QUNBQSxJQUFBLFVBQUEsQ0FBQSxlQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsVUFBQSxFQUFBLFVBQUEsRUFBQSxRQUFBLEVBQUEsU0FBQSxFQUFBLFlBQUEsRUFBQSxXQUFBLEVBQUEsV0FBQSxFQUFBLE1BQUEsRUFBQTs7QUFFQSxXQUFBLFdBQUEsR0FBQSxVQUFBLGFBQUEsRUFBQTtBQUNBLFlBQUEsZUFBQSxjQUFBLEtBQUEsQ0FBQSxPQUFBLENBQUE7QUFDQSx1QkFBQSxhQUFBLENBQUEsRUFBQSxLQUFBLENBQUEsR0FBQSxDQUFBO0FBQ0EsWUFBQSxPQUFBLGFBQUEsQ0FBQSxDQUFBO0FBQ0EsWUFBQSxRQUFBLGFBQUEsQ0FBQSxDQUFBO0FBQ0EsWUFBQSxNQUFBLGFBQUEsQ0FBQSxDQUFBO0FBQ0EsWUFBQSxPQUFBLGNBQUEsS0FBQSxDQUFBLGNBQUEsT0FBQSxDQUFBLEdBQUEsSUFBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxnQkFBQSxHQUFBLENBQUEsSUFBQTtBQUNBO0FBQ0EsZUFBQSxRQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQTtBQUNBLEtBVkE7O0FBWUEsV0FBQSxJQUFBLEdBQUEsYUFBQSxJQUFBOztBQUVBLFdBQUEsTUFBQSxHQUFBLE9BQUEsR0FBQSxDQUFBLFVBQUEsS0FBQSxFQUFBO0FBQ0EsY0FBQSxTQUFBLEdBQUEsT0FBQSxXQUFBLENBQUEsTUFBQSxTQUFBLENBQUE7QUFDQSxlQUFBLEtBQUE7QUFDQSxLQUhBLENBQUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLFdBQUEsWUFBQSxHQUFBLFlBQUE7QUFDQSxnQkFBQSxHQUFBLENBQUEsZUFBQSxFQUFBLE9BQUEsTUFBQTtBQUNBO0FBQ0EsS0FIQTs7QUFLQSxXQUFBLFlBQUE7O0FBRUEsV0FBQSxNQUFBLEdBQUEsSUFBQTs7QUFFQSxXQUFBLFdBQUEsR0FBQSxVQUFBLEVBQUEsRUFBQTtBQUNBO0FBQ0EsWUFBQSxVQUFBLFVBQUEsT0FBQSxHQUNBLEtBREEsQ0FDQSx1Q0FEQSxFQUVBLFdBRkEsQ0FFQSx5REFGQSxFQUdBLFNBSEEsQ0FHQSxZQUhBLEVBSUEsV0FKQSxDQUlBLEVBSkEsRUFLQSxFQUxBLENBS0EsWUFMQSxFQU1BLE1BTkEsQ0FNQSxnQkFOQSxDQUFBO0FBT0Esa0JBQUEsSUFBQSxDQUFBLE9BQUEsRUFBQSxJQUFBLENBQUEsWUFBQTtBQUNBLG1CQUFBLE1BQUEsR0FBQSxXQUFBO0FBQ0Esb0JBQUEsR0FBQSxDQUFBLE9BQUEsTUFBQTtBQUNBLHdCQUFBLFlBQUEsQ0FBQSxFQUFBLGVBQUEsT0FBQSxJQUFBLENBQUEsRUFBQSxFQUFBLFFBQUEsT0FBQSxJQUFBLENBQUEsRUFBQSxFQUFBLFFBQUEsT0FBQSxJQUFBLENBQUEsTUFBQSxFQUFBLEVBQ0EsSUFEQSxDQUNBO0FBQUEsdUJBQUEsSUFBQTtBQUFBLGFBREE7QUFFQSxTQUxBLEVBS0EsWUFBQTtBQUNBLG1CQUFBLE1BQUEsR0FBQSxlQUFBO0FBQ0Esb0JBQUEsR0FBQSxDQUFBLE9BQUEsTUFBQTtBQUNBLFNBUkE7QUFTQSxLQWxCQTtBQW1CQSxDQTdFQTs7QUNBQSxJQUFBLFVBQUEsQ0FBQSxVQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLFlBQUEsRUFBQSxXQUFBLEVBQUEsVUFBQSxFQUFBLFNBQUEsRUFBQSxJQUFBLEVBQUE7QUFDQSxXQUFBLElBQUEsR0FBQSxJQUFBOztBQUVBLFdBQUEsVUFBQSxHQUFBLFlBQUE7QUFDQSxlQUFBLFlBQUEsZUFBQSxFQUFBO0FBQ0EsS0FGQTs7QUFJQSxXQUFBLFNBQUEsR0FBQSxXQUFBLE1BQUEsQ0FBQTtBQUFBLGVBQUEsS0FBQSxNQUFBLEtBQUEsV0FBQTtBQUFBLEtBQUEsQ0FBQTs7QUFFQTtBQUNBOztBQUVBLFdBQUEsUUFBQSxHQUFBLFVBQUEsY0FBQSxFQUFBLE1BQUEsRUFBQTtBQUNBLGVBQUEsbUJBQUEsT0FBQSxJQUFBLENBQUEsRUFBQSxJQUFBLENBQUEsTUFBQTtBQUNBLEtBRkE7O0FBSUEsV0FBQSxNQUFBLEdBQUEsWUFBQTtBQUNBLGtCQUFBLElBQUEsQ0FBQTtBQUNBLHlCQUFBLHVDQURBO0FBRUEsd0JBQUEsbUJBRkE7QUFHQSxtQkFBQTtBQUhBLFNBQUE7QUFLQSxLQU5BO0FBT0EsV0FBQSxNQUFBLEdBQUEsWUFBQTtBQUNBLGdCQUFBLEdBQUEsQ0FBQSxrQ0FBQTtBQUNBLG9CQUFBLE1BQUEsR0FDQSxJQURBLENBQ0EsWUFBQTtBQUNBLG1CQUFBLEVBQUEsQ0FBQSxNQUFBO0FBQ0EsU0FIQSxFQUlBLEtBSkEsQ0FJQSxVQUFBLEdBQUEsRUFBQTtBQUNBLG9CQUFBLEdBQUEsQ0FBQSxHQUFBO0FBQ0EsU0FOQTtBQU9BLEtBVEE7QUFVQSxXQUFBLFNBQUEsR0FBQSxZQUFBO0FBQ0EsZUFBQSxFQUFBLENBQUEsUUFBQTtBQUNBLEtBRkE7QUFHQSxDQXBDQTs7QUNBQSxJQUFBLE9BQUEsQ0FBQSxhQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsS0FBQSxFQUFBOztBQUVBLFFBQUEsY0FBQSxFQUFBOztBQUVBLGdCQUFBLFdBQUEsR0FBQSxVQUFBLEVBQUEsRUFBQTtBQUNBLGVBQUEsTUFBQSxHQUFBLENBQUEsZUFBQSxFQUFBLEVBQ0EsSUFEQSxDQUNBLFVBQUEsSUFBQSxFQUFBO0FBQ0EsbUJBQUEsS0FBQSxJQUFBO0FBQ0EsU0FIQSxDQUFBO0FBSUEsS0FM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QTtBQUFBLGVBQUEsT0FBQSxLQUFBLE1BQUE7QUFBQSxLQUFBLEVBQUEsQ0FBQSxDQUFBO0FBQ0EsWUFBQSxHQUFBLENBQUEsT0FBQSxLQUFBO0FBQ0EsV0FBQSxPQUFBLEdBQUEsT0FBQSxTQUFBLENBQUEsTUFBQSxHQUFBLENBQUE7QUFDQSxZQUFBLEdBQUEsQ0FBQSxPQUFBLE9BQUE7QUFDQSxDQXZCQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xud2luZG93LmFwcCA9IGFuZ3VsYXIubW9kdWxlKCdHYW1yJywgW1xuICAgICdmc2FQcmVCdWlsdCcsXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3VpLmJvb3RzdHJhcCcsXG4gICAgJ25nQW5pbWF0ZScsXG4gICAgJ25nTWF0ZXJpYWwnLFxuICAgICduZ0FyaWEnLFxuICAgICduZ01hdGVyaWFsRGF0ZVBpY2tlcidcbl0pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG4gICAgLy8gVGhpcyB0dXJucyBvZmYgaGFzaGJhbmcgdXJscyAoLyNhYm91dCkgYW5kIGNoYW5nZXMgaXQgdG8gc29tZXRoaW5nIG5vcm1hbCAoL2Fib3V0KVxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICAvLyBJZiB3ZSBnbyB0byBhIFVSTCB0aGF0IHVpLXJvdXRlciBkb2Vzbid0IGhhdmUgcmVnaXN0ZXJlZCwgZ28gdG8gdGhlIFwiL1wiIHVybC5cbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG4gICAgLy8gVHJpZ2dlciBwYWdlIHJlZnJlc2ggd2hlbiBhY2Nlc3NpbmcgYW4gT0F1dGggcm91dGVcbiAgICAkdXJsUm91dGVyUHJvdmlkZXIud2hlbignL2F1dGgvOnByb3ZpZGVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfSk7XG5cbn0pO1xuXG4vLyBUaGlzIGFwcC5ydW4gaXMgZm9yIGNvbnRyb2xsaW5nIGFjY2VzcyB0byBzcGVjaWZpYyBzdGF0ZXMuXG5hcHAucnVuKGZ1bmN0aW9uICgkcm9vdFNjb3BlLCBBdXRoU2VydmljZSwgJHN0YXRlKSB7XG5cbiAgICAvLyBUaGUgZ2l2ZW4gc3RhdGUgcmVxdWlyZXMgYW4gYXV0aGVudGljYXRlZCB1c2VyLlxuICAgIHZhciBkZXN0aW5hdGlvblN0YXRlUmVxdWlyZXNBdXRoID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZS5kYXRhICYmIHN0YXRlLmRhdGEuYXV0aGVudGljYXRlO1xuICAgIH07XG5cbiAgICAvLyAkc3RhdGVDaGFuZ2VTdGFydCBpcyBhbiBldmVudCBmaXJlZFxuICAgIC8vIHdoZW5ldmVyIHRoZSBwcm9jZXNzIG9mIGNoYW5naW5nIGEgc3RhdGUgYmVnaW5zLlxuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMpIHtcbiAgICAgICAgaWYgKCFkZXN0aW5hdGlvblN0YXRlUmVxdWlyZXNBdXRoKHRvU3RhdGUpKSB7XG4gICAgICAgICAgICAvLyBUaGUgZGVzdGluYXRpb24gc3RhdGUgZG9lcyBub3QgcmVxdWlyZSBhdXRoZW50aWNhdGlvblxuICAgICAgICAgICAgLy8gU2hvcnQgY2lyY3VpdCB3aXRoIHJldHVybi5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuICAgICAgICAgICAgLy8gVGhlIHVzZXIgaXMgYXV0aGVudGljYXRlZC5cbiAgICAgICAgICAgIC8vIFNob3J0IGNpcmN1aXQgd2l0aCByZXR1cm4uXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDYW5jZWwgbmF2aWdhdGluZyB0byBuZXcgc3RhdGUuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgQXV0aFNlcnZpY2UuZ2V0TG9nZ2VkSW5Vc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICAgICAgLy8gSWYgYSB1c2VyIGlzIHJldHJpZXZlZCwgdGhlbiByZW5hdmlnYXRlIHRvIHRoZSBkZXN0aW5hdGlvblxuICAgICAgICAgICAgLy8gKHRoZSBzZWNvbmQgdGltZSwgQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkgd2lsbCB3b3JrKVxuICAgICAgICAgICAgLy8gb3RoZXJ3aXNlLCBpZiBubyB1c2VyIGlzIGxvZ2dlZCBpbiwgZ28gdG8gXCJsb2dpblwiIHN0YXRlLlxuICAgICAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28odG9TdGF0ZS5uYW1lLCB0b1BhcmFtcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3UuYWNjb3VudCcsIHtcbiAgICB1cmw6ICcvdXNlci9hY2NvdW50U2V0dGluZ3MvOmlkJyxcbiAgICB0ZW1wbGF0ZVVybDogJ2pzL2FjY291bnQtc2V0dGluZ3MvYWNjb3VudC1zZXR0aW5ncy5odG1sJyxcbiAgICBjb250cm9sbGVyOiAnQWNjb3VudFNldHRpbmdzQ3RybCdcbiAgfSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0FjY291bnRTZXR0aW5nc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUpe1xuICAkc2NvcGUuaGVsbG8gPSBcImhlbGxvXCIrJHNjb3BlLnVzZXIuZW1haWw7XG59KTtcbiIsImFwcC5jb250cm9sbGVyKCdBZGRGcmllbmRzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCAkbWREaWFsb2cpe1xuXG4gICAgY29uc29sZS5sb2coJyRzY29wZS5mcmllbmRzJywgJHNjb3BlLmZyaWVuZHMpO1xuXG4gICAgJHNjb3BlLmFkZEZyaWVuZCA9IGZ1bmN0aW9uKGVtYWlsKSB7XG4gICAgICAgIGxldCBuZXdGcmllbmROdW0gPSAkc2NvcGUuZnJpZW5kcy5sZW5ndGggKyAxO1xuICAgICAgICAkc2NvcGUuZnJpZW5kcy5wdXNoKHtcbiAgICAgICAgICAgIGlkOidmcmllbmQnICsgbmV3RnJpZW5kTnVtLFxuICAgICAgICAgICAgZW1haWw6IGVtYWlsXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUucmVtb3ZlRnJpZW5kID0gZnVuY3Rpb24oZnJpZW5kSWQpIHtcbiAgICAgICAgaWYoZnJpZW5kSWQgPT09ICdmcmllbmQxJykgcmV0dXJuO1xuICAgICAgICAkc2NvcGUuZnJpZW5kcyA9ICRzY29wZS5mcmllbmRzLmZpbHRlcihlPT5lLmlkICE9PSBmcmllbmRJZCk7XG4gICAgfTtcblxuICAgICRzY29wZS5oYW5kbGVTdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vJHN0YXRlLmdvKCd1LmNyZWF0ZScsIHtwbGF5ZXJzOiAkc2NvcGUuZnJpZW5kc30pO1xuICAgICAgICByZXR1cm4gJG1kRGlhbG9nLmhpZGUoKTtcbiAgICB9XG5cbiAgICAkc2NvcGUuaGFuZGxlQ2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyRzdGF0ZS5nbygndS5jcmVhdGUnKTtcbiAgICAgICAgcmV0dXJuICRtZERpYWxvZy5oaWRlKCk7XG4gICAgfTtcblxufSlcbiIsIi8vIGFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4vLyAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3UuY3JlYXRlLmZyaWVuZHMnLCB7XG4vLyAgICAgICAgIHVybDogJy9mcmllbmRzJyxcbi8vICAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9hZGQtZnJpZW5kcy9hZGQtZnJpZW5kcy5odG1sJyxcbi8vICAgICAgICAgY29udHJvbGxlcjogJ0FkZEZyaWVuZHNDdHJsJyxcbi8vICAgICAgICAgcGFyYW1zOiB7XG4vLyAgICAgICAgICAgICBmcmllbmRzOiBudWxsXG4vLyAgICAgICAgIH1cbi8vICAgICB9KTtcbi8vIH0pO1xuIiwiYXBwLmNvbnRyb2xsZXIoJ0NvbXBsZXRlZEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIGNvbXBsZXRlZEdhbWVzKSB7XG4gICRzY29wZS5jb21wbGV0ZWRHYW1lcyA9IGNvbXBsZXRlZEdhbWVzO1xufSlcbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3UuY29tcGxldGVkJywge1xuICAgICAgICB1cmw6ICcvY29tcGxldGVkJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21wbGV0ZWQvY29tcGxldGVkLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnQ29tcGxldGVkQ3RybCcsXG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgdXNlcjogbnVsbFxuICAgICAgICB9LFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICBjb21wbGV0ZWRHYW1lczogZnVuY3Rpb24oJHN0YXRlUGFyYW1zLCBHYW1lRmFjdG9yeSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBHYW1lRmFjdG9yeS5nZXRDb21wbGV0ZWRHYW1lcygkc3RhdGVQYXJhbXMudXNlci5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuIiwiYXBwLmNvbnRyb2xsZXIoJ0NyZWF0ZUdhbWVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbWREaWFsb2csICRzdGF0ZSwgVXNlckZhY3RvcnksICRsb2csIEdhbWVGYWN0b3J5KXtcbiAgICAkc2NvcGUuc2VsZWN0ZWRJdGVtO1xuICAgICRzY29wZS5zZWFyY2hUZXh0ID0gXCJcIjtcblxuICAgICRzY29wZS5jb21tID0ge307XG4gICAgJHNjb3BlLmNvbW0uY29tbWlzc2lvbmVyID0gJHNjb3BlLnVzZXIuaWQ7XG4gICAgJHNjb3BlLmNvbW0ucGxheWVycyA9IHtcbiAgICAgICAgdW5jb25maXJtZWQ6IFt7XG4gICAgICAgICAgICBpZDogJHNjb3BlLnVzZXIuaWQsXG4gICAgICAgICAgICBlbWFpbDogJHNjb3BlLnVzZXIuZW1haWx9XSxcbiAgICAgICAgaW52aXRlZDogW11cblxuICAgIH07XG5cbiAgICAkc2NvcGUuZnJpZW5kcyA9IFt7XG4gICAgICAgIGlkOiAnZnJpZW5kMScsXG4gICAgICAgIGVtYWlsOiAkc2NvcGUudXNlci5lbWFpbFxuICAgIH1dO1xuXG4gICAgJHNjb3BlLmNvbW0udGFza3MgPSBbe1xuICAgICAgICBpZDogJ3Rhc2sxJyxcbiAgICAgICAgbmFtZTogJycsXG4gICAgICAgIGRlY3JpcHRpb246ICcnLFxuICAgICAgICBwb2ludHM6ICcnXG4gICAgfV07XG5cbiAgICAkc2NvcGUuYWRkVGFzayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgbmV3VGFza051bSA9ICRzY29wZS5jb21tLnRhc2tzLmxlbmd0aCArIDE7XG4gICAgICAgICRzY29wZS5jb21tLnRhc2tzLnB1c2goe1xuICAgICAgICAgICAgaWQ6J3Rhc2snK25ld1Rhc2tOdW0sXG4gICAgICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgICAgIGRlY3JpcHRpb246ICcnLFxuICAgICAgICAgICAgcG9pbnRzOiAnJ1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnJlbW92ZVRhc2sgPSBmdW5jdGlvbih0YXNrSWQpIHtcbiAgICAgICAgJHNjb3BlLmNvbW0udGFza3MgPSAkc2NvcGUuY29tbS50YXNrcy5maWx0ZXIoZT0+ZS5pZCAhPT0gdGFza0lkKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmFkZEZyaWVuZHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gJHN0YXRlLmdvKCd1LmNyZWF0ZS5mcmllbmRzJywge1xuICAgICAgICAvLyAgICAgZnJpZW5kczogJHNjb3BlLnBsYXllcnNcbiAgICAgICAgLy8gfSk7XG4gICAgICAgICRtZERpYWxvZy5zaG93KHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnanMvYWRkLWZyaWVuZHMvYWRkLWZyaWVuZHMuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQWRkRnJpZW5kc0N0cmwnLFxuICAgICAgICAgICAgc2NvcGU6ICRzY29wZVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgJHNjb3BlLmdldE1hdGNoZXMgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRleHQpO1xuICAgICAgICBVc2VyRmFjdG9yeS5hdXRvY29tcGxldGUodGV4dClcbiAgICAgICAgLnRoZW4odXNlcnM9PntcbiAgICAgICAgICAgICRzY29wZS5mb3VuZE1hdGNoZXMgPSB1c2VycztcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHVzZXJzKTtcbiAgICAgICAgfVxuICAgICAgICAgICAgKVxuICAgICAgICAuY2F0Y2goZXJyPT4kbG9nLmVycm9yKVxuXG4gICAgfVxuICAgICRzY29wZS5hZGRQbGF5ZXI9IGZ1bmN0aW9uKHNlbGVjdGVkSXRlbSl7XG4gICAgICAgIGlmKHNlbGVjdGVkSXRlbSl7XG4gICAgICAgICRzY29wZS5jb21tLnBsYXllcnMuaW52aXRlZC5wdXNoKHNlbGVjdGVkSXRlbSk7XG4gICAgICAgICRzY29wZS5mb3VuZE1hdGNoZXMgPSBbXTtcbiAgICB9XG4gICAgfVxuXG4gICAgJHNjb3BlLmNyZWF0ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIEdhbWVGYWN0b3J5LmNyZWF0ZUdhbWUoJHNjb3BlLmNvbW0pXG4gICAgICAgIC50aGVuKGdhbWVJZD0+JHN0YXRlLmdvKCd1LmdhbWUnLCB7Z2FtZUlkOmdhbWVJZH0pKVxuICAgIH1cblxufSlcbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3UuY3JlYXRlJywge1xuICAgICAgICB1cmw6ICcvY3JlYXRlJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jcmVhdGUtZ2FtZS9jcmVhdGUtZ2FtZS5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0NyZWF0ZUdhbWVDdHJsJyxcbiAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICBmcmllbmRzOiBudWxsXG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuIiwiYXBwLmNvbnRyb2xsZXIoJ0Rhc2hDdHJsJywgZnVuY3Rpb24oJHNjb3BlKXtcblxufSlcbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3UuZGFzaCcsIHtcbiAgICAgICAgdXJsOiAnLycsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvZGFzaC9kYXNoLmh0bWwnXG4gICAgfSk7XG59KTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyBIb3BlIHlvdSBkaWRuJ3QgZm9yZ2V0IEFuZ3VsYXIhIER1aC1kb3kuXG4gICAgaWYgKCF3aW5kb3cuYW5ndWxhcikgdGhyb3cgbmV3IEVycm9yKCdJIGNhblxcJ3QgZmluZCBBbmd1bGFyIScpO1xuXG4gICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdmc2FQcmVCdWlsdCcsIFtdKTtcblxuICAgIGFwcC5mYWN0b3J5KCdTb2NrZXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghd2luZG93LmlvKSB0aHJvdyBuZXcgRXJyb3IoJ3NvY2tldC5pbyBub3QgZm91bmQhJyk7XG4gICAgICAgIHJldHVybiB3aW5kb3cuaW8od2luZG93LmxvY2F0aW9uLm9yaWdpbik7XG4gICAgfSk7XG5cbiAgICAvLyBBVVRIX0VWRU5UUyBpcyB1c2VkIHRocm91Z2hvdXQgb3VyIGFwcCB0b1xuICAgIC8vIGJyb2FkY2FzdCBhbmQgbGlzdGVuIGZyb20gYW5kIHRvIHRoZSAkcm9vdFNjb3BlXG4gICAgLy8gZm9yIGltcG9ydGFudCBldmVudHMgYWJvdXQgYXV0aGVudGljYXRpb24gZmxvdy5cbiAgICBhcHAuY29uc3RhbnQoJ0FVVEhfRVZFTlRTJywge1xuICAgICAgICBsb2dpblN1Y2Nlc3M6ICdhdXRoLWxvZ2luLXN1Y2Nlc3MnLFxuICAgICAgICBsb2dpbkZhaWxlZDogJ2F1dGgtbG9naW4tZmFpbGVkJyxcbiAgICAgICAgbG9nb3V0U3VjY2VzczogJ2F1dGgtbG9nb3V0LXN1Y2Nlc3MnLFxuICAgICAgICBzZXNzaW9uVGltZW91dDogJ2F1dGgtc2Vzc2lvbi10aW1lb3V0JyxcbiAgICAgICAgbm90QXV0aGVudGljYXRlZDogJ2F1dGgtbm90LWF1dGhlbnRpY2F0ZWQnLFxuICAgICAgICBub3RBdXRob3JpemVkOiAnYXV0aC1ub3QtYXV0aG9yaXplZCdcbiAgICB9KTtcblxuICAgIGFwcC5mYWN0b3J5KCdBdXRoSW50ZXJjZXB0b3InLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHEsIEFVVEhfRVZFTlRTKSB7XG4gICAgICAgIHZhciBzdGF0dXNEaWN0ID0ge1xuICAgICAgICAgICAgNDAxOiBBVVRIX0VWRU5UUy5ub3RBdXRoZW50aWNhdGVkLFxuICAgICAgICAgICAgNDAzOiBBVVRIX0VWRU5UUy5ub3RBdXRob3JpemVkLFxuICAgICAgICAgICAgNDE5OiBBVVRIX0VWRU5UUy5zZXNzaW9uVGltZW91dCxcbiAgICAgICAgICAgIDQ0MDogQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXRcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3BvbnNlRXJyb3I6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChzdGF0dXNEaWN0W3Jlc3BvbnNlLnN0YXR1c10sIHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlc3BvbnNlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgYXBwLmNvbmZpZyhmdW5jdGlvbiAoJGh0dHBQcm92aWRlcikge1xuICAgICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKFtcbiAgICAgICAgICAgICckaW5qZWN0b3InLFxuICAgICAgICAgICAgZnVuY3Rpb24gKCRpbmplY3Rvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiAkaW5qZWN0b3IuZ2V0KCdBdXRoSW50ZXJjZXB0b3InKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBhcHAuc2VydmljZSgnQXV0aFNlcnZpY2UnLCBmdW5jdGlvbiAoJGh0dHAsIFNlc3Npb24sICRyb290U2NvcGUsIEFVVEhfRVZFTlRTLCAkcSkge1xuXG4gICAgICAgIGZ1bmN0aW9uIG9uU3VjY2Vzc2Z1bExvZ2luKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICBTZXNzaW9uLmNyZWF0ZShkYXRhLmlkLCBkYXRhLnVzZXIpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KEFVVEhfRVZFTlRTLmxvZ2luU3VjY2Vzcyk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YS51c2VyO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVXNlcyB0aGUgc2Vzc2lvbiBmYWN0b3J5IHRvIHNlZSBpZiBhblxuICAgICAgICAvLyBhdXRoZW50aWNhdGVkIHVzZXIgaXMgY3VycmVudGx5IHJlZ2lzdGVyZWQuXG4gICAgICAgIHRoaXMuaXNBdXRoZW50aWNhdGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICEhU2Vzc2lvbi51c2VyO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZ2V0TG9nZ2VkSW5Vc2VyID0gZnVuY3Rpb24gKGZyb21TZXJ2ZXIpIHtcblxuICAgICAgICAgICAgLy8gSWYgYW4gYXV0aGVudGljYXRlZCBzZXNzaW9uIGV4aXN0cywgd2VcbiAgICAgICAgICAgIC8vIHJldHVybiB0aGUgdXNlciBhdHRhY2hlZCB0byB0aGF0IHNlc3Npb25cbiAgICAgICAgICAgIC8vIHdpdGggYSBwcm9taXNlLiBUaGlzIGVuc3VyZXMgdGhhdCB3ZSBjYW5cbiAgICAgICAgICAgIC8vIGFsd2F5cyBpbnRlcmZhY2Ugd2l0aCB0aGlzIG1ldGhvZCBhc3luY2hyb25vdXNseS5cblxuICAgICAgICAgICAgLy8gT3B0aW9uYWxseSwgaWYgdHJ1ZSBpcyBnaXZlbiBhcyB0aGUgZnJvbVNlcnZlciBwYXJhbWV0ZXIsXG4gICAgICAgICAgICAvLyB0aGVuIHRoaXMgY2FjaGVkIHZhbHVlIHdpbGwgbm90IGJlIHVzZWQuXG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzQXV0aGVudGljYXRlZCgpICYmIGZyb21TZXJ2ZXIgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEud2hlbihTZXNzaW9uLnVzZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBNYWtlIHJlcXVlc3QgR0VUIC9zZXNzaW9uLlxuICAgICAgICAgICAgLy8gSWYgaXQgcmV0dXJucyBhIHVzZXIsIGNhbGwgb25TdWNjZXNzZnVsTG9naW4gd2l0aCB0aGUgcmVzcG9uc2UuXG4gICAgICAgICAgICAvLyBJZiBpdCByZXR1cm5zIGEgNDAxIHJlc3BvbnNlLCB3ZSBjYXRjaCBpdCBhbmQgaW5zdGVhZCByZXNvbHZlIHRvIG51bGwuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvc2Vzc2lvbicpLnRoZW4ob25TdWNjZXNzZnVsTG9naW4pLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5sb2dpbiA9IGZ1bmN0aW9uIChjcmVkZW50aWFscykge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9sb2dpbicsIGNyZWRlbnRpYWxzKVxuICAgICAgICAgICAgICAgIC50aGVuKG9uU3VjY2Vzc2Z1bExvZ2luKVxuICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoeyBtZXNzYWdlOiAnSW52YWxpZCBsb2dpbiBjcmVkZW50aWFscy4nIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubG9nb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2xvZ291dCcpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIFNlc3Npb24uZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChBVVRIX0VWRU5UUy5sb2dvdXRTdWNjZXNzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbiAgICBhcHAuc2VydmljZSgnU2Vzc2lvbicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCBBVVRIX0VWRU5UUykge1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5ub3RBdXRoZW50aWNhdGVkLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLmRlc3Ryb3koKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNlbGYuZGVzdHJveSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmlkID0gbnVsbDtcbiAgICAgICAgdGhpcy51c2VyID0gbnVsbDtcblxuICAgICAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uIChzZXNzaW9uSWQsIHVzZXIpIHtcbiAgICAgICAgICAgIHRoaXMuaWQgPSBzZXNzaW9uSWQ7XG4gICAgICAgICAgICB0aGlzLnVzZXIgPSB1c2VyO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuaWQgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy51c2VyID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5hcHAuZmFjdG9yeSgnR2FtZUZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCkge1xuICB2YXIgR2FtZUZhY3RvcnkgPSB7fTtcblxuICBHYW1lRmFjdG9yeS5nZXRHYW1lID0gZnVuY3Rpb24oaWQpIHtcbiAgICByZXR1cm4gJGh0dHAuZ2V0KCdhcGkvZ2FtZXMvJyArIGlkKVxuICAgIC50aGVuKGdhbWUgPT4gZ2FtZS5kYXRhKTtcbiAgfTtcblxuICBHYW1lRmFjdG9yeS5jcmVhdGVHYW1lID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHJldHVybiAkaHR0cC5wb3N0KCdhcGkvZ2FtZXMvJywgZGF0YSlcbiAgICAudGhlbihuZXdHYW1lID0+IG5ld0dhbWUuZGF0YSk7XG4gIH1cblxuICBHYW1lRmFjdG9yeS5jb21wbGV0ZVRhc2sgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgcmV0dXJuICRodHRwLnBvc3QoJ2FwaS9ldmVudHMnLCBkYXRhKVxuICAgIC50aGVuKG5ld0V2ZW50ID0+IG5ld0V2ZW50LmRhdGEpO1xuICB9XG5cbiAgR2FtZUZhY3RvcnkuZ2V0VXNlcnNHYW1lcyA9IGZ1bmN0aW9uKGlkKXtcbiAgICByZXR1cm4gJGh0dHAuZ2V0KCdhcGkvZ2FtZXMvdXNlci8nK2lkKVxuICAgIC50aGVuKGdhbWVzPT5nYW1lcy5kYXRhKTtcbiAgfVxuXG4gIEdhbWVGYWN0b3J5LmdldENvbXBsZXRlZEdhbWVzID0gZnVuY3Rpb24oaWQpIHtcbiAgICByZXR1cm4gJGh0dHAuZ2V0KCdhcGkvZ2FtZXMvdXNlci8nICsgaWQgKyAnL2NvbXBsZXRlZCcpXG4gICAgLnRoZW4oZ2FtZXMgPT4gZ2FtZXMuZGF0YSk7XG4gIH1cblxuICBHYW1lRmFjdG9yeS5nZXRFdmVudHNieUlkID0gZnVuY3Rpb24odGFza0lkKXtcbiAgICByZXR1cm4gJGh0dHAuZ2V0KCdhcGkvZXZlbnRzL3Rhc2svJyArIHRhc2tJZClcbiAgICAudGhlbihuZXdFdmVudCA9PiBuZXdFdmVudC5kYXRhKTtcbiAgfVxuXG4gIEdhbWVGYWN0b3J5LmNvbmZpcm1HYW1lID0gZnVuY3Rpb24oZGF0YSl7XG4gICAgY29uc29sZS5sb2coXCJJbiBjb25maXJtR2FtZSByb3V0ZVwiKVxuICAgIHJldHVybiAkaHR0cC5wb3N0KCdhcGkvY3JvbicsIGRhdGEpXG4gICAgLnRoZW4ocmVzPT5yZXMpXG4gIH1cblxuICByZXR1cm4gR2FtZUZhY3Rvcnk7XG59KVxuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd1LmdhbWUnLHtcbiAgICB1cmw6ICcvZ2FtZS9vdmVydmlldy86Z2FtZUlkJyxcbiAgICB0ZW1wbGF0ZVVybDogJ2pzL2dhbWUtb3ZlcnZpZXcvdXNlci1nYW1lcy5odG1sJyxcbiAgICBjb250cm9sbGVyOiAnR2FtZU92ZXJ2aWV3Q3RybCcsXG4gICAgcmVzb2x2ZToge1xuICAgICAgZ2FtZU9iajogZnVuY3Rpb24oJHN0YXRlUGFyYW1zLCBHYW1lRmFjdG9yeSl7XG4gICAgICAgIHJldHVybiBHYW1lRmFjdG9yeS5nZXRHYW1lKCRzdGF0ZVBhcmFtcy5nYW1lSWQpO1xuICAgIH1cbiAgfVxuICB9KVxufSlcblxuYXBwLmNvbnRyb2xsZXIoJ0dhbWVPdmVydmlld0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIGdhbWVPYmope1xuXG4gICAgJHNjb3BlLmdhbWUgPSBnYW1lT2JqO1xuXG5cbn0pXG4iLCJhcHAuZGlyZWN0aXZlKCd0Z0xlYWRlcmJvYXJkJywgZnVuY3Rpb24oKXtcbiAgcmV0dXJue1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgdGVtcGxhdGVVcmw6ICdqcy9nYW1lLW92ZXJ2aWV3L2xlYWRlcmJvYXJkLmh0bWwnLFxuICAgIHNjb3BlOiB7XG4gICAgICBldmVudHM6ICc9JyxcbiAgICAgIHBsYXllcnM6ICc9JyxcbiAgICAgIHRhc2tzOiAnPSdcbiAgICB9LFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlKXtcbiAgICAgIHNjb3BlLnBsYXllcnMgPSBzY29wZS5wbGF5ZXJzLm1hcChwbGF5ZXIgPT4ge1xuICAgICAgICBwbGF5ZXIucG9pbnRzID0gc2NvcGUuZXZlbnRzLmZpbHRlcihldmVudCA9PiBldmVudC5jb21wbGV0ZWRCeUlkID09PSBwbGF5ZXIuaWQpXG4gICAgICAgIC5tYXAoZXZlbnQgPT4gc2NvcGUudGFza3MuZmluZCh0YXNrID0+IHRhc2suaWQgPT09IGV2ZW50LnRhc2tJZCkucG9pbnRzKVxuICAgICAgICAucmVkdWNlKChwcmV2LCBjdXJyKSA9PiBwcmV2ICsgY3VyciwgMCk7XG4gICAgICAgIHJldHVybiBwbGF5ZXI7XG4gICAgICB9KS5zb3J0KChhLGIpID0+IGIucG9pbnRzIC0gYS5wb2ludHMpO1xuICAgIH1cbn19KTtcbiIsImFwcC5kaXJlY3RpdmUoJ3RnTmV3c2ZlZWQnLCBmdW5jdGlvbigpe1xuICByZXR1cm57XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICB0ZW1wbGF0ZVVybDogJ2pzL2dhbWUtb3ZlcnZpZXcvbmV3c2ZlZWQuaHRtbCcsXG4gICAgc2NvcGU6IHtcbiAgICAgIGV2ZW50czogJz0nLFxuICAgICAgdXNlcnM6ICc9JyxcbiAgICAgIHRhc2tzOiAnPSdcbiAgICB9LFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlKXtcblxuICAgICAgc2NvcGUuZXZlbnRzLmZvckVhY2goZT0+IGUudXNlck5hbWUgPSBzY29wZS51c2Vycy5maW5kKGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgICByZXR1cm4gdXNlci5pZCA9PSBlLmNvbXBsZXRlZEJ5SWQ7XG4gICAgICB9KS5maXJzdE5hbWUpO1xuXG4gICAgICBzY29wZS5ldmVudHMuZm9yRWFjaChlPT57XG4gICAgICAgIHZhciBmb3VuZFRhc2sgPSBzY29wZS50YXNrcy5maW5kKGZ1bmN0aW9uKHRhc2spe3JldHVybiB0YXNrLmlkID09IGUudGFza0lkfSlcbiAgICAgICAgZS50YXNrID0gZm91bmRUYXNrLm5hbWU7XG4gICAgICAgIGUucG9pbnRzID0gZm91bmRUYXNrLnBvaW50cztcbiAgICAgIH0pO1xuXG4gICAgfVxuICB9XG59KTtcbiIsImFwcC5jb250cm9sbGVyKCdIb21lQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJG1kRGlhbG9nKXtcbiAgICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJG1kRGlhbG9nLnNob3coe1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9sb2dpbi9sb2dpbi5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgICRzY29wZS5zaWdudXAgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJG1kRGlhbG9nLnNob3coe1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9zaWdudXAvc2lnbnVwLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1NpZ251cEN0cmwnXG4gICAgICAgIH0pO1xuICAgIH1cblxufSlcbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2hvbWUnLCB7XG4gICAgICAgIHVybDogJy8nLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2hvbWUvaG9tZS5odG1sJ1xuICAgIH0pO1xufSk7XG5cbiIsImFwcC5jb250cm9sbGVyKCdJbnZpdGVGcmllbmRzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCAkbWREaWFsb2csICRodHRwKXtcblxuICAgICRzY29wZS5mcmllbmRzID0gW107XG5cbiAgICBjb25zb2xlLmxvZygnaW52aXRlZnJpZW5kcycsJHNjb3BlLmZyaWVuZHMpO1xuXG4gICAgJHNjb3BlLmFkZEZyaWVuZCA9IGZ1bmN0aW9uKGVtYWlsKSB7XG4gICAgICAgIGxldCBlbWFpbFJlZ2V4ID0gL15bLWEtejAtOX4hJCVeJipfPSt9e1xcJz9dKyhcXC5bLWEtejAtOX4hJCVeJipfPSt9e1xcJz9dKykqQChbYS16MC05X11bLWEtejAtOV9dKihcXC5bLWEtejAtOV9dKykqXFwuKGFlcm98YXJwYXxiaXp8Y29tfGNvb3B8ZWR1fGdvdnxpbmZvfGludHxtaWx8bXVzZXVtfG5hbWV8bmV0fG9yZ3xwcm98dHJhdmVsfG1vYml8W2Etel1bYS16XSl8KFswLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM30pKSg6WzAtOV17MSw1fSk/JC9pXG4gICAgICAgIGlmKCFlbWFpbC5tYXRjaChlbWFpbFJlZ2V4KSkgcmV0dXJuO1xuICAgICAgICBsZXQgbmV3RnJpZW5kTnVtID0gJHNjb3BlLmZyaWVuZHMubGVuZ3RoICsgMTtcbiAgICAgICAgJHNjb3BlLmZyaWVuZHMucHVzaCh7XG4gICAgICAgICAgICBpZDonZnJpZW5kJyArIG5ld0ZyaWVuZE51bSxcbiAgICAgICAgICAgIGVtYWlsOiBlbWFpbFxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnJlbW92ZUZyaWVuZCA9IGZ1bmN0aW9uKGZyaWVuZElkKSB7XG4gICAgICAgICRzY29wZS5mcmllbmRzID0gJHNjb3BlLmZyaWVuZHMuZmlsdGVyKGU9PmUuaWQgIT09IGZyaWVuZElkKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmhhbmRsZVN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IGVtYWlscyA9IFtdO1xuICAgICAgICAkc2NvcGUuZnJpZW5kcy5mb3JFYWNoKGZyaWVuZCA9PiBlbWFpbHMucHVzaChmcmllbmQuZW1haWwpKTtcbiAgICAgICAgJGh0dHAucG9zdCgnL2FwaS9pbnZpdGUnLCB7XG4gICAgICAgICAgICBlbWFpbHM6IGVtYWlscyxcbiAgICAgICAgICAgIHVzZXI6IHtcbiAgICAgICAgICAgICAgICBmaXJzdE5hbWU6ICRzY29wZS51c2VyLmZpcnN0TmFtZSxcbiAgICAgICAgICAgICAgICBsYXN0TmFtZTogJHNjb3BlLnVzZXIubGFzdE5hbWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICRtZERpYWxvZy5zaG93KHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2ludml0ZS1mcmllbmRzL3N1Y2Nlc3MuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0ludml0ZVN1Y2Nlc3NDdHJsJyxcbiAgICAgICAgICAgICAgICBsb2NhbHMgOiB7ZGF0YVRvUGFzcyA6ICRzY29wZS5mcmllbmRzfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gJG1kRGlhbG9nLmhpZGUoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAkc2NvcGUuaGFuZGxlQ2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJG1kRGlhbG9nLmhpZGUoKTtcbiAgICB9O1xuXG59KVxuIiwiYXBwLmNvbnRyb2xsZXIoJ0ludml0ZVN1Y2Nlc3NDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbWREaWFsb2csIGRhdGFUb1Bhc3Mpe1xuXG4gICAgJHNjb3BlLmZyaWVuZHMgPSBkYXRhVG9QYXNzO1xuXG4gICAgJHNjb3BlLmNsb3NlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJG1kRGlhbG9nLmhpZGUoKTtcbiAgICB9O1xuXG59KVxuIiwiYXBwLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJG1kRGlhbG9nLCAkc3RhdGUsIEF1dGhTZXJ2aWNlKXtcbiAgICAkc2NvcGUuZW1haWwgPSBudWxsO1xuICAgICRzY29wZS5wYXNzd29yZCA9IG51bGw7XG5cbiAgICAkc2NvcGUuaGFuZGxlU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xuXG4gICAgICAgIGxldCBsb2dpbkluZm8gPSB7XG4gICAgICAgICAgICBlbWFpbDogJHNjb3BlLmVtYWlsLFxuICAgICAgICAgICAgcGFzc3dvcmQ6ICRzY29wZS5wYXNzd29yZFxuICAgICAgICB9XG5cbiAgICAgICAgQXV0aFNlcnZpY2UubG9naW4obG9naW5JbmZvKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICAgICAgJHN0YXRlLmdvKCd1LmRhc2gnLCB7dXNlcklkOiB1c2VyLmlkfSk7XG4gICAgICAgICAgICByZXR1cm4gJG1kRGlhbG9nLmhpZGUoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSAnSW52YWxpZCBsb2dpbiBjcmVkZW50aWFscy4nO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAkc2NvcGUuaGFuZGxlQ2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJG1kRGlhbG9nLmhpZGUoKTtcbiAgICB9O1xufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2xvZ2luJywge1xuICAgICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2xvZ2luL2xvZ2luLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnTG9naW5DdHJsJ1xuICAgIH0pO1xuXG59KTtcblxuIiwiYXBwLmRpcmVjdGl2ZSgnbmF2YmFyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsIEF1dGhTZXJ2aWNlLCBBVVRIX0VWRU5UUywgJHN0YXRlKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZToge30sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvbmF2YmFyL25hdmJhci5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlKSB7XG5cbiAgICAgICAgICAgIHNjb3BlLml0ZW1zID0gW1xuICAgICAgICAgICAgICAgIHsgbGFiZWw6ICdIb21lJywgc3RhdGU6ICdob21lJyB9LFxuICAgICAgICAgICAgICAgIHsgbGFiZWw6ICdBYm91dCcsIHN0YXRlOiAnYWJvdXQnIH0sXG4gICAgICAgICAgICAgICAgeyBsYWJlbDogJ0RvY3VtZW50YXRpb24nLCBzdGF0ZTogJ2RvY3MnIH0sXG4gICAgICAgICAgICAgICAgeyBsYWJlbDogJ01lbWJlcnMgT25seScsIHN0YXRlOiAnbWVtYmVyc09ubHknLCBhdXRoOiB0cnVlIH1cbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIHNjb3BlLnVzZXIgPSBudWxsO1xuXG4gICAgICAgICAgICBzY29wZS5pc0xvZ2dlZEluID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBBdXRoU2VydmljZS5sb2dvdXQoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBzZXRVc2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIEF1dGhTZXJ2aWNlLmdldExvZ2dlZEluVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUudXNlciA9IHVzZXI7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgcmVtb3ZlVXNlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzY29wZS51c2VyID0gbnVsbDtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHNldFVzZXIoKTtcblxuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMubG9naW5TdWNjZXNzLCBzZXRVc2VyKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJG9uKEFVVEhfRVZFTlRTLmxvZ291dFN1Y2Nlc3MsIHJlbW92ZVVzZXIpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXQsIHJlbW92ZVVzZXIpO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pO1xuIiwiYXBwLmNvbnRyb2xsZXIoJ1NpZ251cEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRtZERpYWxvZywgJHN0YXRlLCBVc2VyRmFjdG9yeSl7XG4gICAgJHNjb3BlLmVtYWlsID0gbnVsbDtcbiAgICAkc2NvcGUucGFzc3dvcmQgPSBudWxsO1xuXG4gICAgJHNjb3BlLmhhbmRsZVN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgICAgICBsZXQgc2lnbnVwSW5mbyA9IHtcbiAgICAgICAgICAgIGVtYWlsOiAkc2NvcGUuZW1haWwsXG4gICAgICAgICAgICBwYXNzd29yZDogJHNjb3BlLnBhc3N3b3JkXG4gICAgICAgIH07XG5cbiAgICAgICAgVXNlckZhY3RvcnkuY3JlYXRlTmV3VXNlcihzaWdudXBJbmZvKVxuICAgICAgICAudGhlbihmdW5jdGlvbih1c2VyKXtcbiAgICAgICAgICAgICRzdGF0ZS5nbygndS5hY2NvdW50Jywge3VzZXI6IHVzZXJ9KTtcbiAgICAgICAgICAgIHJldHVybiAkbWREaWFsb2cuaGlkZSgpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IGVyci5tZXNzYWdlO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmhhbmRsZUNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICRtZERpYWxvZy5oaWRlKCk7XG4gICAgfTtcbn0pO1xuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzaWdudXAnLCB7XG4gICAgICAgIHVybDogJy9zaWdudXAnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3NpZ251cC9zaWdudXAuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTaWdudXBDdHJsJ1xuICAgIH0pO1xuXG59KTtcbiIsImFwcC5mYWN0b3J5KCdUYXNrRGVldHNGYWN0b3J5JywgZnVuY3Rpb24oJHNjb3BlLCAkbWRTaWRlbmF2LCAkbWRNZWRpYSwgJHN0YXRlLCAkaHR0cCkge1xuXG5cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3UudGFzaycsIHtcbiAgICAgICAgdXJsOiAnL3Rhc2tEZXRhaWwvOnRhc2tJZCcsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdGFzay1kZXRhaWwvdGFzay1kZXRhaWwuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdUYXNrRGVldHNDdHJsJyxcbiAgICAgICAgcGFyYW1zOiB7dGFzazogbnVsbH0sXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgIGV2ZW50czogZnVuY3Rpb24oJHN0YXRlUGFyYW1zLCBHYW1lRmFjdG9yeSwgVXNlckZhY3Rvcnkpe1xuICAgICAgICBcdHJldHVybiBHYW1lRmFjdG9yeS5nZXRFdmVudHNieUlkKCRzdGF0ZVBhcmFtcy50YXNrLmlkKVxuICAgICAgICBcdC50aGVuKGZ1bmN0aW9uKGV2ZW50cykge1xuICAgICAgICBcdFx0cmV0dXJuIFByb21pc2UuYWxsKGV2ZW50cy5tYXAoZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICBcdFx0XHRyZXR1cm4gVXNlckZhY3RvcnkuZ2V0VXNlckluZm8oZXZlbnQuY29tcGxldGVkQnlJZClcbiAgICAgICAgXHRcdFx0XHQudGhlbihmdW5jdGlvbih1c2VyKXtcbiAgICAgICAgICAgIFx0XHRcdFx0ZXZlbnQubmFtZSA9IHVzZXIuZmlyc3ROYW1lICsgXCIgXCIgKyB1c2VyLmxhc3ROYW1lO1xuICAgICAgICAgICAgXHRcdFx0XHRcdHJldHVybiBldmVudFxuICAgICAgICAgICAgXHRcdFx0fSlcbiAgICAgICAgICAgIFx0fSkpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgXHR9XG4gICAgXHQgIC8vIGV2ZW50czogWyckaHR0cCcsJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uKEdhbWVGYWN0b3J5LCAkc3RhdGVQYXJhbXMpe1xuICAgICAgIC8vICAgICAgIFx0XHRcdHJldHVybiBHYW1lRmFjdG9yeS5nZXRFdmVudHNCeUlkKCRzdGF0ZVBhcmFtcy50YXNrLmlkKS50aGVuKGV2ZW50cz0+ZXZlbnRzKTtcbiAgICAgICAvLyAgIFx0XHR9XVxuICAgIFx0fVxuICAgIH0pXG59KTtcbiIsImFwcC5jb250cm9sbGVyKCdUYXNrRGVldHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkbWRTaWRlbmF2LCAkbWRNZWRpYSwgJG1kRGlhbG9nLCAkc3RhdGVQYXJhbXMsIEdhbWVGYWN0b3J5LCBVc2VyRmFjdG9yeSwgZXZlbnRzKSB7XG5cbiAgICAkc2NvcGUuY29udmVydERhdGUgPSBmdW5jdGlvbihTZXF1ZWxpemVEYXRlKXtcbiAgICAgICAgdmFyIFllYXJNb250aERheSA9IFNlcXVlbGl6ZURhdGUubWF0Y2goL1teVF0qLyk7XG4gICAgICAgIFllYXJNb250aERheSA9IFllYXJNb250aERheVswXS5zcGxpdCgnLScpO1xuICAgICAgICB2YXIgWWVhciA9IFllYXJNb250aERheVswXTtcbiAgICAgICAgdmFyIE1vbnRoID0gWWVhck1vbnRoRGF5WzFdO1xuICAgICAgICB2YXIgRGF5ID0gWWVhck1vbnRoRGF5WzJdO1xuICAgICAgICB2YXIgdGltZSA9IFNlcXVlbGl6ZURhdGUuc2xpY2UoU2VxdWVsaXplRGF0ZS5pbmRleE9mKFwiVFwiKSsxLC04KTtcbiAgICAgICAgY29uc29sZS5sb2codGltZSk7XG4gICAgICAgIC8vIHJldHVybiBZZWFyTW9udGhEYXkgKyBcIiBcIiArIHRpbWU7XG4gICAgICAgIHJldHVybiBNb250aCArIFwiL1wiICsgRGF5ICsgXCIvXCIgKyBZZWFyICsgXCIgXCIgKyB0aW1lO1xuICAgIH07XG5cbiAgICAkc2NvcGUudGFzayA9ICRzdGF0ZVBhcmFtcy50YXNrO1xuXG4gICAgJHNjb3BlLmV2ZW50cyA9IGV2ZW50cy5tYXAoZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICBldmVudC5jcmVhdGVkQXQgPSAkc2NvcGUuY29udmVydERhdGUoZXZlbnQuY3JlYXRlZEF0KSBcbiAgICAgICAgcmV0dXJuIGV2ZW50O1xuICAgIH0pXG4gICAgLy8gLm1hcChmdW5jdGlvbihldmVudCl7XG4gICAgLy8gICAgIHJldHVybiBVc2VyRmFjdG9yeS5nZXRVc2VySW5mbyhldmVudC5jb21wbGV0ZWRCeUlkKVxuICAgIC8vICAgICAudGhlbihmdW5jdGlvbih1c2VyKXtcbiAgICAvLyAgICAgICAgIGV2ZW50Lm5hbWUgPSB1c2VyLmZpcnN0TmFtZSArIFwiIFwiICsgdXNlci5sYXN0TmFtZTtcbiAgICAvLyAgICAgICAgIHJldHVybiBldmVudH0pO1xuICAgIC8vIH0pXG4gICAgLy8gKS50aGVuKGZ1bmN0aW9uKGV2ZW50QXJyYXkpe1xuICAgIC8vICAgICAkc2NvcGUuZXZlbnROYW1lcyA9IGV2ZW50QXJyYXk7XG4gICAgLy8gICAgICRzY29wZS5ldmVudE5hbWVzLm1hcChmdW5jdGlvbihldmVudCl7XG4gICAgLy8gICAgIGV2ZW50LmNyZWF0ZWRBdCA9ICRzY29wZS5jb252ZXJ0RGF0ZShldmVudC5jcmVhdGVkQXQpIFxuICAgIC8vICAgICByZXR1cm4gZXZlbnQ7XG4gICAgLy8gfSlcbiAgICAvLyAgICAgcmV0dXJuIGV2ZW50QXJyYXlcbiAgICAvLyB9KTtcblxuICAgIC8vICRzY29wZS51cGRhdGVkRXZlbnREYXRlcyA9ICRzY29wZS5ldmVudHMubWFwKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAvLyAgICAgZXZlbnQuY3JlYXRlZEF0ID0gJHNjb3BlLmNvbnZlcnREYXRlKGV2ZW50LmNyZWF0ZWRBdCkgXG4gICAgLy8gICAgIHJldHVybiBldmVudDtcbiAgICAvLyB9KTtcblxuICAgIC8vICRzY29wZS5ldmVudERhdGVzID0gJHNjb3BlLmV2ZW50cy5tYXAoZnVuY3Rpb24oZXZlbnQpe1xuICAgIC8vICAgICBldmVudC5kYXRlID0gJHNjb3BlLmNvbnZlcnREYXRlKGV2ZW50LmRhdGUpO1xuICAgIC8vICAgICByZXR1cm4gZXZlbnQuZGF0ZTtcbiAgICAvLyB9KVxuXG4gICAgLy8gJHNjb3BlLmNvbXBsZXRlVGFzayA9IEdhbWVGYWN0b3J5LmNvbXBsZXRlVGFzayhpbmZvKTtcblxuICAgIC8vICRzY29wZS5ldmVudHMxID0gZXZlbnRzXG5cbiAgICAkc2NvcGUudGVzdEV2ZW50T2JqID0gZnVuY3Rpb24oKXtcbiAgICAgICAgY29uc29sZS5sb2coXCIqKioqKiBldmVudHMgXCIsICRzY29wZS5ldmVudHMpXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZXZlbnRzMSBcIiwgZXZlbnRzMSlcbiAgICB9XG5cbiAgICAkc2NvcGUudGVzdEV2ZW50T2JqKCk7XG5cbiAgICAkc2NvcGUuc3RhdHVzID0gbnVsbDtcblxuICAgICRzY29wZS5zaG93Q29uZmlybSA9IGZ1bmN0aW9uKGV2KSB7XG4gICAgLy8gQXBwZW5kaW5nIGRpYWxvZyB0byBkb2N1bWVudC5ib2R5IHRvIGNvdmVyIHNpZGVuYXYgaW4gZG9jcyBhcHBcbiAgICB2YXIgY29uZmlybSA9ICRtZERpYWxvZy5jb25maXJtKClcbiAgICAgICAgICAudGl0bGUoJ0FyZSB5b3Ugc3VyZSB5b3UgY29tcGxldGVkIHRoaXMgdGFzaz8nKVxuICAgICAgICAgIC50ZXh0Q29udGVudCgnVGFza3Mgd2lsbCBiZSB2ZXJpZmllZCBieSB0aGUgb3RoZXIgcGxheWVycyBpbiB0aGUgZ2FtZScpXG4gICAgICAgICAgLmFyaWFMYWJlbCgnWWVzLCBJIGRpZCcpXG4gICAgICAgICAgLnRhcmdldEV2ZW50KGV2KVxuICAgICAgICAgIC5vaygnWWVzLCBJIGRpZCcpXG4gICAgICAgICAgLmNhbmNlbCgnTm8sIEkgaGF2ZSBub3QnKTtcbiAgICAkbWREaWFsb2cuc2hvdyhjb25maXJtKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgJHNjb3BlLnN0YXR1cyA9ICdDb21wbGV0ZWQnO1xuICAgICAgY29uc29sZS5sb2coJHNjb3BlLnN0YXR1cyk7XG4gICAgICBHYW1lRmFjdG9yeS5jb21wbGV0ZVRhc2soe2NvbXBsZXRlZEJ5SWQ6ICRzY29wZS51c2VyLmlkLCB0YXNrSWQ6ICRzY29wZS50YXNrLmlkLCBnYW1lSWQ6ICRzY29wZS50YXNrLmdhbWVJZH0pXG4gICAgICAudGhlbih0YXNrPT50YXNrKTtcbiAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICRzY29wZS5zdGF0dXMgPSAnTm90IENvbXBsZXRlZCc7XG4gICAgICBjb25zb2xlLmxvZygkc2NvcGUuc3RhdHVzKTtcbiAgICB9KTtcbiAgfTtcbn0pXG4iLCJhcHAuY29udHJvbGxlcignVXNlckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBBdXRoU2VydmljZSwgdXNlcnNHYW1lcywgJG1kRGlhbG9nLCB1c2VyKSB7XG4gICAgJHNjb3BlLnVzZXIgPSB1c2VyO1xuXG4gICAgJHNjb3BlLmlzTG9nZ2VkSW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpO1xuICAgICAgICAgICAgfTtcblxuICAgICRzY29wZS5tZW51SXRlbXMgPSB1c2Vyc0dhbWVzLmZpbHRlcihnYW1lID0+IGdhbWUuc3RhdHVzICE9PSAnQ29tcGxldGVkJyk7XG5cbiAgICAvLyBhd2FpdGluZyB1c2FnZVxuICAgIC8vICRzY29wZS5jb21wbGV0ZWRHYW1lcyA9IHVzZXJzR2FtZXMuZmlsdGVyKGdhbWUgPT4gZ2FtZS5zdGF0dXMgPT09ICdDb21wbGV0ZWQnKTtcblxuICAgICRzY29wZS5nb1RvRWRpdCA9IGZ1bmN0aW9uKGNvbW1pc3Npb25lcklELCBsb2NrZWQpIHtcbiAgICAgICAgcmV0dXJuIChjb21taXNzaW9uZXJJRCA9PT0gJHNjb3BlLnVzZXIuaWQpICYmICFsb2NrZWQ7XG4gICAgfVxuXG4gICAgJHNjb3BlLmludml0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkbWREaWFsb2cuc2hvdyh7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2ludml0ZS1mcmllbmRzL2ludml0ZS1mcmllbmRzLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0ludml0ZUZyaWVuZHNDdHJsJyxcbiAgICAgICAgICAgIHNjb3BlOiAkc2NvcGVcbiAgICAgICAgfSk7XG4gICAgfVxuICAgICRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJJbiB0aGUgbG9nb3V0IGZ1bmN0aW9uIG9uIHNjb3BlLlwiKVxuICAgICAgICBBdXRoU2VydmljZS5sb2dvdXQoKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAkc2NvcGUuZGFzaEJvYXJkID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHN0YXRlLmdvKCd1LmRhc2gnKVxuICAgIH1cbn0pXG4iLCJhcHAuZmFjdG9yeSgnVXNlckZhY3RvcnknLCBmdW5jdGlvbigkc3RhdGUsICRodHRwKXtcblxuICAgIGxldCBVc2VyRmFjdG9yeSA9IHt9O1xuXG4gICAgVXNlckZhY3RvcnkuZ2V0VXNlckluZm8gPSBmdW5jdGlvbihpZCl7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdXNlci8nICsgaWQpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgICAgICAgcmV0dXJuIHVzZXIuZGF0YVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIFVzZXJGYWN0b3J5LmNyZWF0ZU5ld1VzZXIgPSBmdW5jdGlvbihzaWdudXBJbmZvKXtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9zaWdudXAnLCBzaWdudXBJbmZvKVxuICAgICAgICAudGhlbihmdW5jdGlvbihuZXdVc2VyKXtcbiAgICAgICAgICAgIHJldHVybiBuZXdVc2VyLmRhdGEudXNlcjtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBVc2VyRmFjdG9yeS51cGRhdGVVc2VyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KCcvYXBpL3VzZXIvJytpZClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24odXBkYXRlZFVzZXIpe1xuICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZWRVc2VyLmRhdGFcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBVc2VyRmFjdG9yeS5hdXRvY29tcGxldGUgPSBmdW5jdGlvbihzdHIpe1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3VzZXIvaW52aXRlLycrc3RyKVxuICAgICAgICAudGhlbih1c2Vycz0+dXNlcnMuZGF0YSk7XG4gICAgfVxuXG4gICAgICAgIHJldHVybiBVc2VyRmFjdG9yeTtcbn0pXG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd1Jywge1xuICAgICAgICB1cmw6ICcvdS86dXNlcklkJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy91c2VyL3VzZXIuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdVc2VyQ3RybCcsXG4gICAgICAgIGRhdGE6IHthdXRoZW50aWNhdGU6IHRydWV9LFxuICAgICAgICByZXNvbHZlOntcbiAgICAgICAgICAgIHVzZXJzR2FtZXM6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcywgR2FtZUZhY3RvcnksIEF1dGhTZXJ2aWNlKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNoZWNraW5nIEF1dGhTZXJ2aWNlR0xJVVwiLCBBdXRoU2VydmljZS5nZXRMb2dnZWRJblVzZXIoKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEF1dGhTZXJ2aWNlLmdldExvZ2dlZEluVXNlcigpLnRoZW4odXNlcj0+e1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlN0YXRlIFVTZXIgUHJvbWlzZTogXCIsdXNlcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBHYW1lRmFjdG9yeS5nZXRVc2Vyc0dhbWVzKHVzZXIuaWQpfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdXNlciA6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcywgQXV0aFNlcnZpY2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiBBdXRoU2VydmljZS5nZXRMb2dnZWRJblVzZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd1c2VyR2FtZURldGFpbCcsIHtcbiAgICB1cmw6ICcvZ2FtZS91c2VyJyxcbiAgICB0ZW1wbGF0ZVVybDogJ2pzL3VzZXItZ2FtZS1kZXRhaWwvdXNlci1nYW1lLWRldGFpbC5odG1sJyxcbiAgICBjb250cm9sbGVyOiAnVXNlckdhbWVDdHJsJ1xuICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignVXNlckdhbWVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbWRTaWRlbmF2LCAkbWRNZWRpYSkge1xuICAkc2NvcGUub3BlbkxlZnRNZW51ID0gZnVuY3Rpb24oKSB7XG4gICAgICAkbWRTaWRlbmF2KCdsZWZ0JykudG9nZ2xlKClcbiAgfVxuICAkc2NvcGUubWVudUl0ZW1zID0gW3tcbiAgICAgIG5hbWU6IFwiS2VlcCBBcGFydG1lbnQgUEhBIENsZWFuXCJcbiAgfSwge1xuICAgICAgbmFtZTogXCJHYW1lMlwiXG4gIH0sIHtcbiAgICAgIG5hbWU6IFwiR2FtZTNcIlxuICB9LCB7XG4gICAgICBuYW1lOiBcIkdhbWU0XCJcbiAgfSx7XG4gICAgICBuYW1lOiBcIkdhbWU1XCJcbiAgfV07XG4gICRzY29wZS50YXNrcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IDU7IGkrKykge1xuICAgICRzY29wZS50YXNrcy5wdXNoKHtuYW1lOiAnVGFzaycsIHBvaW50czogKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSArIDEpLCB0aW1lOiAobmV3IERhdGUobmV3IERhdGUoKSAtIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxZTkpICsgMSkpLnRvU3RyaW5nKCkuc3BsaXQoXCIgXCIpLnNsaWNlKDAsNSkuam9pbihcIiBcIikpfSk7XG4gIH1cbiAgJHNjb3BlLnRvdGFsUG9pbnRzID0gJHNjb3BlLnRhc2tzLnJlZHVjZSgocHJldiwgY3VycikgPT4gcHJldiArIGN1cnIucG9pbnRzLCAwKTtcbiAgY29uc29sZS5sb2coJHNjb3BlLnRhc2tzKTtcbiAgJHNjb3BlLmVsaXBzZXMgPSAoJHNjb3BlLm1lbnVJdGVtcy5sZW5ndGg+NCk7XG4gIGNvbnNvbGUubG9nKCRzY29wZS5lbGlwc2VzKTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
