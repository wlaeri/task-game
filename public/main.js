'use strict';

window.app = angular.module('Gamr', ['fsaPreBuilt', 'ui.router', 'ui.bootstrap', 'ngAnimate', 'ngMaterial', 'ngAria', 'ngMaterialDatePicker', 'nvd3']);

app.config(function ($urlRouterProvider, $locationProvider, $stateProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.

    $urlRouterProvider.otherwise('/home');
    // Trigger page refresh when accessing an OAuth route
    $urlRouterProvider.when('/auth/:provider', function () {
        window.location.reload();
    });
});

app.config(function ($mdThemingProvider) {
    var customPrimary = {
        '50': '#baedf3',
        '100': '#a4e7f0',
        '200': '#8ee1ec',
        '300': '#79dce8',
        '400': '#63d6e5',
        '500': '#4DD0E1',
        '600': '#00B5CD',
        '700': '#24c2d7',
        '800': '#21afc1',
        '900': '#1d9bab',
        'A100': '#d0f3f7',
        'A200': '#e6f8fb',
        'A400': '#fcfefe',
        'A700': '#198795'
    };
    $mdThemingProvider.definePalette('GamrPrimary', customPrimary);

    var customAccent = {
        '50': '#ffdf61',
        '100': '#ffe47a',
        '200': '#ffea94',
        '300': '#ffefad',
        '400': '#fff4c7',
        '500': '#fff9e0',
        '600': '#ffffff',
        '700': '#ffffff',
        '800': '#ffffff',
        '900': '#ffffff',
        'A100': '#ffffff',
        'A200': '#FFFEFA',
        'A400': '#fff9e0',
        'A700': '#ffffff'
    };
    $mdThemingProvider.definePalette('GamrAccent', customAccent);

    var customWarn = {
        '50': '#ffb280',
        '100': '#ffa266',
        '200': '#ff934d',
        '300': '#ff8333',
        '400': '#ff741a',
        '500': '#ff6400',
        '600': '#e65a00',
        '700': '#cc5000',
        '800': '#b34600',
        '900': '#993c00',
        'A100': '#ffc199',
        'A200': '#ffd1b3',
        'A400': '#ffe0cc',
        'A700': '#803200'
    };
    $mdThemingProvider.definePalette('GamrWarn', customWarn);

    var customBackground = {
        '50': '#ffffff',
        '100': '#ffffff',
        '200': '#ffffff',
        '300': '#ffffff',
        '400': '#ffffff',
        '500': '#FFFEFA',
        '600': '#fff9e0',
        '700': '#fff4c7',
        '800': '#ffefad',
        '900': '#ffea94',
        'A100': '#ffffff',
        'A200': '#ffffff',
        'A400': '#ffffff',
        'A700': '#ffe47a'
    };
    $mdThemingProvider.definePalette('GamrBackground', customBackground);

    $mdThemingProvider.theme('default').primaryPalette('GamrPrimary', {
        'default': '500',
        'hue-2': '600'
    }).accentPalette('GamrAccent').warnPalette('GamrWarn').backgroundPalette('GamrBackground');
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
        if (toState.name === "home") {
            AuthService.getLoggedInUser().then(function (user) {
                console.log("User from AS: ", user);
                if (user) $state.go('u.dash', { userId: user.id });else return;
            });
        }
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
        url: '/accountSettings/:id',
        templateUrl: 'js/account-settings/account-settings.html',
        controller: 'AccountSettingsCtrl',
        resolve: { allUsernames: function allUsernames(UserFactory) {
                return UserFactory.getAllUsernames().then(function (usernames) {
                    return usernames;
                });
            }
        }
    });
});

app.controller('AccountSettingsCtrl', function ($scope, $mdDialog, UserFactory, allUsernames) {

    $scope.allUsernames = allUsernames;

    $scope.validateEmail = function (email) {
        var re = /\S+@\S+\.\S+/;
        console.log(re.test(email));
        return re.test(email);
    };

    $scope.showConfirmEmail = function (ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm().title('').textContent('Your email has been successfully updated').ariaLabel('Lucky day').ok('OK');
        $mdDialog.show(confirm);
    };

    $scope.showConfirmUsername = function (ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm().title('').textContent('Your username has been successfully updated').ariaLabel('Lucky day').ok('OK');
        $mdDialog.show(confirm);
    };

    $scope.showConfirmPassword = function (ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm().title('').textContent('Your password has been successfully updated').ariaLabel('Lucky day').ok('OK');
        $mdDialog.show(confirm);
    };

    $scope.showRejectEmail = function (ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm().title('').textContent('Invalid Email. Please try again').ariaLabel('Nah').ok('OK');
        $mdDialog.show(confirm);
    };

    $scope.showRejectPassword = function (ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm().title('').textContent('Your passwords do not match. Please retype your new password').ariaLabel('Nah').ok('OK');
        $mdDialog.show(confirm);
    };

    $scope.showRejectPassword = function (ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm().title('').textContent('Your username is taken or does not meet our requirements. Please try again').ariaLabel('Nah').ok('OK');
        $mdDialog.show(confirm);
    };

    $scope.updatePassword = function () {
        if (!$scope.passwordsMatch) {
            $scope.showRejectPassword();
        } else {
            UserFactory.updateUser($scope.user.id, { password: $scope.password.password1 }).then(function (newUser) {
                $scope.showConfirmPassword();
            });
        }
    };

    $scope.updateUsername = function () {
        if (!$scope.usernamePasses) {
            $scope.showRejectPassword();
        } else {
            UserFactory.updateUser($scope.user.id, { username: $scope.username.username }).then(function (newUser) {
                $scope.showConfirmUsername();
            });
        }
    };

    $scope.updateEmail = function () {
        var test = $scope.validateEmail($scope.newEmail);
        console.log(test);
        if (!test) {
            $scope.showRejectEmail();
        } else {
            UserFactory.updateUser($scope.user.id, { email: $scope.newEmail }).then(function (user) {
                $scope.showConfirmEmail();
            });
        }
    };

    $scope.newEmail = '';

    $scope.displayEmailChange = false;
    $scope.displayPasswordChange = false;
    $scope.displayUsernameChange = false;

    $scope.password = { password1: '', password2: '' };

    $scope.passwordsMatch = false;
    $scope.usernameAvailable = false;
    $scope.usernameLength = false;
    $scope.username = {};

    $scope.matching = function () {
        //   var password1 = document.getElementById("passwordField1").value;
        //   var password2 = document.getElementById("passwordField2").value
        //   console.log('password1', password1, 'password2', password2);
        //   if (password1 === password2 && password1.length>6){
        //      $scope.passwordsMatch = true;
        //   }
        //   else{
        //     $scope.passwordsMatch = false;
        //   }
        // }

        if ($scope.password.password1 === $scope.password.password2 && $scope.password.password1.length > 6) {
            $scope.passwordsMatch = true;
        } else {
            $scope.passwordsMatch = false;
        }
    };
    $scope.usernameTest = function () {
        console.log("Username Test has been run", $scope.allUsernames);
        if ($scope.allUsernames.indexOf($scope.username.username) !== -1) {
            $scope.usernameAvailable = false;
        } else if ($scope.username.username.length < 7) {
            $scope.usernameAvailable = true;
            $scope.usernameLength = false;
        } else {
            $scope.usernameAvailable = true;
            $scope.usernameLength = true;
        }
    };
    $scope.openPasswordChange = function () {
        $scope.displayPasswordChange = !$scope.displayPasswordChange;
    };
    $scope.openEmailChange = function () {
        $scope.displayEmailChange = !$scope.displayEmailChange;
    };
    $scope.openUsernameChange = function () {
        $scope.displayUsernameChange = !$scope.displayUsernameChange;
    };

    $("#passwordField1").on('keyup', function () {
        $scope.matching();
    });
    $("#passwordField2").on('keyup', function () {
        $scope.matching();
    });
    $("#UsernameField").on('keyup', function () {
        $scope.usernameTest();
    });
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

    // $scope.friends = [{
    //     id: 'friend1',
    //     email: $scope.user.email
    // }];

    $scope.comm.tasks = [{
        elemId: 'task0',
        name: '',
        decription: '',
        points: ''
    }];

    $scope.addTask = function () {
        var newTaskNum = $scope.comm.tasks.length;
        $scope.comm.tasks.push({
            elemId: 'task' + newTaskNum,
            name: '',
            decription: '',
            points: ''
        });
    };

    $scope.removeTask = function (elemId) {
        $scope.comm.tasks = $scope.comm.tasks.filter(function (e) {
            return e.elemId !== elemId;
        });
    };

    // $scope.addFriends = function() {
    //     // $state.go('u.create.friends', {
    //     //     friends: $scope.players
    //     // });
    //     $mdDialog.show({
    //         templateUrl: 'js/add-friends/add-friends.html',
    //         controller: 'AddFriendsCtrl',
    //         scope: $scope
    //     });
    // }
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
        $scope.comm.tasks = $scope.comm.tasks.map(function (task) {
            delete task.elemId;
            return task;
        });
        GameFactory.createGame($scope.comm).then(function (gameId) {
            console.log(gameId);
            $state.go('u.edit', { gameId: gameId.id });
        });
    };
});

app.config(function ($stateProvider) {
    $stateProvider.state('u.create', {
        url: '/create',
        templateUrl: 'js/create-game/create-game.html',
        controller: 'CreateGameCtrl'
    });
});

app.controller('DashCtrl', function ($scope, gameData, GameFactory, $log) {
    console.log("Got to Dash Ctrl: ", gameData);

    $scope.gameData = gameData;

    $scope.acceptInvite = function (game) {
        console.log("Accept Invite: ", game);
        GameFactory.acceptInvite($scope.user.id, game).catch($log);
    };

    $scope.areConfirmed = function () {
        return $scope.games.some(function (g) {
            return g.status == "Confirmed";
        });
    };

    $scope.arePending = function () {
        return $scope.games.some(function (g) {
            return g.status == "Pending";
        });
    };

    $scope.isUnconfirmed = function (game) {
        console.log("isUnconfirmed: ", game);
        return game.playerStatus == "Unconfirmed";
    };

    $scope.isInvited = function (game) {
        console.log("isInvited: ", game);
        return game.playerStatus == "Invited";
    };

    $scope.pieChartOptions = {
        chart: {
            type: 'pieChart',
            height: 500,
            x: function x(d) {
                return d.key;
            },
            y: function y(d) {
                return d.y;
            },
            showLabels: false,
            duration: 500,
            labelThreshold: 0.01,
            labelSunbeamLayout: true,
            legend: {
                margin: {
                    top: 5,
                    right: 5,
                    bottom: 5,
                    left: 0
                }
            },
            legendPosition: 'center'
        },
        title: {
            enable: true,
            text: "Current Point Share",
            className: 'h4',
            css: {
                'font-size': '24px'
            }
        }
    };

    $scope.barChartOptions = {
        chart: {
            type: 'discreteBarChart',
            height: 450,
            margin: {
                top: 20,
                right: 20,
                bottom: 50,
                left: 55
            },
            x: function x(d) {
                return d.label;
            },
            y: function y(d) {
                return d.value;
            },
            showValues: true,
            valueFormat: function valueFormat(d) {
                return d3.format('$,.2f')(d);
            },
            duration: 500,
            xAxis: {
                axisLabel: 'X Axis'
            },
            yAxis: {
                axisLabel: '',
                axisLabelDistance: -10,
                tickFormat: function tickFormat(d) {
                    return d3.format("$,.2f")(d);
                }
            },
            showXAxis: false
        },
        title: {
            enable: true,
            text: "Current Net Payouts",
            className: 'h4',
            css: {
                'font-size': '24px'
            }
        }
    };
});

app.config(function ($stateProvider) {
    $stateProvider.state('u.dash', {
        url: '/dash',
        templateUrl: 'js/dash/dash.html',
        controller: 'DashCtrl',
        resolve: {
            gameData: function gameData(GameFactory, $stateParams) {
                return GameFactory.getActiveGames($stateParams.userId);
            }
        }
    });
});

app.controller('EditGameCtrl', function ($scope, $mdDialog, $state, UserFactory, $log, GameFactory, Comm) {
    $scope.selectedItem;
    $scope.searchText = '';

    $scope.comm = Comm;

    console.log($scope.comm);

    $scope.addTask = function () {
        var newTaskNum = $scope.comm.tasks.length;
        $scope.comm.tasks.push({
            elemId: 'task' + newTaskNum,
            name: '',
            description: '',
            points: ''
        });
    };

    $scope.removeTask = function (elemId) {
        $scope.comm.tasks = $scope.comm.tasks.filter(function (e) {
            return e.elemId !== elemId;
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
            $scope.comm.users.invited.push(selectedItem);
            $scope.foundMatches = [];
        }
    };

    $scope.update = function () {
        // we need to make sure we are not sending back game status either
        //perhap hit the api route with a game id
        $scope.comm.tasks = $scope.comm.tasks.map(function (task) {
            delete task.elemId;
            return task;
        });
        delete $scope.comm.status;
        console.log($scope.comm);
        GameFactory.updateGame($scope.comm).then(function (gameId) {
            return $state.go('u.edit', $scope.comm.id);
        });
    };

    $scope.lock = function () {
        $scope.comm.tasks = $scope.comm.tasks.map(function (task) {
            delete task.elemId;
            return task;
        });
        $scope.comm.locked = true;
        GameFactory.updateGame($scope.comm)
        // .tap(game => {
        //     GameFactory.confirmGame({
        //         startDate: game.start,
        //         endDate: game.end
        //     })
        // })
        .then(function (gameId) {
            return $state.go('u.game', { gameId: $scope.comm.id });
        });
    };
});

app.config(function ($stateProvider) {
    $stateProvider.state('u.edit', {
        url: '/edit/:gameId',
        templateUrl: 'js/edit-game/edit-game.html',
        controller: 'EditGameCtrl',
        resolve: {
            Comm: function Comm(GameFactory, $stateParams) {
                console.log($stateParams.gameId);
                return GameFactory.getGame($stateParams.gameId).then(function (gameObj) {
                    var invited = gameObj.users.filter(function (user) {
                        return user.GamePlayers.status === 'Invited';
                    });
                    var unconfirmed = gameObj.users.filter(function (user) {
                        return user.GamePlayers.status === 'Unconfirmed';
                    });
                    gameObj.users = {
                        invited: invited,
                        unconfirmed: unconfirmed
                    };
                    gameObj.tasks = gameObj.tasks.map(function (task, index) {
                        task.elemId = index;
                        return task;
                    });
                    return gameObj;
                });
            }
        }
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

    GameFactory.updateGame = function (data) {
        return $http.put('api/games/', data).then(function (newGame) {
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
        }).then(function (games) {
            games.forEach(function (game) {
                return game.timeTil = moment(game.start).fromNow();
            });
            return games;
        });
    };

    GameFactory.acceptInvite = function (user, game) {
        return $http.get('api/email/acceptInvite', { params: { 'user': user, 'game': game } }).then(function (game) {
            return game.data;
        });
    };

    GameFactory.getActiveGames = function (id) {
        return $http.get('api/games/user/' + id + '/active').then(function (games) {
            return games.data;
        }).then(function (games) {
            games.forEach(function (game) {
                var pieData = [];
                game.users.forEach(function (user) {
                    user.points = game.events.filter(function (event) {
                        return event.completedById === user.id;
                    }).map(function (event) {
                        return game.tasks.find(function (task) {
                            return task.id === event.taskId;
                        }).points;
                    }).reduce(function (prev, curr) {
                        return prev + curr;
                    }, 0);
                    var pieObj = { key: user.username, y: user.points };
                    pieData.push(pieObj);
                });

                game.pieChartData = pieData;

                var total = pieData.reduce(function (prev, curr) {
                    return prev + curr.y;
                }, 0);
                var barData = [{ label: "Over-Under", values: [] }];
                pieData.forEach(function (e) {
                    var barObj = {};
                    if (total) barObj.value = game.pledge * game.users.length * (e.y / total) - game.pledge;else barObj.value = 0;
                    barObj.label = e.key;
                    barData[0].values.push(barObj);
                });
                game.barChartData = barData;
                game.timeLeft = moment(game.end).fromNow();
            });
            return games;
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

    GameFactory.sendMessage = function (data) {
        console.log("message", data);
        return $http.post('api/games/message', data).then(function (res) {
            return res.data;
        });
    };

    GameFactory.getMessages = function (id) {
        console.log("get message function", id);
        return $http.get('api/games/messages/' + id).then(function (res) {
            return res.data;
        });
    };

    return GameFactory;
});

app.factory('socket', function ($rootScope) {
    var socket = io.connect();
    return {
        on: function on(eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function emit(eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        },
        removeAllListeners: function removeAllListeners(eventName, callback) {
            socket.removeAllListeners(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        }
    };
});

app.config(function ($stateProvider) {
    $stateProvider.state('u.game', {
        url: '/game/overview/:gameId',
        templateUrl: 'js/game-overview/user-games.html',
        controller: 'GameOverviewCtrl',
        resolve: {
            gameObj: function gameObj($stateParams, GameFactory) {
                return GameFactory.getGame($stateParams.gameId);
            },
            messages: function messages($stateParams, GameFactory) {
                return GameFactory.getMessages($stateParams.gameId);
            }
        }
    });
});

app.controller('GameOverviewCtrl', function ($scope, gameObj, GameFactory, messages, socket) {

    $scope.game = gameObj;

    $scope.content = messages;

    console.log($scope.content);

    socket.on('connect', function () {
        console.log('You have connected to the server!');
        socket.emit('adduser', $scope.user.id, $scope.game.id);
    });

    socket.on('updatechat', function (data) {
        console.log("chat updated", data);
        $scope.content.push({ username: data.username, message: data.content, createdAt: Date.now() });
    });

    $scope.message = '';

    $scope.openMessages = false;

    $scope.openMessageBox = function () {
        $scope.openMessages = !$scope.openMessages;
    };

    $scope.sendMessage = function () {

        GameFactory.sendMessage({ gameId: $scope.game.id, username: $scope.user.username, message: $scope.message }).then($scope.content.push({ gameId: $scope.gameId, username: $scope.user.username, message: $scope.message, createdAt: Date.now() }));

        $scope.socketEmit($scope.message);

        $scope.message = '';
    };

    $scope.socketEmit = function () {
        console.log("sending message");
        socket.emit('send:message', {
            content: $scope.message,
            username: $scope.user.username,
            me: false
        });

        $scope.message = '';
    };

    console.log($scope.game);

    $scope.confirmed = $scope.game.users.filter(function (user) {
        return user.GamePlayers.status === "Confirmed";
    });
    $scope.unconfirmed = $scope.game.users.filter(function (user) {
        return user.GamePlayers.status === "Unconfirmed";
    });
    $scope.invited = $scope.game.users.filter(function (user) {
        return user.GamePlayers.status === "Invited";
    });

    $scope.pieChartOptions = {
        chart: {
            type: 'pieChart',
            height: 500,
            x: function x(d) {
                return d.key;
            },
            y: function y(d) {
                return d.y;
            },
            showLabels: false,
            duration: 500,
            labelThreshold: 0.01,
            labelSunbeamLayout: true,
            legend: {
                margin: {
                    top: 5,
                    right: 5,
                    bottom: 5,
                    left: 0
                }
            },
            legendPosition: 'center'
        },
        title: {
            enable: true,
            text: "Current Point Share",
            className: 'h4',
            css: {
                'font-size': '24px'
            }
        }
    };

    $scope.barChartOptions = {
        chart: {
            type: 'discreteBarChart',
            height: 450,
            margin: {
                top: 20,
                right: 20,
                bottom: 50,
                left: 55
            },
            x: function x(d) {
                return d.label;
            },
            y: function y(d) {
                return d.value;
            },
            showValues: true,
            valueFormat: function valueFormat(d) {
                return d3.format('$,.2f')(d);
            },
            duration: 500,
            xAxis: {
                axisLabel: 'X Axis'
            },
            yAxis: {
                axisLabel: '',
                axisLabelDistance: -10,
                tickFormat: function tickFormat(d) {
                    return d3.format("$,.2f")(d);
                }
            },
            showXAxis: false
        },
        title: {
            enable: true,
            text: "Current Net Payouts",
            className: 'h4',
            css: {
                'font-size': '24px'
            }
        }
    };
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
                    console.log(e);
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
        url: '/home',
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
        $http.post('/api/email/inviteFriends', {
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

    $scope.games = usersGames;

    $scope.menuItems = usersGames.filter(function (game) {
        return game.status !== 'Completed';
    });

    // awaiting usage
    // $scope.completedGames = usersGames.filter(game => game.status === 'Completed');

    $scope.goToEdit = function (commissionerId, locked) {
        return commissionerId === $scope.user.id && !locked;
    };

    $scope.invite = function () {
        $mdDialog.show({
            templateUrl: 'js/invite-friends/invite-friends.html',
            controller: 'InviteFriendsCtrl',
            scope: $scope
        });
    };
    $scope.logout = function () {
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

    UserFactory.getAllUsernames = function () {
        console.log("In get All Usernames");
        return $http.get('api/user/allUsernames').then(function (userNames) {
            console.log("returned from get all userNames with:", userNames.data);
            return userNames.data;
        });
    };
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

    UserFactory.updateUser = function (id, newUserInfo) {
        return $http.put('/api/user/' + id, newUserInfo).then(function (updatedUser) {
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
                return AuthService.getLoggedInUser().then(function (user) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFjY291bnQtc2V0dGluZ3MvYWNjb3VudC1zZXR0aW5ncy5qcyIsImFkZC1mcmllbmRzL2FkZC1mcmllbmRzLmNvbnRyb2xsZXIuanMiLCJhZGQtZnJpZW5kcy9hZGQtZnJpZW5kcy5zdGF0ZS5qcyIsImNvbXBsZXRlZC9jb21wbGV0ZWQuY29udHJvbGxlci5qcyIsImNvbXBsZXRlZC9jb21wbGV0ZWQuc3RhdGUuanMiLCJjcmVhdGUtZ2FtZS9jcmVhdGUtZ2FtZS5jb250cm9sbGVyLmpzIiwiY3JlYXRlLWdhbWUvY3JlYXRlLWdhbWUuc3RhdGUuanMiLCJkYXNoL2Rhc2guY29udHJvbGxlci5qcyIsImRhc2gvZGFzaC5zdGF0ZS5qcyIsImVkaXQtZ2FtZS9lZGl0LWdhbWUuY29udHJvbGxlci5qcyIsImVkaXQtZ2FtZS9lZGl0LWdhbWUuc3RhdGUuanMiLCJmc2EvZnNhLXByZS1idWlsdC5qcyIsImdhbWUtb3ZlcnZpZXcvZ2FtZS1mYWN0b3J5LmpzIiwiZ2FtZS1vdmVydmlldy9nYW1lLW92ZXJ2aWV3LmpzIiwiZ2FtZS1vdmVydmlldy9sZWFkZXJib2FyZC5qcyIsImdhbWUtb3ZlcnZpZXcvbmV3c2ZlZWQuanMiLCJob21lL2hvbWUuY29udHJvbGxlci5qcyIsImhvbWUvaG9tZS5zdGF0ZS5qcyIsImludml0ZS1mcmllbmRzL2ludml0ZS1mcmllbmRzLmNvbnRyb2xsZXIuanMiLCJpbnZpdGUtZnJpZW5kcy9zdWNjZXNzLmNvbnRyb2xsZXIuanMiLCJsb2dpbi9sb2dpbi5jb250cm9sbGVyLmpzIiwibG9naW4vbG9naW4uc3RhdGUuanMiLCJvbGQtbmF2YmFyL25hdmJhci5qcyIsInNpZ251cC9zaWdudXAuY29udHJvbGxlci5qcyIsInNpZ251cC9zaWdudXAuc3RhdGUuanMiLCJ0YXNrLWRldGFpbC90YXNrLWRldGFpbC1mYWN0b3J5LmpzIiwidGFzay1kZXRhaWwvdGFzay1kZXRhaWwtc3RhdGUuanMiLCJ0YXNrLWRldGFpbC90YXNrLWRldGFpbC5jb250cm9sbGVyLmpzIiwidXNlci91c2VyLmNvbnRyb2xsZXIuanMiLCJ1c2VyL3VzZXIuZmFjdG9yeS5qcyIsInVzZXIvdXNlci5zdGF0ZS5qcyIsInVzZXItZ2FtZS1kZXRhaWwvdXNlci1nYW1lLWRldGFpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFDQSxPQUFBLEdBQUEsR0FBQSxRQUFBLE1BQUEsQ0FBQSxNQUFBLEVBQUEsQ0FDQSxhQURBLEVBRUEsV0FGQSxFQUdBLGNBSEEsRUFJQSxXQUpBLEVBS0EsWUFMQSxFQU1BLFFBTkEsRUFPQSxzQkFQQSxFQVFBLE1BUkEsQ0FBQSxDQUFBOztBQVdBLElBQUEsTUFBQSxDQUFBLFVBQUEsa0JBQUEsRUFBQSxpQkFBQSxFQUFBLGNBQUEsRUFBQTtBQUNBO0FBQ0Esc0JBQUEsU0FBQSxDQUFBLElBQUE7QUFDQTs7QUFFQSx1QkFBQSxTQUFBLENBQUEsT0FBQTtBQUNBO0FBQ0EsdUJBQUEsSUFBQSxDQUFBLGlCQUFBLEVBQUEsWUFBQTtBQUNBLGVBQUEsUUFBQSxDQUFBLE1BQUE7QUFDQSxLQUZBO0FBSUEsQ0FYQTs7QUFhQSxJQUFBLE1BQUEsQ0FBQSxVQUFBLGtCQUFBLEVBQUE7QUFDQSxRQUFBLGdCQUFBO0FBQ0EsY0FBQSxTQURBO0FBRUEsZUFBQSxTQUZBO0FBR0EsZUFBQSxTQUhBO0FBSUEsZUFBQSxTQUpBO0FBS0EsZUFBQSxTQUxBO0FBTUEsZUFBQSxTQU5BO0FBT0EsZUFBQSxTQVBBO0FBUUEsZUFBQSxTQVJBO0FBU0EsZUFBQSxTQVRBO0FBVUEsZUFBQSxTQVZBO0FBV0EsZ0JBQUEsU0FYQTtBQVlBLGdCQUFBLFNBWkE7QUFhQSxnQkFBQSxTQWJBO0FBY0EsZ0JBQUE7QUFkQSxLQUFBO0FBZ0JBLHVCQUNBLGFBREEsQ0FDQSxhQURBLEVBRUEsYUFGQTs7QUFJQSxRQUFBLGVBQUE7QUFDQSxjQUFBLFNBREE7QUFFQSxlQUFBLFNBRkE7QUFHQSxlQUFBLFNBSEE7QUFJQSxlQUFBLFNBSkE7QUFLQSxlQUFBLFNBTEE7QUFNQSxlQUFBLFNBTkE7QUFPQSxlQUFBLFNBUEE7QUFRQSxlQUFBLFNBUkE7QUFTQSxlQUFBLFNBVEE7QUFVQSxlQUFBLFNBVkE7QUFXQSxnQkFBQSxTQVhBO0FBWUEsZ0JBQUEsU0FaQTtBQWFBLGdCQUFBLFNBYkE7QUFjQSxnQkFBQTtBQWRBLEtBQUE7QUFnQkEsdUJBQ0EsYUFEQSxDQUNBLFlBREEsRUFFQSxZQUZBOztBQUlBLFFBQUEsYUFBQTtBQUNBLGNBQUEsU0FEQTtBQUVBLGVBQUEsU0FGQTtBQUdBLGVBQUEsU0FIQTtBQUlBLGVBQUEsU0FKQTtBQUtBLGVBQUEsU0FMQTtBQU1BLGVBQUEsU0FOQTtBQU9BLGVBQUEsU0FQQTtBQVFBLGVBQUEsU0FSQTtBQVNBLGVBQUEsU0FUQTtBQVVBLGVBQUEsU0FWQTtBQVdBLGdCQUFBLFNBWEE7QUFZQSxnQkFBQSxTQVpBO0FBYUEsZ0JBQUEsU0FiQTtBQWNBLGdCQUFBO0FBZEEsS0FBQTtBQWdCQSx1QkFDQSxhQURBLENBQ0EsVUFEQSxFQUVBLFVBRkE7O0FBSUEsUUFBQSxtQkFBQTtBQUNBLGNBQUEsU0FEQTtBQUVBLGVBQUEsU0FGQTtBQUdBLGVBQUEsU0FIQTtBQUlBLGVBQUEsU0FKQTtBQUtBLGVBQUEsU0FMQTtBQU1BLGVBQUEsU0FOQTtBQU9BLGVBQUEsU0FQQTtBQVFBLGVBQUEsU0FSQTtBQVNBLGVBQUEsU0FUQTtBQVVBLGVBQUEsU0FWQTtBQVdBLGdCQUFBLFNBWEE7QUFZQSxnQkFBQSxTQVpBO0FBYUEsZ0JBQUEsU0FiQTtBQWNBLGdCQUFBO0FBZEEsS0FBQTtBQWdCQSx1QkFDQSxhQURBLENBQ0EsZ0JBREEsRUFFQSxnQkFGQTs7QUFJQSx1QkFBQSxLQUFBLENBQUEsU0FBQSxFQUNBLGNBREEsQ0FDQSxhQURBLEVBQ0E7QUFDQSxtQkFBQSxLQURBO0FBRUEsaUJBQUE7QUFGQSxLQURBLEVBS0EsYUFMQSxDQUtBLFlBTEEsRUFNQSxXQU5BLENBTUEsVUFOQSxFQU9BLGlCQVBBLENBT0EsZ0JBUEE7QUFRQSxDQXpGQTs7QUEyRkE7QUFDQSxJQUFBLEdBQUEsQ0FBQSxVQUFBLFVBQUEsRUFBQSxXQUFBLEVBQUEsTUFBQSxFQUFBO0FBQ0E7QUFDQSxRQUFBLCtCQUFBLFNBQUEsNEJBQUEsQ0FBQSxLQUFBLEVBQUE7QUFDQSxlQUFBLE1BQUEsSUFBQSxJQUFBLE1BQUEsSUFBQSxDQUFBLFlBQUE7QUFDQSxLQUZBOztBQUlBO0FBQ0E7QUFDQSxlQUFBLEdBQUEsQ0FBQSxtQkFBQSxFQUFBLFVBQUEsS0FBQSxFQUFBLE9BQUEsRUFBQSxRQUFBLEVBQUE7QUFDQSxZQUFBLFFBQUEsSUFBQSxLQUFBLE1BQUEsRUFBQTtBQUNBLHdCQUFBLGVBQUEsR0FDQSxJQURBLENBQ0EsZ0JBQUE7QUFDQSx3QkFBQSxHQUFBLENBQUEsZ0JBQUEsRUFBQSxJQUFBO0FBQ0Esb0JBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxDQUFBLFFBQUEsRUFBQSxFQUFBLFFBQUEsS0FBQSxFQUFBLEVBQUEsRUFBQSxLQUNBO0FBQ0EsYUFMQTtBQU1BO0FBQ0EsWUFBQSxDQUFBLDZCQUFBLE9BQUEsQ0FBQSxFQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsWUFBQSxZQUFBLGVBQUEsRUFBQSxFQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQUEsY0FBQTs7QUFFQSxvQkFBQSxlQUFBLEdBQUEsSUFBQSxDQUFBLFVBQUEsSUFBQSxFQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQUEsSUFBQSxFQUFBO0FBQ0EsdUJBQUEsRUFBQSxDQUFBLFFBQUEsSUFBQSxFQUFBLFFBQUE7QUFDQSxhQUZBLE1BRUE7QUFDQSx1QkFBQSxFQUFBLENBQUEsT0FBQTtBQUNBO0FBQ0EsU0FUQTtBQVdBLEtBbENBO0FBb0NBLENBNUNBOztBQ3JIQSxJQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTtBQUNBLG1CQUFBLEtBQUEsQ0FBQSxXQUFBLEVBQUE7QUFDQSxhQUFBLHNCQURBO0FBRUEscUJBQUEsMkNBRkE7QUFHQSxvQkFBQSxxQkFIQTtBQUlBLGlCQUFB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RUFBQTtBQUNBLG1CQUFBLGtCQUFBO0FBQ0EsU0FGQSxNQUdBO0FBQ0Esd0JBQUEsVUFBQSxDQUFBLE9BQUEsSUFBQSxDQUFBLEVBQUEsRUFBQSxFQUFBLFVBQUEsT0FBQSxRQUFBLENBQUEsUUFBQSxFQUFBLEVBQUEsSUFBQSxDQUFBLFVBQUEsT0FBQSxFQUFBO0FBQ0EsdUJBQUEsbUJBQUE7QUFDQSxhQUZBO0FBR0E7QUFFQSxLQVZBOztBQVlBLFdBQUEsV0FBQSxHQUFBLFlBQUE7QUFDQSxZQUFBLE9BQUEsT0FBQSxhQUFBLENBQUEsT0FBQSxRQUFBLENBQUE7QUFDQSxnQkFBQSxHQUFBLENBQUEsSUFBQTtBQUNBLFlBQUEsQ0FBQSxJQUFBLEVBQUE7QUFDQSxtQkFBQSxlQUFBO0FBQ0EsU0FGQSxNQUdBO0FBQ0Esd0JBQUEsVUFBQSxDQUFBLE9BQUEsSUFBQSxDQUFBLEVBQUEsRUFBQSxFQUFBLE9BQUEsT0FBQSxRQUFBLEVBQUEsRUFDQSxJQURBLENBQ0EsVUFBQSxJQUFBLEVBQUE7QUFDQSx1QkFBQSxnQkFBQTtBQUNBLGFBSEE7QUFJQTtBQUNBLEtBWkE7O0FBY0EsV0FBQSxRQUFBLEdBQUEsRUFBQTs7QUFFQSxXQUFBLGtCQUFBLEdBQUEsS0FBQTtBQUNBLFdBQUEscUJBQUEsR0FBQSxLQUFBO0FBQ0EsV0FBQSxxQkFBQSxHQUFBLEtBQUE7O0FBRUEsV0FBQSxRQUFBLEdBQUEsRUFBQSxXQUFBLEVBQUEsRUFBQSxXQUFBLEVBQUEsRUFBQTs7QUFFQSxXQUFBLGNBQUEsR0FBQSxLQUFBO0FBQ0EsV0FBQSxpQkFBQSxHQUFBLEtBQUE7QUFDQSxXQUFBLGNBQUEsR0FBQSxLQUFBO0FBQ0EsV0FBQSxRQUFBLEdBQUEsRUFBQTs7QUFFQSxXQUFBLFFBQUEsR0FBQSxZQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsWUFBQSxPQUFBLFFBQUEsQ0FBQSxTQUFBLEtBQUEsT0FBQSxRQUFBLENBQUEsU0FBQSxJQUFBLE9BQUEsUUFBQSxDQUFB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O0FBR0Esb0JBQUE7QUFIQSxLQUFBO0FBS0EsQ0FOQTs7QUNBQSxJQUFBLFVBQUEsQ0FBQSxVQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsUUFBQSxFQUFBLFdBQUEsRUFBQSxJQUFBLEVBQUE7QUFDQSxZQUFBLEdBQUEsQ0FBQSxvQkFBQSxFQUFBLFFBQUE7O0FBR0EsV0FBQSxRQUFBLEdBQUEsUUFBQTs7QUFFQSxXQUFBLFlBQUEsR0FBQSxVQUFBLElBQUEsRUFBQTtBQUNBLGdCQUFBLEdBQUEsQ0FBQSxpQkFBQSxFQUFBLElBQUE7QUFDQSxvQkFBQSxZQUFBLENBQUEsT0FBQSxJQUFBLENBQUEsRUFBQSxFQUFBLElBQUEsRUFDQSxLQURBLENBQ0EsSUFEQTtBQUVBLEtBSkE7O0FBTUEsV0FBQSxZQUFBLEdBQUEsWUFBQTtBQUNBLGVBQUEsT0FBQSxLQUFBLENBQUEsSUFBQSxDQUFBO0FBQUEsbUJBQUEsRUFBQSxNQUFBLElBQUEsV0FBQTtBQUFBLFNBQUEsQ0FBQTtBQUNBLEtBRkE7O0FBSUEsV0FBQSxVQUFBLEdBQUEsWUFBQTtBQUNBLGVBQUEsT0FBQSxLQUFBLENBQUEsSUFBQSxDQUFBO0FBQUEsbUJBQUEsRUFBQSxNQUFBLElBQUEsU0FBQTtBQUFBLFNBQUEsQ0FBQTtBQUNBLEtBRkE7O0FBSUEsV0FBQSxhQUFBLEdBQUEsVUFBQSxJQUFBLEVBQUE7QUFDQSxnQkFBQSxHQUFBLENBQUEsaUJBQUEsRUFBQSxJQUFBO0FBQ0EsZUFBQSxLQUFBLFlBQUEsSUFBQSxhQUFBO0FBQ0EsS0FIQTs7QUFLQSxXQUFBLFNBQUEsR0FBQSxVQUFBLElBQUEsRUFBQTtBQUNBLGdCQUFBLEdBQUEsQ0FBQSxhQUFBLEVBQUEsSUFBQTtBQUNBLGVBQUEsS0FBQSxZQUFBLElBQUEsU0FBQTtBQUNBLEtBSEE7O0FBTUEsV0FBQSxlQUFBLEdBQUE7QUFDQSxlQUFBO0FBQ0Esa0JBQUEsVUFEQTtBQUVBLG9CQUFBLEdBRkE7QUFHQSxlQUFBLFdBQUEsQ0FBQSxFQUFBO0FBQUEsdUJBQUEsRUFBQSxHQUFBO0FBQUEsYUFI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Q0FBQTtBQUNBLEtBRkE7O0FBSUEsV0FBQSxVQUFBLEdBQUEsVUFBQSxJQUFBLEVBQUE7QUFDQSxnQkFBQSxHQUFBLENBQUEsSUFBQTtBQUNBLG9CQUFBLFlBQUEsQ0FBQSxJQUFBLEVBQ0EsSUFEQSxDQUNBLGlCQUFBO0FBQ0EsbUJBQUEsWUFBQSxHQUFBLEtBQUE7QUFDQSxvQkFBQSxHQUFBLENBQUEsS0FBQTtBQUNBLFNBSkEsRUFNQSxLQU5BLENBTUE7QUFBQSxtQkFBQSxLQUFBLEtBQUE7QUFBQSxTQU5BO0FBUUEsS0FWQTtBQVdBLFdBQUEsU0FBQSxHQUFBLFVBQUEsWUFBQSxFQUFBO0FBQ0EsWUFBQSxZQUFBLEVBQUE7QUFDQSxtQkFBQSxJQUFBLENBQUEsS0FBQSxDQUFBLE9BQUEsQ0FBQSxJQUFBLENBQUEsWUFBQTtBQUNBLG1CQUFBLFlBQUEsR0FBQSxFQUFBO0FBQ0E7QUFDQSxLQUxBOztBQU9BLFdBQUEsTUFBQSxHQUFBLFlBQUE7QUFDQTtBQUNBO0FBQ0EsZUFBQSxJQUFBLENBQUEsS0FBQSxHQUFBLE9BQUEsSUFBQSxDQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsZ0JBQUE7QUFDQSxtQkFBQSxLQUFBLE1BQUE7QUFDQSxtQkFBQSxJQUFBO0FBQ0EsU0FIQSxDQUFBO0FBSUEsZUFBQSxPQUFBLElBQUEsQ0FBQSxNQUFBO0FBQ0EsZ0JBQUEsR0FBQSxDQUFBLE9BQUEsSUFBQTtBQUNBLG9CQUFBLFVBQUEsQ0FBQSxPQUFBLElBQUEsRUFDQSxJQURBLENBQ0E7QUFBQSxtQkFBQSxPQUFBLEVBQUEsQ0FBQSxRQUFBLEVBQUEsT0FBQSxJQUFBLENBQUEsRUFBQSxDQUFBO0FBQUEsU0FEQTtBQUVBLEtBWEE7O0FBYUEsV0FBQSxJQUFBLEdBQUEsWUFBQTtBQUNBLGVBQUEsSUFBQSxDQUFBLEtBQUEsR0FBQSxPQUFBLElBQUEsQ0FBQSxLQUFBLENBQUEsR0FBQSxDQUFBLGdCQUFBO0FBQ0EsbUJBQUEsS0FBQSxNQUFBO0FBQ0EsbUJBQUEsSUFBQTtBQUNBLFNBSEEsQ0FBQTtBQUlBLGVBQUEs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QUFBO0FBQ0EsbUJBQUEsVUFBQSxHQUFBLENBQUEsaUJBQUEsQ0FBQTtBQUNBLFNBSkEsQ0FBQTtBQU1BLEtBUEE7O0FBU0EsUUFBQSxPQUFBLENBQUEsYUFBQSxFQUFBLFVBQUEsS0FBQSxFQUFBLE9BQUEsRUFBQSxVQUFBLEVBQUEsV0FBQSxFQUFBLEVBQUEsRUFBQTs7QUFFQSxpQkFBQSxpQkFBQSxDQUFBLFFBQUEsRUFBQTtBQUNBLGdCQUFBLE9BQUEsU0FBQSxJQUFBO0FBQ0Esb0JBQUEsTUFBQSxDQUFBLEtBQUEsRUFBQSxFQUFBLEtBQUEsSUFBQTtBQUNBLHVCQUFBLFVBQUEsQ0FBQSxZQUFBLFlBQUE7QUFDQSxtQkFBQSxLQUFBLElBQUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBQSxlQUFBLEdBQUEsWUFBQTtBQUNBLG1CQUFBLENBQUEsQ0FBQSxRQUFBLElBQUE7QUFDQSxTQUZBOztBQUlBLGFBQUEsZUFBQSxHQUFBLFVBQUEsVUFBQSxFQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsZ0JBQUEsS0FBQSxlQUFBLE1BQUEsZUFBQSxJQUFBLEVBQUE7QUFDQSx1QkFBQSxHQUFBLElBQUEsQ0FBQSxRQUFBLElBQUEsQ0FBQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1CQUFBLE1BQUEsR0FBQSxDQUFBLFVBQUEsRUFBQSxJQUFBLENBQUEsaUJBQUEsRUFBQSxLQUFBLENBQUEsWUFBQTtBQUNBLHVCQUFBLElBQUE7QUFDQSxhQUZBLENBQUE7QUFJQSxTQXJCQTs7QUF1QkEsYUFBQSxLQUFBLEdBQUEsVUFBQSxXQUFBLEVBQUE7QUFDQSxtQkFBQSxNQUFBLElBQUEsQ0FBQSxRQUFBLEVBQUEsV0FBQSxFQUNBLElBREEsQ0FDQSxpQkFEQSxFQUVBLEtBRkEsQ0FFQSxZQUFBO0FBQ0EsdUJBQUEsR0FBQSxNQUFBLENBQUEsRUFBQSxTQUFBLDRCQUFBLEVBQUEsQ0FBQTtBQUNBLGFBSkEsQ0FBQTtBQUtBLFNBTkE7O0FBUUEsYUFBQSxNQUFBLEdBQUEsWUFBQTtBQUNBLG1CQUFBLE1BQUEsR0FBQSxDQUFBLFNBQUEsRUFBQSxJQUFBLENBQUEsWUFBQTtBQUNBLHdCQUFBLE9BQUE7QUFDQSwyQkFBQSxVQUFBLENBQUEsWUFBQSxhQUFBO0FBQ0EsYUFIQSxDQUFBO0FBSUEsU0FMQTtBQU9BLEtBckRBOztBQXVEQSxRQUFBLE9BQUEsQ0FBQSxTQUFBLEVBQUEsVUFBQSxVQUFBLEVBQUEsV0FBQSxFQUFBOztBQUVBLFlBQUEsT0FBQSxJQUFBOztBQUVBLG1CQUFBLEdBQUEsQ0FBQSxZQUFBLGdCQUFBLEVBQUEsWUFBQTtBQUNBLGlCQUFBLE9BQUE7QUFDQSxTQUZBOztBQUlBLG1CQUFBLEdBQUEsQ0FBQSxZQUFBLGNBQUEsRUFBQSxZQUFBO0FBQ0EsaUJBQUEsT0FBQTtBQUNBLFNBRkE7O0FBSUEsYUFBQSxFQUFBLEdBQUEsSUFBQTtBQUNBLGFBQUEsSUFBQSxHQUFBLElBQUE7O0FBRUEsYUFBQSxNQUFBLEdBQUEsVUFBQSxTQUFBLEVBQUEsSUFBQSxFQUFBO0FBQ0EsaUJBQUEsRUFBQSxHQUFBLFNBQUE7QUFDQSxpQkFBQSxJQUFBLEdBQUEsSUFBQTtBQUNBLFNBSEE7O0FBS0EsYUFBQSxPQUFBLEdBQUEsWUFBQTtBQUNBLGlCQUFBLEVBQUEsR0FBQSxJQUFBO0FBQ0EsaUJBQUEsSUFBQSxHQUFBLElBQUE7QUFDQSxTQUhBO0FBS0EsS0F6QkE7QUEyQkEsQ0FwSUE7O0FDQUE7O0FBRUEsSUFBQSxPQUFBLENBQUEsYUFBQSxFQUFBLFVBQUEsS0FBQSxFQUFBO0FBQ0EsUUFBQSxjQUFBLEVBQUE7O0FBRUEsZ0JBQUEsT0FBQSxHQUFBLFVBQUEsRUFBQSxFQUFBO0FBQ0EsZUFBQSxNQUFBLEdBQUEsQ0FBQSxlQUFBLEVBQUEsRUFDQSxJQURBLENBQ0E7QUFBQSxtQkFBQSxLQUFBLElBQUE7QUFBQSxTQURBLENBQUE7QUFFQSxLQUhBOztBQUtBLGdCQUFBLFVBQUEsR0FBQSxVQUFBLElBQUEsRUFBQTtBQUNBLGVBQUEsTUFBQSxJQUFBLENBQUEsWUFBQSxFQUFBLElBQUEsRUFDQSxJQURBLENBQ0E7QUFBQSxtQkFBQSxRQUFBLElBQUE7QUFBQSxTQURBLENBQUE7QUFFQSxLQUhBOztBQUtBLGdCQUFBLFVBQUEsR0FBQSxVQUFBLElBQUEsRUFBQTtBQUNBLGVBQUEsTUFBQSxHQUFBLENBQUEsWUFBQSxFQUFBLElBQUEsRUFDQSxJQURBLENBQ0E7QUFBQSxtQkFBQSxRQUFBLElBQUE7QUFBQSxTQURBLENBQUE7QUFFQSxLQUhBOztBQUtBLGdCQUFBLFlBQUEsR0FBQSxVQUFBLElBQUEsRUFBQTtBQUNBLGVBQUEsTUFBQSxJQUFBLENBQUEsWUFBQSxFQUFBLElBQUEsRUFDQSxJQURBLENBQ0E7QUFBQSxtQkFBQSxTQUFBLElBQUE7QUFBQSxTQURBLENBQUE7QUFFQSxLQUhBOztBQUtBLGdCQUFBLGFBQUEsR0FBQSxVQUFBLEVBQUEsRUFBQTtBQUNBLGVBQUEsTUFBQSxHQUFBLENBQUEsb0JBQUEsRUFBQSxFQUNBLElBREEsQ0FDQTtBQUFBLG1CQUFBLE1BQUEsSUFBQTtBQUFBLFNBREEsRUFFQSxJQUZBLENBRUEsaUJBQUE7QUFDQSxrQkFBQSxPQUFBLENBQUE7QUFBQSx1QkFBQSxLQUFBLE9BQUEsR0FBQSxPQUFBLEtBQUEsS0FBQSxFQUFBLE9BQUEsRUFBQTtBQUFBLGFBQUE7QUFDQSxtQkFBQSxLQUFBO0FBQ0EsU0FMQSxDQUFBO0FBT0EsS0FSQTs7QUFVQSxnQkFBQSxZQUFBLEdBQUEsVUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBO0FBQ0EsZUFBQSxNQUFBLEdBQUEsQ0FBQSx3QkFBQSxFQUFBLEVBQUEsUUFBQSxFQUFBLFFBQUEsSUFBQSxFQUFBLFFBQUEsSUFBQSxFQUFBLEVBQUEsRUFDQSxJQURBLENBQ0E7QUFBQSxtQkFBQSxLQUFBLElBQUE7QUFBQSxTQURBLENBQUE7QUFFQSxLQUhBOztBQUtBLGdCQUFBLGNBQUEsR0FBQSxVQUFBLEVBQUEsRUFBQTtBQUNBLGVBQUEsTUFBQSxHQUFBLENBQUEsb0JBQUEsRUFBQSxHQUFBLFNBQUEsRUFDQSxJQURBLENBQ0E7QUFBQSxtQkFBQSxNQUFBLElBQUE7QUFBQSxTQURBLEVBRUEsSUFGQSxDQUVBLGlCQUFBO0FBQ0Esa0JBQUEsT0FBQSxDQUFBLGdCQUFBO0FBQ0Esb0JBQUEsVUFBQSxFQUFBO0FBQ0EscUJBQUEsS0FBQSxDQUFBLE9BQUEsQ0FBQSxnQkFBQTtBQUNBLHlCQUFBLE1BQUEsR0FBQSxLQUFBLE1BQUEsQ0FBQSxNQUFBLENBQUE7QUFBQSwrQkFBQSxNQUFBLGFBQUEsS0FBQSxLQUFBLEVBQUE7QUFBQSxxQkFBQSxFQUNBLEdBREEsQ0FDQTtBQUFBLCtCQUFBLEtBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQTtBQUFBLG1DQUFBLEtBQUEsRUFBQSxLQUFBLE1BQUEsTUFBQTtBQUFBLHlCQUFBLEVBQUEsTUFBQTtBQUFBLHFCQURBLEVBRUEsTUFGQSxDQUVBLFVBQUEsSUFBQSxFQUFBLElBQUE7QUFBQSwrQkFBQSxPQUFBLElBQUE7QUFBQSxxQkFGQSxFQUVBLENBRkEsQ0FBQTtBQUdBLHdCQUFBLFNBQUEsRUFBQSxLQUFBLEtBQUEsUUFBQSxFQUFBLEdBQUEsS0FBQSxNQUFBLEVBQUE7QUFDQSw0QkFBQSxJQUFBLENBQUEsTUFBQTtBQUNBLGlCQU5BOztBQVFBLHFCQUFBLFlBQUEsR0FBQSxPQUFBOztBQUVBLG9CQUFBLFFBQUEsUUFBQSxNQUFBLENBQUEsVUFBQSxJQUFBLEVBQUEsSUFBQTtBQUFBLDJCQUFBLE9BQUEsS0FBQSxDQUFBO0FBQUEsaUJBQUEsRUFBQSxDQUFBLENBQUE7QUFDQSxvQkFBQSxVQUFBLENBQUEsRUFBQSxPQUFBLFlBQUEsRUFBQSxRQUFBLEVBQUEsRUFBQSxDQUFBO0FBQ0Esd0JBQUEsT0FBQSxDQUFBLGFBQUE7QUFDQSx3QkFBQSxTQUFBLEVBQUE7QUFDQSx3QkFBQSxLQUFBLEVBQUEsT0FBQSxLQUFBLEdBQUEsS0FBQSxNQUFBLEdBQUEsS0FBQSxLQUFBLENBQUEsTUFBQSxJQUFBLEVBQUEsQ0FBQSxHQUFBLEtBQUEsSUFBQSxLQUFBLE1BQUEsQ0FBQSxLQUNBLE9BQUEsS0FBQSxHQUFB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QUFDQSxLQUZBOztBQUlBLFdBQUEsV0FBQSxHQUFBLFlBQUE7O0FBRUEsb0JBQUEsV0FBQSxDQUFBLEVBQUEsUUFBQSxPQUFBLElBQUEsQ0FBQSxFQUFBLEVBQUEsVUFBQSxPQUFBLElBQUEsQ0FBQSxRQUFBLEVBQUEsU0FBQSxPQUFBLE9BQUEsRUFBQSxFQUNBLElBREEsQ0FDQSxPQUFBLE9BQUEsQ0FBQSxJQUFBLENBQUEsRUFBQSxRQUFBLE9BQUEsTUFBQSxFQUFBLFVBQUEsT0FBQSxJQUFBLENBQUEsUUFBQSxFQUFBLFNBQUEsT0FBQSxPQUFBLEVBQUEsV0FBQSxLQUFBLEdBQUEsRUFBQSxFQUFBLENBREE7O0FBR0EsZUFBQSxVQUFBLENBQUEsT0FBQSxPQUFBOztBQUVBLGVBQUEsT0FBQSxHQUFBLEVBQUE7QUFFQSxLQVRBOztBQVdBLFdBQUEsVUFBQSxHQUFBLFlBQUE7QUFDQSxnQkFBQSxHQUFBLENBQUEsaUJBQUE7QUFDQSxlQUFBLElBQUEsQ0FBQSxjQUFBLEVBQUE7QUFDQSxxQkFBQSxPQUFBLE9BREE7QUFFQSxzQkFBQSxPQUFBLElBQUEsQ0FBQSxRQUZBO0FBR0EsZ0JBQUE7QUFIQSxTQUFBOztBQU1BLGVBQUEsT0FBQSxHQUFBLEVBQUE7QUFDQSxLQVRBOztBQVdBLFlBQUEsR0FBQSxDQUFBLE9BQUEsSUFBQTs7QUFFQSxXQUFBLFNBQUEsR0FBQSxPQUFBLElBQUEsQ0FBQSxLQUFBLENBQUEsTUFBQSxDQUFBO0FBQUEsZUFBQSxLQUFBLFdBQUEsQ0FBQSxNQUFBLEtBQUEsV0FBQTtBQUFBLEtBQUEsQ0FBQTtBQUNBLFdBQUEsV0FBQSxHQUFBLE9BQUEsSUFBQSxDQUFBLEtBQUEsQ0FBQSxNQUFBLENBQUE7QUFBQSxlQUFBLEtBQUEsV0FBQSxDQUFBLE1BQUEsS0FBQSxhQUFBO0FBQUEsS0FBQSxDQUFBO0FBQ0EsV0FBQSxPQUFBLEdBQUEsT0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLE1BQUEsQ0FBQTtBQUFBLGVBQUEsS0FBQSxXQUFBLENBQUEsTUFBQSxLQUFBLFNBQUE7QUFBQSxL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QUNBLG1CQUFBLEtBQUEsQ0FBQSxNQUFBLEVBQUE7QUFDQSxhQUFBLE9BREE7QUFFQSxxQkFBQTtBQUZBLEtBQUE7QUFJQSxDQUxBOztBQ0FBLElBQUEsVUFBQSxDQUFBLG1CQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLFNBQUEsRUFBQSxLQUFBLEVBQUE7O0FBRUEsV0FBQSxPQUFBLEdBQUEsRUFBQTs7QUFFQSxZQUFBLEdBQUEsQ0FBQSxlQUFBLEVBQUEsT0FBQSxPQUFBOztBQUVBLFdBQUEsU0FBQSxHQUFBLFVBQUEsS0FBQSxFQUFBO0FBQ0EsWUFBQSxhQUFBLGdRQUFBO0FBQ0EsWUFBQSxDQUFBLE1BQUEsS0FBQSxDQUFBLFVBQUEsQ0FBQSxFQUFBO0FBQ0EsWUFBQSxlQUFBLE9BQUEsT0FBQSxDQUFBLE1BQUEsR0FBQSxDQUFBO0FBQ0EsZUFBQSxPQUFBLENBQUEsSUFBQSxDQUFBO0FBQ0EsZ0JBQUEsV0FBQSxZQURBO0FBRUEsbUJBQUE7QUFGQSxTQUFBO0FBSUEsS0FSQTs7QUFVQSxXQUFBLFlBQUEsR0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLGVBQUEsT0FBQSxHQUFBLE9BQUEsT0FBQSxDQUFBLE1BQUEsQ0FBQTtBQUFBLG1CQUFBLEVBQUEsRUFBQSxLQUFBLFFBQUE7QUFBQSxTQUFBLENBQUE7QUFDQSxLQUZBOztBQUlBLFdBQUEsWUFBQSxHQUFBLFlBQUE7QUFDQSxZQUFBLFNBQUEsRUFBQTtBQUNBLGVBQUEsT0FBQSxDQUFBLE9BQUEsQ0FBQTtBQUFBLG1CQUFBLE9BQUEsSUFBQSxDQUFBLE9BQUEsS0FBQSxDQUFBO0FBQUEsU0FBQTtBQUNBLGNBQUEsSUFBQSxDQUFBLDBCQUFBLEVBQUE7QUFDQSxvQkFBQSxNQURBO0FBRUEsa0JBQUE7QUFDQSwyQkFBQSxPQUFBLElBQUEsQ0FBQSxTQURBO0FBRUEsMEJBQUEsT0FBQSxJQUFBLENBQUE7QUFGQTtBQUZBLFNBQUEsRUFPQSxJQVBBLENBT0EsWUFBQTtBQUNBLHNCQUFBLElBQUEsQ0FBQTtBQUNBLDZCQUFBLGdDQURB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LEdBQUEsQ0FBQTtBQUNBLFlBQUEsT0FBQSxhQUFBLENBQUEsQ0FBQTtBQUNBLFlBQUEsUUFBQSxhQUFBLENBQUEsQ0FBQTtBQUNBLFlBQUEsTUFBQSxhQUFBLENBQUEsQ0FBQTtBQUNBLFlBQUEsT0FBQSxjQUFBLEtBQUEsQ0FBQSxjQUFBLE9BQUEsQ0FBQSxHQUFBLElBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsZ0JBQUEsR0FBQSxDQUFBLElBQUE7QUFDQTtBQUNBLGVBQUEsUUFBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLEdBQUEsR0FBQSxHQUFBLElBQUE7QUFDQSxLQVZBOztBQVlBLFdBQUEsSUFBQSxHQUFBLGFBQUEsSUFBQTs7QUFFQSxXQUFBLE1BQUEsR0FBQSxPQUFBLEdBQUEsQ0FBQSxVQUFBLEtBQUEsRUFBQTtBQUNBLGNBQUEsU0FBQSxHQUFBLE9BQUEsV0FBQSxDQUFBLE1BQUEsU0FBQSxDQUFBO0FBQ0EsZUFBQSxLQUFBO0FBQ0EsS0FIQSxDQUFBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSxXQUFBLFlBQUEsR0FBQSxZQUFBO0FBQ0EsZ0JBQUEsR0FBQSxDQUFBLGVBQUEsRUFBQSxPQUFBLE1BQUE7QUFDQTtBQUNBLEtBSEE7O0FBS0EsV0FBQSxZQUFBOztBQUVBLFdBQUEsTUFBQSxHQUFBLElBQUE7O0FBRUEsV0FBQSxXQUFBLEdBQUEsVUFBQSxFQUFBLEVBQUE7QUFDQTtBQUNBLFlBQUEsVUFBQSxVQUFBLE9BQUEsR0FDQSxLQURBLENBQ0EsdUNBREEsRUFFQSxXQUZBLENBRUEseURBRkEsRUFHQSxTQUhBLENBR0EsWUFIQSxFQUlBLFdBSkEsQ0FJQSxFQUpBLEVBS0EsRUFMQSxDQUtBLFlBTEEsRUFNQSxNQU5BLENBTUEsZ0JBTkEsQ0FBQTtBQU9BLGtCQUFBLElBQUEsQ0FBQSxPQUFBLEVBQUEsSUFBQSxDQUFBLFlBQUE7QUFDQSxtQkFBQSxNQUFBLEdBQUEsV0FBQTtBQUNBLG9CQUFBLEdBQUEsQ0FBQSxPQUFBLE1BQUE7QUFDQSx3QkFBQSxZQUFBLENBQUEsRUFBQSxlQUFBLE9BQUEsSUFBQSxDQUFBLEVBQUEsRUFBQSxRQUFBLE9BQUEsSUFBQSxDQUFBLEVBQUEsRUFBQSxRQUFBLE9BQUEsSUFBQSxDQUFBLE1BQUEsRUFBQSxFQUNBLElBREEsQ0FDQTtBQUFBLHVCQUFBLElBQUE7QUFBQSxhQURBO0FBRUEsU0FMQSxFQUtBLFlBQUE7QUFDQSxtQkFBQSxNQUFBLEdBQUEsZUFBQTtBQUNBLG9CQUFBLEdBQUEsQ0FBQSxPQUFBLE1BQUE7QUFDQSxTQVJBO0FBU0EsS0FsQkE7QUFtQkEsQ0E3RUE7O0FDQUEsSUFBQSxVQUFBLENBQUEsVUFBQSxFQUFBLFVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxZQUFBLEVBQUEsV0FBQSxFQUFBLFVBQUEsRUFBQSxTQUFBLEVBQUEsSUFBQSxFQUFBO0FBQ0EsV0FBQSxJQUFBLEdBQUEsSUFBQTs7QUFFQSxXQUFBLFVBQUEsR0FBQSxZQUFBO0FBQ0EsZUFBQSxZQUFBLGVBQUEsRUFBQTtBQUNBLEtBRkE7O0FBSUEsV0FBQSxLQUFBLEdBQUEsVUFBQTs7QUFFQSxXQUFBLFNBQUEsR0FBQSxXQUFBLE1BQUEsQ0FBQTtBQUFBLGVBQUEsS0FBQSxNQUFBLEtBQUEsV0FBQTtBQUFBLEtBQUEsQ0FBQTs7QUFFQTtBQUNBOztBQUVBLFdBQUEsUUFBQSxHQUFBLFVBQUEsY0FBQSxFQUFBLE1BQUEsRUFBQTtBQUNBLGVBQUEsbUJBQUEsT0FBQSxJQUFBLENBQUEsRUFBQSxJQUFBLENBQUEsTUFBQTtBQUNBLEtBRkE7O0FBSUEsV0FBQSxNQUFBLEdBQUEsWUFBQTtBQUNBLGtCQUFBLElBQUEsQ0FBQTtBQUNBLHlCQUFBLHVDQURBO0FBRUEsd0JBQUEsbUJBRkE7QUFHQSxtQkFBQTtBQUhBLFNBQUE7QUFLQSxLQU5BO0FBT0EsV0FBQSxNQUFBLEdBQUEsWUFBQTtBQUNBLG9CQUFBLE1BQUEsR0FDQSxJQURBLENBQ0EsWUFBQTtBQUNBLG1CQUFBLEVBQUEsQ0FBQSxNQUFBO0FBQ0EsU0FIQSxFQUlBLEtBSkEsQ0FJQSxVQUFBLEdBQUEsRUFBQTtBQUNBLG9CQUFBLEdBQUEsQ0FBQSxHQUFBO0FBQ0EsU0FOQTtBQU9BLEtBUkE7QUFTQSxXQUFBLFNBQUEsR0FBQSxZQUFBO0FBQ0EsZUFBQSxFQUFBLENBQUEsUUFBQTtBQUNBLEtBRkE7QUFHQSxDQXJDQTs7QUNBQSxJQUFBLE9BQUEsQ0FBQSxhQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsS0FBQSxFQUFBOztBQUVBLFFBQUEsY0FBQSxFQUFBOztBQUVBLGdCQUFBLGVBQUEsR0FBQSxZQUFBO0FBQ0EsZ0JBQUEsR0FBQSxDQUFBLHNCQUFBO0FBQ0EsZUFBQSxNQUFBLEdBQUEsQ0FBQSx1QkFBQSxFQUNBLElBREEsQ0FDQSxVQUFBLFNBQUEsRUFBQTtBQUNBLG9CQUFBLEdBQUEsQ0FBQSx1Q0FBQSxFQUFBLFVBQUEsSUFBQTtBQUNBLG1CQUFBLFVBQUEsSUFBQTtBQUNBLFNBSkEsQ0FBQTtBQUtBLEtBUEE7QUFRQSxnQkFBQSxXQUFBLEdBQUEsVUFBQSxFQUFBLEVBQUE7QUFDQSxlQUFBLE1BQUEsR0FBQSxDQUFBLGVBQUEsRUFBQSxFQUNBLElBREEsQ0FDQSxVQUFBLElBQUEsRUFBQTtBQUNBLG1CQUFBLEtBQUEsSUFBQTtBQUNBLFNBSEEsQ0FBQTtBQUlBLEtBTEE7O0FBT0EsZ0JBQUEsYUFBQSxHQUFBLFVBQUEsVUFBQSxFQUFBO0FBQ0EsZUFBQSxNQUFBLElBQUEsQ0FBQSxTQUFBLEVBQUEsVUFBQSxFQUNBLElBREEsQ0FDQSxVQUFBLE9BQUEsRUFBQTtBQUNBLG1CQUFBLFFBQUEsSUFBQSxDQUFBLElBQUE7QUFDQSxTQUhBLENBQUE7QUFJQSxLQUxBOztBQU9BLGdCQUFBLFVBQUEsR0FBQSxVQUFBLEVBQUEsRUFBQSxXQUFBLEVBQUE7QUFDQSxlQUFBLE1BQUEsR0FBQSxDQUFBLGVBQUEsRUFBQSxFQUFBLFdBQUEsRUFDQSxJQURBLENBQ0EsVUFBQSxXQUFBLEVBQUE7QUFDQSxtQkFBQSxZQUFBLElBQUE7QUFDQSxTQUhBLENBQUE7QUFJQSxLQUxBOztBQU9BLGdCQUFBLFlBQUEsR0FBQSxVQUFBLEdBQUEsRUFBQTtBQUNBLGVBQUEsTUFBQSxHQUFBLENBQUEsc0JBQUEsR0FBQSxFQUNBLElBREEsQ0FDQTtBQUFBLG1CQUFBLE1BQUEsSUFBQTtBQUFBLFNBREEsQ0FBQTtBQUVBLEtBSEE7O0FBS0EsV0FBQSxXQUFBO0FBQ0EsQ0F2Q0E7O0FDQUEsSUFBQSxNQUFBLENBQUEsVUFBQSxjQUFBLEVBQUE7QUFDQSxtQkFBQSxLQUFBLENBQUEsR0FBQSxFQUFBO0FBQ0EsYUFBQSxZQURBO0FBRUEscUJBQUEsbUJBRkE7QUFHQSxvQkFBQSxVQUhBO0FBSUEsY0FBQSxFQUFBLGNBQUEsSUFBQSxFQUpBO0FBS0EsaUJBQUE7QUFDQSx3QkFBQSxvQkFBQSxZQUFBLEVBQUEsV0FBQSxFQUFBLFdBQUEsRUFBQTtBQUNBLHVCQUFBLFlBQUEsZUFBQSxHQUFBLElBQUEsQ0FBQSxnQkFBQTtBQUNBLDJCQUFBLFlBQUEsYUFBQSxDQUFBLEtBQUEsRUFBQSxDQUFBO0FBQUEsaUJBREEsQ0FBQTtBQUVBLGFBSkE7QUFLQSxrQkFBQSxjQUFBLFlBQUEsRUFBQSxXQUFBLEVBQUE7QUFDQSx1QkFBQSxZQUFBLGVBQUEsRUFBQTtBQUNBO0FBUEE7QUFMQSxLQUFBO0FBZUEsQ0FoQkE7O0FDQUEsSUFBQSxNQUFBLENBQUEsVUFBQSxjQUFBLEVBQUE7QUFDQSxtQkFBQSxLQUFBLENBQUEsZ0JBQUEsRUFBQTtBQUNBLGFBQUEsWUFEQTtBQUVBLHFCQUFBLDJDQUZBO0FBR0Esb0JBQUE7QUFIQSxLQUFBO0FBS0EsQ0FOQTs7QUFRQSxJQUFBLFVBQUEsQ0FBQSxjQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsVUFBQSxFQUFBLFFBQUEsRUFBQTtBQUNBLFdBQUEsWUFBQSxHQUFBLFlBQUE7QUFDQSxtQkFBQSxNQUFBLEVBQUEsTUFBQTtBQUNBLEtBRkE7QUFHQSxXQUFBLFNBQUEsR0FBQSxDQUFBO0FBQ0EsY0FBQTtBQURBLEtBQUEsRUFFQTtBQUNBLGNBQUE7QUFEQSxLQUZBLEVBSUE7QUFDQSxjQUFBO0FBREEsS0FKQSxFQU1BO0FBQ0EsY0FBQTtBQURBLEtBTkEsRUFRQTtBQUNBLGNBQUE7QUFEQSxLQVJBLENBQUE7QUFXQSxXQUFBLEtBQUEsR0FBQSxFQUFBO0FBQ0EsU0FBQSxJQUFBLElBQUEsQ0FBQSxFQUFBLElBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQTtBQUNBLGVBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSxFQUFBLE1BQUEsTUFBQSxFQUFBLFFBQUEsS0FBQSxLQUFBLENBQUEsS0FBQSxNQUFBLEtBQUEsRUFBQSxJQUFBLENBQUEsRUFBQSxNQUFBLElBQUEsSUFBQSxDQUFBLElBQUEsSUFBQSxNQUFBLEtBQUEsS0FBQSxDQUFBLEtBQUEsTUFBQSxLQUFBLEdBQUEsSUFBQSxDQUFBLENBQUEsRUFBQSxRQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxLQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxJQUFBLENBQUEsR0FBQSxDQUFBLEVBQUE7QUFDQTtBQUNBLFdBQUEsV0FBQSxHQUFBLE9BQUEsS0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLElBQUEsRUFBQSxJQUFBO0FBQUEsZUFBQSxPQUFBLEtBQUEsTUFBQTtBQUFBLEtBQUEsRUFBQSxDQUFBLENBQUE7QUFDQSxZQUFBLEdBQUEsQ0FBQSxPQUFBLEtBQUE7QUFDQSxXQUFBLE9BQUEsR0FBQSxPQUFBLFNBQUEsQ0FBQSxNQUFBLEdBQUEsQ0FBQTtBQUNBLFlBQUEsR0FBQSxDQUFBLE9BQUEsT0FBQTtBQUNBLENBdkJBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG53aW5kb3cuYXBwID0gYW5ndWxhci5tb2R1bGUoJ0dhbXInLCBbXG4gICAgJ2ZzYVByZUJ1aWx0JyxcbiAgICAndWkucm91dGVyJyxcbiAgICAndWkuYm9vdHN0cmFwJyxcbiAgICAnbmdBbmltYXRlJyxcbiAgICAnbmdNYXRlcmlhbCcsXG4gICAgJ25nQXJpYScsXG4gICAgJ25nTWF0ZXJpYWxEYXRlUGlja2VyJyxcbiAgICAnbnZkMydcbl0pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyLCAkc3RhdGVQcm92aWRlcikge1xuICAgIC8vIFRoaXMgdHVybnMgb2ZmIGhhc2hiYW5nIHVybHMgKC8jYWJvdXQpIGFuZCBjaGFuZ2VzIGl0IHRvIHNvbWV0aGluZyBub3JtYWwgKC9hYm91dClcbiAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG4gICAgLy8gSWYgd2UgZ28gdG8gYSBVUkwgdGhhdCB1aS1yb3V0ZXIgZG9lc24ndCBoYXZlIHJlZ2lzdGVyZWQsIGdvIHRvIHRoZSBcIi9cIiB1cmwuXG5cbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvaG9tZScpO1xuICAgIC8vIFRyaWdnZXIgcGFnZSByZWZyZXNoIHdoZW4gYWNjZXNzaW5nIGFuIE9BdXRoIHJvdXRlXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLndoZW4oJy9hdXRoLzpwcm92aWRlcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbigkbWRUaGVtaW5nUHJvdmlkZXIpe1xuICAgIHZhciBjdXN0b21QcmltYXJ5ID0ge1xuICAgICAgICAnNTAnOiAnI2JhZWRmMycsXG4gICAgICAgICcxMDAnOiAnI2E0ZTdmMCcsXG4gICAgICAgICcyMDAnOiAnIzhlZTFlYycsXG4gICAgICAgICczMDAnOiAnIzc5ZGNlOCcsXG4gICAgICAgICc0MDAnOiAnIzYzZDZlNScsXG4gICAgICAgICc1MDAnOiAnIzRERDBFMScsXG4gICAgICAgICc2MDAnOiAnIzAwQjVDRCcsXG4gICAgICAgICc3MDAnOiAnIzI0YzJkNycsXG4gICAgICAgICc4MDAnOiAnIzIxYWZjMScsXG4gICAgICAgICc5MDAnOiAnIzFkOWJhYicsXG4gICAgICAgICdBMTAwJzogJyNkMGYzZjcnLFxuICAgICAgICAnQTIwMCc6ICcjZTZmOGZiJyxcbiAgICAgICAgJ0E0MDAnOiAnI2ZjZmVmZScsXG4gICAgICAgICdBNzAwJzogJyMxOTg3OTUnXG4gICAgfTtcbiAgICAkbWRUaGVtaW5nUHJvdmlkZXJcbiAgICAgICAgLmRlZmluZVBhbGV0dGUoJ0dhbXJQcmltYXJ5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1c3RvbVByaW1hcnkpO1xuXG4gICAgdmFyIGN1c3RvbUFjY2VudCA9IHtcbiAgICAgICAgJzUwJzogJyNmZmRmNjEnLFxuICAgICAgICAnMTAwJzogJyNmZmU0N2EnLFxuICAgICAgICAnMjAwJzogJyNmZmVhOTQnLFxuICAgICAgICAnMzAwJzogJyNmZmVmYWQnLFxuICAgICAgICAnNDAwJzogJyNmZmY0YzcnLFxuICAgICAgICAnNTAwJzogJyNmZmY5ZTAnLFxuICAgICAgICAnNjAwJzogJyNmZmZmZmYnLFxuICAgICAgICAnNzAwJzogJyNmZmZmZmYnLFxuICAgICAgICAnODAwJzogJyNmZmZmZmYnLFxuICAgICAgICAnOTAwJzogJyNmZmZmZmYnLFxuICAgICAgICAnQTEwMCc6ICcjZmZmZmZmJyxcbiAgICAgICAgJ0EyMDAnOiAnI0ZGRkVGQScsXG4gICAgICAgICdBNDAwJzogJyNmZmY5ZTAnLFxuICAgICAgICAnQTcwMCc6ICcjZmZmZmZmJ1xuICAgIH07XG4gICAgJG1kVGhlbWluZ1Byb3ZpZGVyXG4gICAgICAgIC5kZWZpbmVQYWxldHRlKCdHYW1yQWNjZW50JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1c3RvbUFjY2VudCk7XG5cbiAgICB2YXIgY3VzdG9tV2FybiA9IHtcbiAgICAgICAgJzUwJzogJyNmZmIyODAnLFxuICAgICAgICAnMTAwJzogJyNmZmEyNjYnLFxuICAgICAgICAnMjAwJzogJyNmZjkzNGQnLFxuICAgICAgICAnMzAwJzogJyNmZjgzMzMnLFxuICAgICAgICAnNDAwJzogJyNmZjc0MWEnLFxuICAgICAgICAnNTAwJzogJyNmZjY0MDAnLFxuICAgICAgICAnNjAwJzogJyNlNjVhMDAnLFxuICAgICAgICAnNzAwJzogJyNjYzUwMDAnLFxuICAgICAgICAnODAwJzogJyNiMzQ2MDAnLFxuICAgICAgICAnOTAwJzogJyM5OTNjMDAnLFxuICAgICAgICAnQTEwMCc6ICcjZmZjMTk5JyxcbiAgICAgICAgJ0EyMDAnOiAnI2ZmZDFiMycsXG4gICAgICAgICdBNDAwJzogJyNmZmUwY2MnLFxuICAgICAgICAnQTcwMCc6ICcjODAzMjAwJ1xuICAgIH07XG4gICAgJG1kVGhlbWluZ1Byb3ZpZGVyXG4gICAgICAgIC5kZWZpbmVQYWxldHRlKCdHYW1yV2FybicsXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXN0b21XYXJuKTtcblxuICAgIHZhciBjdXN0b21CYWNrZ3JvdW5kID0ge1xuICAgICAgICAnNTAnOiAnI2ZmZmZmZicsXG4gICAgICAgICcxMDAnOiAnI2ZmZmZmZicsXG4gICAgICAgICcyMDAnOiAnI2ZmZmZmZicsXG4gICAgICAgICczMDAnOiAnI2ZmZmZmZicsXG4gICAgICAgICc0MDAnOiAnI2ZmZmZmZicsXG4gICAgICAgICc1MDAnOiAnI0ZGRkVGQScsXG4gICAgICAgICc2MDAnOiAnI2ZmZjllMCcsXG4gICAgICAgICc3MDAnOiAnI2ZmZjRjNycsXG4gICAgICAgICc4MDAnOiAnI2ZmZWZhZCcsXG4gICAgICAgICc5MDAnOiAnI2ZmZWE5NCcsXG4gICAgICAgICdBMTAwJzogJyNmZmZmZmYnLFxuICAgICAgICAnQTIwMCc6ICcjZmZmZmZmJyxcbiAgICAgICAgJ0E0MDAnOiAnI2ZmZmZmZicsXG4gICAgICAgICdBNzAwJzogJyNmZmU0N2EnXG4gICAgfTtcbiAgICAkbWRUaGVtaW5nUHJvdmlkZXJcbiAgICAgICAgLmRlZmluZVBhbGV0dGUoJ0dhbXJCYWNrZ3JvdW5kJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1c3RvbUJhY2tncm91bmQpO1xuXG4gICAkbWRUaGVtaW5nUHJvdmlkZXIudGhlbWUoJ2RlZmF1bHQnKVxuICAgICAgIC5wcmltYXJ5UGFsZXR0ZSgnR2FtclByaW1hcnknLCB7XG4gICAgICAgICdkZWZhdWx0JzogJzUwMCcsXG4gICAgICAgICdodWUtMic6ICc2MDAnXG4gICAgICAgfSlcbiAgICAgICAuYWNjZW50UGFsZXR0ZSgnR2FtckFjY2VudCcpXG4gICAgICAgLndhcm5QYWxldHRlKCdHYW1yV2FybicpXG4gICAgICAgLmJhY2tncm91bmRQYWxldHRlKCdHYW1yQmFja2dyb3VuZCcpXG59KTtcblxuLy8gVGhpcyBhcHAucnVuIGlzIGZvciBjb250cm9sbGluZyBhY2Nlc3MgdG8gc3BlY2lmaWMgc3RhdGVzLlxuYXBwLnJ1bihmdW5jdGlvbiAoJHJvb3RTY29wZSwgQXV0aFNlcnZpY2UsICRzdGF0ZSkge1xuICAgIC8vIFRoZSBnaXZlbiBzdGF0ZSByZXF1aXJlcyBhbiBhdXRoZW50aWNhdGVkIHVzZXIuXG4gICAgdmFyIGRlc3RpbmF0aW9uU3RhdGVSZXF1aXJlc0F1dGggPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlLmRhdGEgJiYgc3RhdGUuZGF0YS5hdXRoZW50aWNhdGU7XG4gICAgfTtcblxuICAgIC8vICRzdGF0ZUNoYW5nZVN0YXJ0IGlzIGFuIGV2ZW50IGZpcmVkXG4gICAgLy8gd2hlbmV2ZXIgdGhlIHByb2Nlc3Mgb2YgY2hhbmdpbmcgYSBzdGF0ZSBiZWdpbnMuXG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcykge1xuICAgICAgICBpZih0b1N0YXRlLm5hbWU9PT1cImhvbWVcIil7XG4gICAgICAgICAgICBBdXRoU2VydmljZS5nZXRMb2dnZWRJblVzZXIoKVxuICAgICAgICAgICAgICAgIC50aGVuKHVzZXI9PntcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVc2VyIGZyb20gQVM6IFwiLCB1c2VyKTtcbiAgICAgICAgICAgICAgICAgICAgaWYodXNlcikgJHN0YXRlLmdvKCd1LmRhc2gnLCB7dXNlcklkOiB1c2VyLmlkfSk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZGVzdGluYXRpb25TdGF0ZVJlcXVpcmVzQXV0aCh0b1N0YXRlKSkge1xuICAgICAgICAgICAgLy8gVGhlIGRlc3RpbmF0aW9uIHN0YXRlIGRvZXMgbm90IHJlcXVpcmUgYXV0aGVudGljYXRpb25cbiAgICAgICAgICAgIC8vIFNob3J0IGNpcmN1aXQgd2l0aCByZXR1cm4uXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpIHtcbiAgICAgICAgICAgIC8vIFRoZSB1c2VyIGlzIGF1dGhlbnRpY2F0ZWQuXG4gICAgICAgICAgICAvLyBTaG9ydCBjaXJjdWl0IHdpdGggcmV0dXJuLlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIENhbmNlbCBuYXZpZ2F0aW5nIHRvIG5ldyBzdGF0ZS5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBBdXRoU2VydmljZS5nZXRMb2dnZWRJblVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgICAgICAvLyBJZiBhIHVzZXIgaXMgcmV0cmlldmVkLCB0aGVuIHJlbmF2aWdhdGUgdG8gdGhlIGRlc3RpbmF0aW9uXG4gICAgICAgICAgICAvLyAodGhlIHNlY29uZCB0aW1lLCBBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSB3aWxsIHdvcmspXG4gICAgICAgICAgICAvLyBvdGhlcndpc2UsIGlmIG5vIHVzZXIgaXMgbG9nZ2VkIGluLCBnbyB0byBcImxvZ2luXCIgc3RhdGUuXG4gICAgICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyh0b1N0YXRlLm5hbWUsIHRvUGFyYW1zKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG59KTtcbiIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuICAkc3RhdGVQcm92aWRlci5zdGF0ZSgndS5hY2NvdW50Jywge1xuICAgIHVybDogJy9hY2NvdW50U2V0dGluZ3MvOmlkJyxcbiAgICB0ZW1wbGF0ZVVybDogJ2pzL2FjY291bnQtc2V0dGluZ3MvYWNjb3VudC1zZXR0aW5ncy5odG1sJyxcbiAgICBjb250cm9sbGVyOiAnQWNjb3VudFNldHRpbmdzQ3RybCcsIFxuICAgIHJlc29sdmU6IHsgYWxsVXNlcm5hbWVzOiBmdW5jdGlvbihVc2VyRmFjdG9yeSl7XG4gICAgICByZXR1cm4gVXNlckZhY3RvcnkuZ2V0QWxsVXNlcm5hbWVzKCkudGhlbih1c2VybmFtZXM9PnVzZXJuYW1lcylcbiAgICB9XG4gICAgfVxuICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQWNjb3VudFNldHRpbmdzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJG1kRGlhbG9nLCBVc2VyRmFjdG9yeSwgYWxsVXNlcm5hbWVzKXtcblxuXG4kc2NvcGUuYWxsVXNlcm5hbWVzID0gYWxsVXNlcm5hbWVzO1xuXG4gICRzY29wZS52YWxpZGF0ZUVtYWlsID0gZnVuY3Rpb24gKGVtYWlsKSBcbntcbiAgICB2YXIgcmUgPSAvXFxTK0BcXFMrXFwuXFxTKy87XG4gICAgY29uc29sZS5sb2cocmUudGVzdChlbWFpbCkpO1xuICAgIHJldHVybiByZS50ZXN0KGVtYWlsKTtcbn07XG5cbiRzY29wZS5zaG93Q29uZmlybUVtYWlsID0gZnVuY3Rpb24oZXYpIHtcbiAgICAvLyBBcHBlbmRpbmcgZGlhbG9nIHRvIGRvY3VtZW50LmJvZHkgdG8gY292ZXIgc2lkZW5hdiBpbiBkb2NzIGFwcFxuICAgIHZhciBjb25maXJtID0gJG1kRGlhbG9nLmNvbmZpcm0oKVxuICAgICAgICAgIC50aXRsZSgnJylcbiAgICAgICAgICAudGV4dENvbnRlbnQoJ1lvdXIgZW1haWwgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IHVwZGF0ZWQnKVxuICAgICAgICAgIC5hcmlhTGFiZWwoJ0x1Y2t5IGRheScpXG4gICAgICAgICAgLm9rKCdPSycpO1xuICAgICRtZERpYWxvZy5zaG93KGNvbmZpcm0pXG4gIH07XG5cbiRzY29wZS5zaG93Q29uZmlybVVzZXJuYW1lID0gZnVuY3Rpb24oZXYpIHtcbiAgICAvLyBBcHBlbmRpbmcgZGlhbG9nIHRvIGRvY3VtZW50LmJvZHkgdG8gY292ZXIgc2lkZW5hdiBpbiBkb2NzIGFwcFxuICAgIHZhciBjb25maXJtID0gJG1kRGlhbG9nLmNvbmZpcm0oKVxuICAgICAgICAgIC50aXRsZSgnJylcbiAgICAgICAgICAudGV4dENvbnRlbnQoJ1lvdXIgdXNlcm5hbWUgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IHVwZGF0ZWQnKVxuICAgICAgICAgIC5hcmlhTGFiZWwoJ0x1Y2t5IGRheScpXG4gICAgICAgICAgLm9rKCdPSycpO1xuICAgICRtZERpYWxvZy5zaG93KGNvbmZpcm0pXG4gIH07XG5cbiAgJHNjb3BlLnNob3dDb25maXJtUGFzc3dvcmQgPSBmdW5jdGlvbihldikge1xuICAgIC8vIEFwcGVuZGluZyBkaWFsb2cgdG8gZG9jdW1lbnQuYm9keSB0byBjb3ZlciBzaWRlbmF2IGluIGRvY3MgYXBwXG4gICAgdmFyIGNvbmZpcm0gPSAkbWREaWFsb2cuY29uZmlybSgpXG4gICAgICAgICAgLnRpdGxlKCcnKVxuICAgICAgICAgIC50ZXh0Q29udGVudCgnWW91ciBwYXNzd29yZCBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgdXBkYXRlZCcpXG4gICAgICAgICAgLmFyaWFMYWJlbCgnTHVja3kgZGF5JylcbiAgICAgICAgICAub2soJ09LJyk7XG4gICAgJG1kRGlhbG9nLnNob3coY29uZmlybSlcbiAgfTtcblxuICAkc2NvcGUuc2hvd1JlamVjdEVtYWlsID0gZnVuY3Rpb24oZXYpIHtcbiAgICAvLyBBcHBlbmRpbmcgZGlhbG9nIHRvIGRvY3VtZW50LmJvZHkgdG8gY292ZXIgc2lkZW5hdiBpbiBkb2NzIGFwcFxuICAgIHZhciBjb25maXJtID0gJG1kRGlhbG9nLmNvbmZpcm0oKVxuICAgICAgICAgIC50aXRsZSgnJylcbiAgICAgICAgICAudGV4dENvbnRlbnQoJ0ludmFsaWQgRW1haWwuIFBsZWFzZSB0cnkgYWdhaW4nKVxuICAgICAgICAgIC5hcmlhTGFiZWwoJ05haCcpXG4gICAgICAgICAgLm9rKCdPSycpO1xuICAgICRtZERpYWxvZy5zaG93KGNvbmZpcm0pXG4gIH07XG5cbiAgJHNjb3BlLnNob3dSZWplY3RQYXNzd29yZCA9IGZ1bmN0aW9uKGV2KSB7XG4gICAgLy8gQXBwZW5kaW5nIGRpYWxvZyB0byBkb2N1bWVudC5ib2R5IHRvIGNvdmVyIHNpZGVuYXYgaW4gZG9jcyBhcHBcbiAgICB2YXIgY29uZmlybSA9ICRtZERpYWxvZy5jb25maXJtKClcbiAgICAgICAgICAudGl0bGUoJycpXG4gICAgICAgICAgLnRleHRDb250ZW50KCdZb3VyIHBhc3N3b3JkcyBkbyBub3QgbWF0Y2guIFBsZWFzZSByZXR5cGUgeW91ciBuZXcgcGFzc3dvcmQnKVxuICAgICAgICAgIC5hcmlhTGFiZWwoJ05haCcpXG4gICAgICAgICAgLm9rKCdPSycpO1xuICAgICRtZERpYWxvZy5zaG93KGNvbmZpcm0pXG4gIH07XG5cbiAgJHNjb3BlLnNob3dSZWplY3RQYXNzd29yZCA9IGZ1bmN0aW9uKGV2KSB7XG4gICAgLy8gQXBwZW5kaW5nIGRpYWxvZyB0byBkb2N1bWVudC5ib2R5IHRvIGNvdmVyIHNpZGVuYXYgaW4gZG9jcyBhcHBcbiAgICB2YXIgY29uZmlybSA9ICRtZERpYWxvZy5jb25maXJtKClcbiAgICAgICAgICAudGl0bGUoJycpXG4gICAgICAgICAgLnRleHRDb250ZW50KCdZb3VyIHVzZXJuYW1lIGlzIHRha2VuIG9yIGRvZXMgbm90IG1lZXQgb3VyIHJlcXVpcmVtZW50cy4gUGxlYXNlIHRyeSBhZ2FpbicpXG4gICAgICAgICAgLmFyaWFMYWJlbCgnTmFoJylcbiAgICAgICAgICAub2soJ09LJyk7XG4gICAgJG1kRGlhbG9nLnNob3coY29uZmlybSlcbiAgfTtcblxuICAkc2NvcGUudXBkYXRlUGFzc3dvcmQgPSBmdW5jdGlvbigpe1xuICAgIGlmICghJHNjb3BlLnBhc3N3b3Jkc01hdGNoKXtcbiAgICAgICRzY29wZS5zaG93UmVqZWN0UGFzc3dvcmQoKVxuICAgIH1cbiAgICBlbHNle1xuICAgICAgVXNlckZhY3RvcnkudXBkYXRlVXNlcigkc2NvcGUudXNlci5pZCwge3Bhc3N3b3JkOiAkc2NvcGUucGFzc3dvcmQucGFzc3dvcmQxfSkudGhlbihmdW5jdGlvbihuZXdVc2VyKXtcbiAgICAgICAgJHNjb3BlLnNob3dDb25maXJtUGFzc3dvcmQoKTtcbiAgICAgIH0pO1xuICAgIH1cbn1cblxuJHNjb3BlLnVwZGF0ZVVzZXJuYW1lID0gZnVuY3Rpb24oKXtcbiAgaWYoISRzY29wZS51c2VybmFtZVBhc3Nlcyl7XG4gICAgJHNjb3BlLnNob3dSZWplY3RQYXNzd29yZCgpXG4gIH1cbiAgZWxzZSB7XG4gICAgVXNlckZhY3RvcnkudXBkYXRlVXNlcigkc2NvcGUudXNlci5pZCwge3VzZXJuYW1lOiAkc2NvcGUudXNlcm5hbWUudXNlcm5hbWV9KS50aGVuKGZ1bmN0aW9uKG5ld1VzZXIpe1xuICAgICAgICAkc2NvcGUuc2hvd0NvbmZpcm1Vc2VybmFtZSgpO1xuICAgICAgfSk7XG4gIH1cblxufVxuXG4gICRzY29wZS51cGRhdGVFbWFpbCA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHRlc3QgPSAkc2NvcGUudmFsaWRhdGVFbWFpbCgkc2NvcGUubmV3RW1haWwpO1xuICAgIGNvbnNvbGUubG9nKHRlc3QpO1xuICAgIGlmKCF0ZXN0KXtcbiAgICAgICRzY29wZS5zaG93UmVqZWN0RW1haWwoKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgICAgVXNlckZhY3RvcnkudXBkYXRlVXNlcigkc2NvcGUudXNlci5pZCwge2VtYWlsOiAkc2NvcGUubmV3RW1haWx9KVxuICAgICAgICAudGhlbihmdW5jdGlvbih1c2VyKXtcbiAgICAgICAgJHNjb3BlLnNob3dDb25maXJtRW1haWwoKTtcbiAgICAgICAgfSlcbiAgICB9XG4gIH1cblxuICAkc2NvcGUubmV3RW1haWwgPSAnJztcblxuICAkc2NvcGUuZGlzcGxheUVtYWlsQ2hhbmdlID0gZmFsc2U7XG4gICRzY29wZS5kaXNwbGF5UGFzc3dvcmRDaGFuZ2UgPSBmYWxzZTsgXG4gICRzY29wZS5kaXNwbGF5VXNlcm5hbWVDaGFuZ2UgPSBmYWxzZTtcblxuICAkc2NvcGUucGFzc3dvcmQgPSB7cGFzc3dvcmQxOiAnJywgcGFzc3dvcmQyOiAnJ307XG5cbiAgJHNjb3BlLnBhc3N3b3Jkc01hdGNoID0gZmFsc2U7XG4gICRzY29wZS51c2VybmFtZUF2YWlsYWJsZSA9IGZhbHNlO1xuICAkc2NvcGUudXNlcm5hbWVMZW5ndGggPSBmYWxzZTtcbiAgJHNjb3BlLnVzZXJuYW1lID0ge307XG5cbiAgJHNjb3BlLm1hdGNoaW5nID0gZnVuY3Rpb24oKXtcbiAgLy8gICB2YXIgcGFzc3dvcmQxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXNzd29yZEZpZWxkMVwiKS52YWx1ZTtcbiAgLy8gICB2YXIgcGFzc3dvcmQyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXNzd29yZEZpZWxkMlwiKS52YWx1ZVxuICAvLyAgIGNvbnNvbGUubG9nKCdwYXNzd29yZDEnLCBwYXNzd29yZDEsICdwYXNzd29yZDInLCBwYXNzd29yZDIpO1xuICAvLyAgIGlmIChwYXNzd29yZDEgPT09IHBhc3N3b3JkMiAmJiBwYXNzd29yZDEubGVuZ3RoPjYpe1xuICAvLyAgICAgICRzY29wZS5wYXNzd29yZHNNYXRjaCA9IHRydWU7XG4gIC8vICAgfVxuICAvLyAgIGVsc2V7XG4gIC8vICAgICAkc2NvcGUucGFzc3dvcmRzTWF0Y2ggPSBmYWxzZTtcbiAgLy8gICB9XG4gIC8vIH1cblxuICBcdGlmICgkc2NvcGUucGFzc3dvcmQucGFzc3dvcmQxID09PSAkc2NvcGUucGFzc3dvcmQucGFzc3dvcmQyICYmICRzY29wZS5wYXNzd29yZC5wYXNzd29yZDEubGVuZ3RoPjYpe1xuICBcdFx0ICRzY29wZS5wYXNzd29yZHNNYXRjaCA9IHRydWU7XG4gIFx0fVxuICAgIGVsc2V7XG4gICAgICAkc2NvcGUucGFzc3dvcmRzTWF0Y2ggPSBmYWxzZTtcbiAgICB9XG4gIH1cbiRzY29wZS51c2VybmFtZVRlc3QgPSBmdW5jdGlvbigpe1xuICBjb25zb2xlLmxvZyhcIlVzZXJuYW1lIFRlc3QgaGFzIGJlZW4gcnVuXCIsICRzY29wZS5hbGxVc2VybmFtZXMpO1xuICBpZigkc2NvcGUuYWxsVXNlcm5hbWVzLmluZGV4T2YoJHNjb3BlLnVzZXJuYW1lLnVzZXJuYW1lKSAhPT0gLTEpe1xuICAgICRzY29wZS51c2VybmFtZUF2YWlsYWJsZSA9IGZhbHNlXG4gIH1cbiAgZWxzZSBpZiAoJHNjb3BlLnVzZXJuYW1lLnVzZXJuYW1lLmxlbmd0aCA8IDcpe1xuICAgICRzY29wZS51c2VybmFtZUF2YWlsYWJsZSA9IHRydWU7XG4gICAgJHNjb3BlLnVzZXJuYW1lTGVuZ3RoID0gZmFsc2U7XG4gIH1cbiAgZWxzZXtcbiAgICAkc2NvcGUudXNlcm5hbWVBdmFpbGFibGUgPSB0cnVlO1xuICAgICRzY29wZS51c2VybmFtZUxlbmd0aCA9IHRydWU7XG4gIH1cbn1cbiAgJHNjb3BlLm9wZW5QYXNzd29yZENoYW5nZSA9IGZ1bmN0aW9uKCl7XG4gIFx0JHNjb3BlLmRpc3BsYXlQYXNzd29yZENoYW5nZSA9ICEkc2NvcGUuZGlzcGxheVBhc3N3b3JkQ2hhbmdlO1xuICB9XG4gICRzY29wZS5vcGVuRW1haWxDaGFuZ2UgPSBmdW5jdGlvbigpe1xuICAgICRzY29wZS5kaXNwbGF5RW1haWxDaGFuZ2UgPSAhJHNjb3BlLmRpc3BsYXlFbWFpbENoYW5nZTtcbiAgfVxuICAkc2NvcGUub3BlblVzZXJuYW1lQ2hhbmdlID0gZnVuY3Rpb24oKXtcbiAgICAkc2NvcGUuZGlzcGxheVVzZXJuYW1lQ2hhbmdlID0gISRzY29wZS5kaXNwbGF5VXNlcm5hbWVDaGFuZ2U7XG4gIH1cblxuICAkKCBcIiNwYXNzd29yZEZpZWxkMVwiICkub24oJ2tleXVwJywgZnVuY3Rpb24oKSB7XG4gICRzY29wZS5tYXRjaGluZygpO1xuICB9KTtcbiAgJCggXCIjcGFzc3dvcmRGaWVsZDJcIiApLm9uKCdrZXl1cCcsIGZ1bmN0aW9uKCkge1xuICAkc2NvcGUubWF0Y2hpbmcoKTtcbiAgfSk7XG4gICQoIFwiI1VzZXJuYW1lRmllbGRcIiApLm9uKCdrZXl1cCcsIGZ1bmN0aW9uKCkge1xuICAkc2NvcGUudXNlcm5hbWVUZXN0KCk7XG4gIH0pO1xuXG5cbn0pO1xuIiwiYXBwLmNvbnRyb2xsZXIoJ0FkZEZyaWVuZHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRtZERpYWxvZyl7XG5cbiAgICBjb25zb2xlLmxvZygnJHNjb3BlLmZyaWVuZHMnLCAkc2NvcGUuZnJpZW5kcyk7XG5cbiAgICAkc2NvcGUuYWRkRnJpZW5kID0gZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgICAgbGV0IG5ld0ZyaWVuZE51bSA9ICRzY29wZS5mcmllbmRzLmxlbmd0aCArIDE7XG4gICAgICAgICRzY29wZS5mcmllbmRzLnB1c2goe1xuICAgICAgICAgICAgaWQ6J2ZyaWVuZCcgKyBuZXdGcmllbmROdW0sXG4gICAgICAgICAgICBlbWFpbDogZW1haWxcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5yZW1vdmVGcmllbmQgPSBmdW5jdGlvbihmcmllbmRJZCkge1xuICAgICAgICBpZihmcmllbmRJZCA9PT0gJ2ZyaWVuZDEnKSByZXR1cm47XG4gICAgICAgICRzY29wZS5mcmllbmRzID0gJHNjb3BlLmZyaWVuZHMuZmlsdGVyKGU9PmUuaWQgIT09IGZyaWVuZElkKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmhhbmRsZVN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8kc3RhdGUuZ28oJ3UuY3JlYXRlJywge3BsYXllcnM6ICRzY29wZS5mcmllbmRzfSk7XG4gICAgICAgIHJldHVybiAkbWREaWFsb2cuaGlkZSgpO1xuICAgIH1cblxuICAgICRzY29wZS5oYW5kbGVDYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vJHN0YXRlLmdvKCd1LmNyZWF0ZScpO1xuICAgICAgICByZXR1cm4gJG1kRGlhbG9nLmhpZGUoKTtcbiAgICB9O1xuXG59KVxuIiwiLy8gYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbi8vICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgndS5jcmVhdGUuZnJpZW5kcycsIHtcbi8vICAgICAgICAgdXJsOiAnL2ZyaWVuZHMnLFxuLy8gICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2FkZC1mcmllbmRzL2FkZC1mcmllbmRzLmh0bWwnLFxuLy8gICAgICAgICBjb250cm9sbGVyOiAnQWRkRnJpZW5kc0N0cmwnLFxuLy8gICAgICAgICBwYXJhbXM6IHtcbi8vICAgICAgICAgICAgIGZyaWVuZHM6IG51bGxcbi8vICAgICAgICAgfVxuLy8gICAgIH0pO1xuLy8gfSk7XG4iLCJhcHAuY29udHJvbGxlcignQ29tcGxldGVkQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgY29tcGxldGVkR2FtZXMpIHtcbiAgJHNjb3BlLmNvbXBsZXRlZEdhbWVzID0gY29tcGxldGVkR2FtZXM7XG59KVxuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgndS5jb21wbGV0ZWQnLCB7XG4gICAgICAgIHVybDogJy9jb21wbGV0ZWQnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbXBsZXRlZC9jb21wbGV0ZWQuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdDb21wbGV0ZWRDdHJsJyxcbiAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICB1c2VyOiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIGNvbXBsZXRlZEdhbWVzOiBmdW5jdGlvbigkc3RhdGVQYXJhbXMsIEdhbWVGYWN0b3J5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEdhbWVGYWN0b3J5LmdldENvbXBsZXRlZEdhbWVzKCRzdGF0ZVBhcmFtcy51c2VyLmlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG4iLCJhcHAuY29udHJvbGxlcignQ3JlYXRlR2FtZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRtZERpYWxvZywgJHN0YXRlLCBVc2VyRmFjdG9yeSwgJGxvZywgR2FtZUZhY3Rvcnkpe1xuICAgICRzY29wZS5zZWxlY3RlZEl0ZW07XG4gICAgJHNjb3BlLnNlYXJjaFRleHQgPSBcIlwiO1xuXG4gICAgJHNjb3BlLmNvbW0gPSB7fTtcbiAgICAkc2NvcGUuY29tbS5jb21taXNzaW9uZXIgPSAkc2NvcGUudXNlci5pZDtcbiAgICAkc2NvcGUuY29tbS5wbGF5ZXJzID0ge1xuICAgICAgICB1bmNvbmZpcm1lZDogW3tcbiAgICAgICAgICAgIGlkOiAkc2NvcGUudXNlci5pZCxcbiAgICAgICAgICAgIGVtYWlsOiAkc2NvcGUudXNlci5lbWFpbH1dLFxuICAgICAgICBpbnZpdGVkOiBbXVxuXG4gICAgfTtcblxuICAgIC8vICRzY29wZS5mcmllbmRzID0gW3tcbiAgICAvLyAgICAgaWQ6ICdmcmllbmQxJyxcbiAgICAvLyAgICAgZW1haWw6ICRzY29wZS51c2VyLmVtYWlsXG4gICAgLy8gfV07XG5cbiAgICAkc2NvcGUuY29tbS50YXNrcyA9IFt7XG4gICAgICAgIGVsZW1JZDogJ3Rhc2swJyxcbiAgICAgICAgbmFtZTogJycsXG4gICAgICAgIGRlY3JpcHRpb246ICcnLFxuICAgICAgICBwb2ludHM6ICcnXG4gICAgfV07XG5cbiAgICAkc2NvcGUuYWRkVGFzayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgbmV3VGFza051bSA9ICRzY29wZS5jb21tLnRhc2tzLmxlbmd0aDtcbiAgICAgICAgJHNjb3BlLmNvbW0udGFza3MucHVzaCh7XG4gICAgICAgICAgICBlbGVtSWQ6J3Rhc2snK25ld1Rhc2tOdW0sXG4gICAgICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgICAgIGRlY3JpcHRpb246ICcnLFxuICAgICAgICAgICAgcG9pbnRzOiAnJ1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnJlbW92ZVRhc2sgPSBmdW5jdGlvbihlbGVtSWQpIHtcbiAgICAgICAgJHNjb3BlLmNvbW0udGFza3MgPSAkc2NvcGUuY29tbS50YXNrcy5maWx0ZXIoZT0+ZS5lbGVtSWQgIT09IGVsZW1JZCk7XG4gICAgfTtcblxuICAgIC8vICRzY29wZS5hZGRGcmllbmRzID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gICAgIC8vICRzdGF0ZS5nbygndS5jcmVhdGUuZnJpZW5kcycsIHtcbiAgICAvLyAgICAgLy8gICAgIGZyaWVuZHM6ICRzY29wZS5wbGF5ZXJzXG4gICAgLy8gICAgIC8vIH0pO1xuICAgIC8vICAgICAkbWREaWFsb2cuc2hvdyh7XG4gICAgLy8gICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2FkZC1mcmllbmRzL2FkZC1mcmllbmRzLmh0bWwnLFxuICAgIC8vICAgICAgICAgY29udHJvbGxlcjogJ0FkZEZyaWVuZHNDdHJsJyxcbiAgICAvLyAgICAgICAgIHNjb3BlOiAkc2NvcGVcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gfVxuICAgICRzY29wZS5nZXRNYXRjaGVzID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICBjb25zb2xlLmxvZyh0ZXh0KTtcbiAgICAgICAgVXNlckZhY3RvcnkuYXV0b2NvbXBsZXRlKHRleHQpXG4gICAgICAgIC50aGVuKHVzZXJzPT57XG4gICAgICAgICAgICAkc2NvcGUuZm91bmRNYXRjaGVzID0gdXNlcnM7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh1c2Vycyk7XG4gICAgICAgIH1cbiAgICAgICAgICAgIClcbiAgICAgICAgLmNhdGNoKGVycj0+JGxvZy5lcnJvcilcblxuICAgIH1cbiAgICAkc2NvcGUuYWRkUGxheWVyPSBmdW5jdGlvbihzZWxlY3RlZEl0ZW0pe1xuICAgICAgICBpZihzZWxlY3RlZEl0ZW0pe1xuICAgICAgICAkc2NvcGUuY29tbS5wbGF5ZXJzLmludml0ZWQucHVzaChzZWxlY3RlZEl0ZW0pO1xuICAgICAgICAkc2NvcGUuZm91bmRNYXRjaGVzID0gW107XG4gICAgfVxuICAgIH1cblxuICAgICRzY29wZS5jcmVhdGUgPSBmdW5jdGlvbigpe1xuICAgICAgICAkc2NvcGUuY29tbS50YXNrcyA9ICRzY29wZS5jb21tLnRhc2tzLm1hcCh0YXNrID0+IHtcbiAgICAgICAgICAgIGRlbGV0ZSB0YXNrLmVsZW1JZDtcbiAgICAgICAgICAgIHJldHVybiB0YXNrXG4gICAgICAgIH0pO1xuICAgICAgICBHYW1lRmFjdG9yeS5jcmVhdGVHYW1lKCRzY29wZS5jb21tKVxuICAgICAgICAudGhlbihnYW1lSWQ9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhnYW1lSWQpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCd1LmVkaXQnLCB7Z2FtZUlkOmdhbWVJZC5pZH0pXG4gICAgICAgIH0pXG4gICAgfVxuXG59KVxuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgndS5jcmVhdGUnLCB7XG4gICAgICAgIHVybDogJy9jcmVhdGUnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NyZWF0ZS1nYW1lL2NyZWF0ZS1nYW1lLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnQ3JlYXRlR2FtZUN0cmwnXG4gICAgfSk7XG59KTtcbiIsImFwcC5jb250cm9sbGVyKCdEYXNoQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgZ2FtZURhdGEsIEdhbWVGYWN0b3J5LCAkbG9nKXtcbmNvbnNvbGUubG9nKFwiR290IHRvIERhc2ggQ3RybDogXCIsIGdhbWVEYXRhKTtcblxuXG4kc2NvcGUuZ2FtZURhdGEgPSBnYW1lRGF0YTtcblxuJHNjb3BlLmFjY2VwdEludml0ZSA9IGZ1bmN0aW9uKGdhbWUpe1xuICBjb25zb2xlLmxvZyhcIkFjY2VwdCBJbnZpdGU6IFwiLCBnYW1lKTtcbiAgR2FtZUZhY3RvcnkuYWNjZXB0SW52aXRlKCRzY29wZS51c2VyLmlkLCBnYW1lKVxuICAuY2F0Y2goJGxvZyk7XG59XG5cbiRzY29wZS5hcmVDb25maXJtZWQgPSBmdW5jdGlvbigpe1xuICByZXR1cm4gJHNjb3BlLmdhbWVzLnNvbWUoZz0+Zy5zdGF0dXM9PVwiQ29uZmlybWVkXCIpO1xufVxuXG4kc2NvcGUuYXJlUGVuZGluZyA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiAkc2NvcGUuZ2FtZXMuc29tZShnPT5nLnN0YXR1cz09XCJQZW5kaW5nXCIpO1xufVxuXG4kc2NvcGUuaXNVbmNvbmZpcm1lZCA9IGZ1bmN0aW9uKGdhbWUpe1xuICBjb25zb2xlLmxvZyhcImlzVW5jb25maXJtZWQ6IFwiLCBnYW1lKVxuICByZXR1cm4gZ2FtZS5wbGF5ZXJTdGF0dXM9PVwiVW5jb25maXJtZWRcIlxufVxuXG4kc2NvcGUuaXNJbnZpdGVkID0gZnVuY3Rpb24oZ2FtZSl7XG4gIGNvbnNvbGUubG9nKFwiaXNJbnZpdGVkOiBcIiwgZ2FtZSlcbiAgcmV0dXJuIGdhbWUucGxheWVyU3RhdHVzPT1cIkludml0ZWRcIjtcbn1cblxuXG4kc2NvcGUucGllQ2hhcnRPcHRpb25zID0ge1xuICAgIGNoYXJ0OiB7XG4gICAgICAgIHR5cGU6ICdwaWVDaGFydCcsXG4gICAgICAgIGhlaWdodDogNTAwLFxuICAgICAgICB4OiBmdW5jdGlvbihkKXtyZXR1cm4gZC5rZXk7IH0sXG4gICAgICAgIHk6IGZ1bmN0aW9uKGQpe3JldHVybiBkLnk7IH0sXG4gICAgICAgIHNob3dMYWJlbHM6IGZhbHNlLFxuICAgICAgICBkdXJhdGlvbjogNTAwLFxuICAgICAgICBsYWJlbFRocmVzaG9sZDogMC4wMSxcbiAgICAgICAgbGFiZWxTdW5iZWFtTGF5b3V0OiB0cnVlLFxuICAgICAgICBsZWdlbmQ6IHtcbiAgICAgICAgICAgIG1hcmdpbjoge1xuICAgICAgICAgICAgICAgIHRvcDogNSxcbiAgICAgICAgICAgICAgICByaWdodDogNSxcbiAgICAgICAgICAgICAgICBib3R0b206IDUsXG4gICAgICAgICAgICAgICAgbGVmdDogMFxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBsZWdlbmRQb3NpdGlvbjogJ2NlbnRlcidcbiAgICB9LFxuICAgIHRpdGxlOiB7XG4gICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgdGV4dDogXCJDdXJyZW50IFBvaW50IFNoYXJlXCIsXG4gICAgICAgIGNsYXNzTmFtZTogJ2g0JyxcbiAgICAgICAgY3NzOiB7XG4gICAgICAgICAgJ2ZvbnQtc2l6ZSc6ICcyNHB4J1xuICAgICAgICB9XG4gICAgfVxufTtcblxuJHNjb3BlLmJhckNoYXJ0T3B0aW9ucz0ge1xuICAgIGNoYXJ0OiB7XG4gICAgICAgIHR5cGU6ICdkaXNjcmV0ZUJhckNoYXJ0JyxcbiAgICAgICAgaGVpZ2h0OiA0NTAsXG4gICAgICAgIG1hcmdpbiA6IHtcbiAgICAgICAgICAgIHRvcDogMjAsXG4gICAgICAgICAgICByaWdodDogMjAsXG4gICAgICAgICAgICBib3R0b206IDUwLFxuICAgICAgICAgICAgbGVmdDogNTVcbiAgICAgICAgfSxcbiAgICAgICAgeDogZnVuY3Rpb24oZCl7cmV0dXJuIGQubGFiZWw7IH0sXG4gICAgICAgIHk6IGZ1bmN0aW9uKGQpe3JldHVybiBkLnZhbHVlOyB9LFxuICAgICAgICBzaG93VmFsdWVzOiB0cnVlLFxuICAgICAgICB2YWx1ZUZvcm1hdDogZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICByZXR1cm4gZDMuZm9ybWF0KCckLC4yZicpKGQpO1xuICAgICAgICB9LFxuICAgICAgICBkdXJhdGlvbjogNTAwLFxuICAgICAgICB4QXhpczoge1xuICAgICAgICAgICAgYXhpc0xhYmVsOiAnWCBBeGlzJ1xuICAgICAgICB9LFxuICAgICAgICB5QXhpczoge1xuICAgICAgICAgICAgYXhpc0xhYmVsOiAnJyxcbiAgICAgICAgICAgIGF4aXNMYWJlbERpc3RhbmNlOiAtMTAsXG4gICAgICAgICAgICB0aWNrRm9ybWF0OiBmdW5jdGlvbihkKXtyZXR1cm4gZDMuZm9ybWF0KFwiJCwuMmZcIikoZCk7IH0sXG4gICAgICAgIH0sXG4gICAgICAgIHNob3dYQXhpczogZmFsc2UsXG4gICAgfSxcbiAgICB0aXRsZToge1xuICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgIHRleHQ6IFwiQ3VycmVudCBOZXQgUGF5b3V0c1wiLFxuICAgICAgICBjbGFzc05hbWU6ICdoNCcsXG4gICAgICAgIGNzczoge1xuICAgICAgICAgICdmb250LXNpemUnOiAnMjRweCdcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbn0pO1xuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgndS5kYXNoJywge1xuICAgICAgICB1cmw6ICcvZGFzaCcsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvZGFzaC9kYXNoLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnRGFzaEN0cmwnLFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgZ2FtZURhdGE6IGZ1bmN0aW9uKEdhbWVGYWN0b3J5LCAkc3RhdGVQYXJhbXMpe1xuICAgICAgICAgICAgcmV0dXJuIEdhbWVGYWN0b3J5LmdldEFjdGl2ZUdhbWVzKCRzdGF0ZVBhcmFtcy51c2VySWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB9KVxufSk7XG4iLCJhcHAuY29udHJvbGxlcignRWRpdEdhbWVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbWREaWFsb2csICRzdGF0ZSwgVXNlckZhY3RvcnksICRsb2csIEdhbWVGYWN0b3J5LCBDb21tKXtcbiAgICAkc2NvcGUuc2VsZWN0ZWRJdGVtO1xuICAgICRzY29wZS5zZWFyY2hUZXh0ID0gJyc7XG5cbiAgICAkc2NvcGUuY29tbSA9IENvbW07XG5cbiAgICBjb25zb2xlLmxvZygkc2NvcGUuY29tbSk7XG5cbiAgICAkc2NvcGUuYWRkVGFzayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgbmV3VGFza051bSA9ICRzY29wZS5jb21tLnRhc2tzLmxlbmd0aDtcbiAgICAgICAgJHNjb3BlLmNvbW0udGFza3MucHVzaCh7XG4gICAgICAgICAgICBlbGVtSWQ6J3Rhc2snK25ld1Rhc2tOdW0sXG4gICAgICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgICAgIHBvaW50czogJydcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5yZW1vdmVUYXNrID0gZnVuY3Rpb24oZWxlbUlkKSB7XG4gICAgICAgICRzY29wZS5jb21tLnRhc2tzID0gJHNjb3BlLmNvbW0udGFza3MuZmlsdGVyKGU9PmUuZWxlbUlkICE9PSBlbGVtSWQpO1xuICAgIH07XG5cbiAgICAkc2NvcGUuZ2V0TWF0Y2hlcyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgY29uc29sZS5sb2codGV4dCk7XG4gICAgICAgIFVzZXJGYWN0b3J5LmF1dG9jb21wbGV0ZSh0ZXh0KVxuICAgICAgICAudGhlbih1c2Vycz0+e1xuICAgICAgICAgICAgJHNjb3BlLmZvdW5kTWF0Y2hlcyA9IHVzZXJzO1xuICAgICAgICAgICAgY29uc29sZS5sb2codXNlcnMpO1xuICAgICAgICB9XG4gICAgICAgICAgICApXG4gICAgICAgIC5jYXRjaChlcnI9PiRsb2cuZXJyb3IpXG5cbiAgICB9XG4gICAgJHNjb3BlLmFkZFBsYXllcj0gZnVuY3Rpb24oc2VsZWN0ZWRJdGVtKXtcbiAgICAgICAgaWYoc2VsZWN0ZWRJdGVtKXtcbiAgICAgICAgICAgICRzY29wZS5jb21tLnVzZXJzLmludml0ZWQucHVzaChzZWxlY3RlZEl0ZW0pO1xuICAgICAgICAgICAgJHNjb3BlLmZvdW5kTWF0Y2hlcyA9IFtdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJHNjb3BlLnVwZGF0ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vIHdlIG5lZWQgdG8gbWFrZSBzdXJlIHdlIGFyZSBub3Qgc2VuZGluZyBiYWNrIGdhbWUgc3RhdHVzIGVpdGhlclxuICAgICAgICAvL3BlcmhhcCBoaXQgdGhlIGFwaSByb3V0ZSB3aXRoIGEgZ2FtZSBpZFxuICAgICAgICAkc2NvcGUuY29tbS50YXNrcyA9ICRzY29wZS5jb21tLnRhc2tzLm1hcCh0YXNrID0+IHtcbiAgICAgICAgICAgIGRlbGV0ZSB0YXNrLmVsZW1JZDtcbiAgICAgICAgICAgIHJldHVybiB0YXNrXG4gICAgICAgIH0pO1xuICAgICAgICBkZWxldGUgJHNjb3BlLmNvbW0uc3RhdHVzO1xuICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuY29tbSlcbiAgICAgICAgR2FtZUZhY3RvcnkudXBkYXRlR2FtZSgkc2NvcGUuY29tbSlcbiAgICAgICAgLnRoZW4oZ2FtZUlkPT4kc3RhdGUuZ28oJ3UuZWRpdCcsICRzY29wZS5jb21tLmlkKSlcbiAgICB9XG5cbiAgICAkc2NvcGUubG9jayA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICRzY29wZS5jb21tLnRhc2tzID0gJHNjb3BlLmNvbW0udGFza3MubWFwKHRhc2sgPT4ge1xuICAgICAgICAgICAgZGVsZXRlIHRhc2suZWxlbUlkO1xuICAgICAgICAgICAgcmV0dXJuIHRhc2tcbiAgICAgICAgfSk7XG4gICAgICAgICRzY29wZS5jb21tLmxvY2tlZCA9IHRydWU7XG4gICAgICAgIEdhbWVGYWN0b3J5LnVwZGF0ZUdhbWUoJHNjb3BlLmNvbW0pXG4gICAgICAgIC8vIC50YXAoZ2FtZSA9PiB7XG4gICAgICAgIC8vICAgICBHYW1lRmFjdG9yeS5jb25maXJtR2FtZSh7XG4gICAgICAgIC8vICAgICAgICAgc3RhcnREYXRlOiBnYW1lLnN0YXJ0LFxuICAgICAgICAvLyAgICAgICAgIGVuZERhdGU6IGdhbWUuZW5kXG4gICAgICAgIC8vICAgICB9KVxuICAgICAgICAvLyB9KVxuICAgICAgICAudGhlbihnYW1lSWQ9PiRzdGF0ZS5nbygndS5nYW1lJywge2dhbWVJZDogJHNjb3BlLmNvbW0uaWR9KSlcbiAgICB9XG5cbn0pXG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd1LmVkaXQnLCB7XG4gICAgICAgIHVybDogJy9lZGl0LzpnYW1lSWQnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2VkaXQtZ2FtZS9lZGl0LWdhbWUuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0R2FtZUN0cmwnLFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICBDb21tOiBmdW5jdGlvbihHYW1lRmFjdG9yeSwgJHN0YXRlUGFyYW1zKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc3RhdGVQYXJhbXMuZ2FtZUlkKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gR2FtZUZhY3RvcnkuZ2V0R2FtZSgkc3RhdGVQYXJhbXMuZ2FtZUlkKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGdhbWVPYmope1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW52aXRlZCA9IGdhbWVPYmoudXNlcnMuZmlsdGVyKHVzZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVzZXIuR2FtZVBsYXllcnMuc3RhdHVzID09PSAnSW52aXRlZCc7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdW5jb25maXJtZWQgPSBnYW1lT2JqLnVzZXJzLmZpbHRlcih1c2VyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1c2VyLkdhbWVQbGF5ZXJzLnN0YXR1cyA9PT0gJ1VuY29uZmlybWVkJztcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGdhbWVPYmoudXNlcnMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZpdGVkOiBpbnZpdGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5jb25maXJtZWQ6IHVuY29uZmlybWVkXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGdhbWVPYmoudGFza3MgPSBnYW1lT2JqLnRhc2tzLm1hcCgodGFzaywgaW5kZXgpID0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFzay5lbGVtSWQgPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0YXNrO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdhbWVPYmo7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gSG9wZSB5b3UgZGlkbid0IGZvcmdldCBBbmd1bGFyISBEdWgtZG95LlxuICAgIGlmICghd2luZG93LmFuZ3VsYXIpIHRocm93IG5ldyBFcnJvcignSSBjYW5cXCd0IGZpbmQgQW5ndWxhciEnKTtcblxuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnZnNhUHJlQnVpbHQnLCBbXSk7XG5cbiAgICBhcHAuZmFjdG9yeSgnU29ja2V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXdpbmRvdy5pbykgdGhyb3cgbmV3IEVycm9yKCdzb2NrZXQuaW8gbm90IGZvdW5kIScpO1xuICAgICAgICByZXR1cm4gd2luZG93LmlvKHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pO1xuICAgIH0pO1xuXG4gICAgLy8gQVVUSF9FVkVOVFMgaXMgdXNlZCB0aHJvdWdob3V0IG91ciBhcHAgdG9cbiAgICAvLyBicm9hZGNhc3QgYW5kIGxpc3RlbiBmcm9tIGFuZCB0byB0aGUgJHJvb3RTY29wZVxuICAgIC8vIGZvciBpbXBvcnRhbnQgZXZlbnRzIGFib3V0IGF1dGhlbnRpY2F0aW9uIGZsb3cuXG4gICAgYXBwLmNvbnN0YW50KCdBVVRIX0VWRU5UUycsIHtcbiAgICAgICAgbG9naW5TdWNjZXNzOiAnYXV0aC1sb2dpbi1zdWNjZXNzJyxcbiAgICAgICAgbG9naW5GYWlsZWQ6ICdhdXRoLWxvZ2luLWZhaWxlZCcsXG4gICAgICAgIGxvZ291dFN1Y2Nlc3M6ICdhdXRoLWxvZ291dC1zdWNjZXNzJyxcbiAgICAgICAgc2Vzc2lvblRpbWVvdXQ6ICdhdXRoLXNlc3Npb24tdGltZW91dCcsXG4gICAgICAgIG5vdEF1dGhlbnRpY2F0ZWQ6ICdhdXRoLW5vdC1hdXRoZW50aWNhdGVkJyxcbiAgICAgICAgbm90QXV0aG9yaXplZDogJ2F1dGgtbm90LWF1dGhvcml6ZWQnXG4gICAgfSk7XG5cbiAgICBhcHAuZmFjdG9yeSgnQXV0aEludGVyY2VwdG9yJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRxLCBBVVRIX0VWRU5UUykge1xuICAgICAgICB2YXIgc3RhdHVzRGljdCA9IHtcbiAgICAgICAgICAgIDQwMTogQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCxcbiAgICAgICAgICAgIDQwMzogQVVUSF9FVkVOVFMubm90QXV0aG9yaXplZCxcbiAgICAgICAgICAgIDQxOTogQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXQsXG4gICAgICAgICAgICA0NDA6IEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3Qoc3RhdHVzRGljdFtyZXNwb25zZS5zdGF0dXNdLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZXNwb25zZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIGFwcC5jb25maWcoZnVuY3Rpb24gKCRodHRwUHJvdmlkZXIpIHtcbiAgICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaChbXG4gICAgICAgICAgICAnJGluamVjdG9yJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uICgkaW5qZWN0b3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGluamVjdG9yLmdldCgnQXV0aEludGVyY2VwdG9yJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgYXBwLnNlcnZpY2UoJ0F1dGhTZXJ2aWNlJywgZnVuY3Rpb24gKCRodHRwLCBTZXNzaW9uLCAkcm9vdFNjb3BlLCBBVVRIX0VWRU5UUywgJHEpIHtcblxuICAgICAgICBmdW5jdGlvbiBvblN1Y2Nlc3NmdWxMb2dpbihyZXNwb25zZSkge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgU2Vzc2lvbi5jcmVhdGUoZGF0YS5pZCwgZGF0YS51c2VyKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChBVVRIX0VWRU5UUy5sb2dpblN1Y2Nlc3MpO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGEudXNlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVzZXMgdGhlIHNlc3Npb24gZmFjdG9yeSB0byBzZWUgaWYgYW5cbiAgICAgICAgLy8gYXV0aGVudGljYXRlZCB1c2VyIGlzIGN1cnJlbnRseSByZWdpc3RlcmVkLlxuICAgICAgICB0aGlzLmlzQXV0aGVudGljYXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAhIVNlc3Npb24udXNlcjtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmdldExvZ2dlZEluVXNlciA9IGZ1bmN0aW9uIChmcm9tU2VydmVyKSB7XG5cbiAgICAgICAgICAgIC8vIElmIGFuIGF1dGhlbnRpY2F0ZWQgc2Vzc2lvbiBleGlzdHMsIHdlXG4gICAgICAgICAgICAvLyByZXR1cm4gdGhlIHVzZXIgYXR0YWNoZWQgdG8gdGhhdCBzZXNzaW9uXG4gICAgICAgICAgICAvLyB3aXRoIGEgcHJvbWlzZS4gVGhpcyBlbnN1cmVzIHRoYXQgd2UgY2FuXG4gICAgICAgICAgICAvLyBhbHdheXMgaW50ZXJmYWNlIHdpdGggdGhpcyBtZXRob2QgYXN5bmNocm9ub3VzbHkuXG5cbiAgICAgICAgICAgIC8vIE9wdGlvbmFsbHksIGlmIHRydWUgaXMgZ2l2ZW4gYXMgdGhlIGZyb21TZXJ2ZXIgcGFyYW1ldGVyLFxuICAgICAgICAgICAgLy8gdGhlbiB0aGlzIGNhY2hlZCB2YWx1ZSB3aWxsIG5vdCBiZSB1c2VkLlxuXG4gICAgICAgICAgICBpZiAodGhpcy5pc0F1dGhlbnRpY2F0ZWQoKSAmJiBmcm9tU2VydmVyICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRxLndoZW4oU2Vzc2lvbi51c2VyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTWFrZSByZXF1ZXN0IEdFVCAvc2Vzc2lvbi5cbiAgICAgICAgICAgIC8vIElmIGl0IHJldHVybnMgYSB1c2VyLCBjYWxsIG9uU3VjY2Vzc2Z1bExvZ2luIHdpdGggdGhlIHJlc3BvbnNlLlxuICAgICAgICAgICAgLy8gSWYgaXQgcmV0dXJucyBhIDQwMSByZXNwb25zZSwgd2UgY2F0Y2ggaXQgYW5kIGluc3RlYWQgcmVzb2x2ZSB0byBudWxsLlxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL3Nlc3Npb24nKS50aGVuKG9uU3VjY2Vzc2Z1bExvZ2luKS5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubG9naW4gPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvbG9naW4nLCBjcmVkZW50aWFscylcbiAgICAgICAgICAgICAgICAudGhlbihvblN1Y2Nlc3NmdWxMb2dpbilcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHsgbWVzc2FnZTogJ0ludmFsaWQgbG9naW4gY3JlZGVudGlhbHMuJyB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9sb2dvdXQnKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBTZXNzaW9uLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoQVVUSF9FVkVOVFMubG9nb3V0U3VjY2Vzcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG4gICAgYXBwLnNlcnZpY2UoJ1Nlc3Npb24nLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgQVVUSF9FVkVOVFMpIHtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2VsZi5kZXN0cm95KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLmRlc3Ryb3koKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5pZCA9IG51bGw7XG4gICAgICAgIHRoaXMudXNlciA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAoc2Vzc2lvbklkLCB1c2VyKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gc2Vzc2lvbklkO1xuICAgICAgICAgICAgdGhpcy51c2VyID0gdXNlcjtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMudXNlciA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuYXBwLmZhY3RvcnkoJ0dhbWVGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHApIHtcbiAgdmFyIEdhbWVGYWN0b3J5ID0ge307XG5cbiAgR2FtZUZhY3RvcnkuZ2V0R2FtZSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgcmV0dXJuICRodHRwLmdldCgnYXBpL2dhbWVzLycgKyBpZClcbiAgICAudGhlbihnYW1lID0+IGdhbWUuZGF0YSk7XG4gIH07XG5cbiAgR2FtZUZhY3RvcnkuY3JlYXRlR2FtZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICByZXR1cm4gJGh0dHAucG9zdCgnYXBpL2dhbWVzLycsIGRhdGEpXG4gICAgLnRoZW4obmV3R2FtZSA9PiBuZXdHYW1lLmRhdGEpO1xuICB9XG5cbiAgR2FtZUZhY3RvcnkudXBkYXRlR2FtZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICByZXR1cm4gJGh0dHAucHV0KCdhcGkvZ2FtZXMvJywgZGF0YSlcbiAgICAudGhlbihuZXdHYW1lID0+IG5ld0dhbWUuZGF0YSk7XG4gIH1cblxuICBHYW1lRmFjdG9yeS5jb21wbGV0ZVRhc2sgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgcmV0dXJuICRodHRwLnBvc3QoJ2FwaS9ldmVudHMnLCBkYXRhKVxuICAgIC50aGVuKG5ld0V2ZW50ID0+IG5ld0V2ZW50LmRhdGEpO1xuICB9XG5cbiAgR2FtZUZhY3RvcnkuZ2V0VXNlcnNHYW1lcyA9IGZ1bmN0aW9uKGlkKXtcbiAgICByZXR1cm4gJGh0dHAuZ2V0KCdhcGkvZ2FtZXMvdXNlci8nK2lkKVxuICAgIC50aGVuKGdhbWVzPT5nYW1lcy5kYXRhKVxuICAgIC50aGVuKGdhbWVzPT57XG4gICAgICBnYW1lcy5mb3JFYWNoKGdhbWU9PmdhbWUudGltZVRpbCA9IG1vbWVudChnYW1lLnN0YXJ0KS5mcm9tTm93KCkpXG4gICAgICByZXR1cm4gZ2FtZXM7XG4gICAgfVxuICAgICAgKTtcbiAgfVxuXG4gIEdhbWVGYWN0b3J5LmFjY2VwdEludml0ZSA9IGZ1bmN0aW9uKHVzZXIsIGdhbWUpe1xuICAgIHJldHVybiAkaHR0cC5nZXQoJ2FwaS9lbWFpbC9hY2NlcHRJbnZpdGUnLCB7cGFyYW1zOnsndXNlcic6dXNlciwnZ2FtZSc6Z2FtZX19KVxuICAgIC50aGVuKGdhbWU9PmdhbWUuZGF0YSk7XG4gIH1cblxuICBHYW1lRmFjdG9yeS5nZXRBY3RpdmVHYW1lcyA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KCdhcGkvZ2FtZXMvdXNlci8nICsgaWQgKyAnL2FjdGl2ZScpXG4gICAgICAgICAgLnRoZW4oZ2FtZXMgPT4gZ2FtZXMuZGF0YSlcbiAgICAgICAgICAudGhlbihnYW1lcyA9PiB7XG4gICAgICAgICAgICAgIGdhbWVzLmZvckVhY2goZ2FtZSA9PiB7XG4gICAgICAgICAgICAgICAgICBsZXQgcGllRGF0YSA9IFtdO1xuICAgICAgICAgICAgICAgICAgZ2FtZS51c2Vycy5mb3JFYWNoKHVzZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIHVzZXIucG9pbnRzID0gZ2FtZS5ldmVudHMuZmlsdGVyKGV2ZW50ID0+IGV2ZW50LmNvbXBsZXRlZEJ5SWQgPT09IHVzZXIuaWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoZXZlbnQgPT4gZ2FtZS50YXNrcy5maW5kKHRhc2sgPT4gdGFzay5pZCA9PT0gZXZlbnQudGFza0lkKS5wb2ludHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IHByZXYgKyBjdXJyLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICBsZXQgcGllT2JqID0geyBrZXk6IHVzZXIudXNlcm5hbWUsIHk6IHVzZXIucG9pbnRzIH1cbiAgICAgICAgICAgICAgICAgICAgICBwaWVEYXRhLnB1c2gocGllT2JqKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICBnYW1lLnBpZUNoYXJ0RGF0YSA9IHBpZURhdGE7XG5cbiAgICAgICAgICAgICAgICAgIGxldCB0b3RhbCA9IHBpZURhdGEucmVkdWNlKChwcmV2LCBjdXJyKSA9PiBwcmV2ICsgY3Vyci55LCAwKTtcbiAgICAgICAgICAgICAgICAgIGxldCBiYXJEYXRhID0gW3sgbGFiZWw6IFwiT3Zlci1VbmRlclwiLCB2YWx1ZXM6IFtdIH1dO1xuICAgICAgICAgICAgICAgICAgcGllRGF0YS5mb3JFYWNoKGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIGxldCBiYXJPYmogPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAodG90YWwpIGJhck9iai52YWx1ZSA9IChnYW1lLnBsZWRnZSAqIGdhbWUudXNlcnMubGVuZ3RoKSAqIChlLnkgLyB0b3RhbCkgLSBnYW1lLnBsZWRnZTtcbiAgICAgICAgICAgICAgICAgICAgICBlbHNlIGJhck9iai52YWx1ZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgYmFyT2JqLmxhYmVsID0gZS5rZXk7XG4gICAgICAgICAgICAgICAgICAgICAgYmFyRGF0YVswXS52YWx1ZXMucHVzaChiYXJPYmopO1xuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIGdhbWUuYmFyQ2hhcnREYXRhID0gYmFyRGF0YTtcbiAgICAgICAgICAgICAgICAgIGdhbWUudGltZUxlZnQgPSBtb21lbnQoZ2FtZS5lbmQpLmZyb21Ob3coKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybiBnYW1lcztcbiAgICAgICAgICB9KTtcbiAgfVxuXG4gIEdhbWVGYWN0b3J5LmdldENvbXBsZXRlZEdhbWVzID0gZnVuY3Rpb24oaWQpIHtcbiAgICByZXR1cm4gJGh0dHAuZ2V0KCdhcGkvZ2FtZXMvdXNlci8nICsgaWQgKyAnL2NvbXBsZXRlZCcpXG4gICAgLnRoZW4oZ2FtZXMgPT4gZ2FtZXMuZGF0YSk7XG4gIH1cblxuICBHYW1lRmFjdG9yeS5nZXRFdmVudHNieUlkID0gZnVuY3Rpb24odGFza0lkKXtcbiAgICByZXR1cm4gJGh0dHAuZ2V0KCdhcGkvZXZlbnRzL3Rhc2svJyArIHRhc2tJZClcbiAgICAudGhlbihuZXdFdmVudCA9PiBuZXdFdmVudC5kYXRhKTtcbiAgfVxuXG4gIEdhbWVGYWN0b3J5LmNvbmZpcm1HYW1lID0gZnVuY3Rpb24oZGF0YSl7XG4gICAgY29uc29sZS5sb2coXCJJbiBjb25maXJtR2FtZSByb3V0ZVwiKVxuICAgIHJldHVybiAkaHR0cC5wb3N0KCdhcGkvY3JvbicsIGRhdGEpXG4gICAgLnRoZW4ocmVzPT5yZXMpXG4gIH1cblxuICBHYW1lRmFjdG9yeS5zZW5kTWVzc2FnZSA9IGZ1bmN0aW9uKGRhdGEpe1xuICAgIGNvbnNvbGUubG9nKFwibWVzc2FnZVwiLCBkYXRhKVxuICAgIHJldHVybiAkaHR0cC5wb3N0KCdhcGkvZ2FtZXMvbWVzc2FnZScsIGRhdGEpXG4gICAgLnRoZW4ocmVzPT5yZXMuZGF0YSk7XG4gIH1cblxuICBHYW1lRmFjdG9yeS5nZXRNZXNzYWdlcyA9IGZ1bmN0aW9uKGlkKXtcbiAgICBjb25zb2xlLmxvZyhcImdldCBtZXNzYWdlIGZ1bmN0aW9uXCIsIGlkKTtcbiAgICByZXR1cm4gJGh0dHAuZ2V0KCdhcGkvZ2FtZXMvbWVzc2FnZXMvJyArIGlkKVxuICAgIC50aGVuKHJlcz0+cmVzLmRhdGEpO1xuICAgIH1cblxuICByZXR1cm4gR2FtZUZhY3Rvcnk7XG59KVxuXG5cbmFwcC5mYWN0b3J5KCdzb2NrZXQnLCBmdW5jdGlvbigkcm9vdFNjb3BlKXtcbiAgdmFyIHNvY2tldCA9IGlvLmNvbm5lY3QoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBvbjogZnVuY3Rpb24gKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHNvY2tldC5vbihldmVudE5hbWUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHNvY2tldCwgYXJncyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgZW1pdDogZnVuY3Rpb24gKGV2ZW50TmFtZSwgZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHNvY2tldC5lbWl0KGV2ZW50TmFtZSwgZGF0YSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShzb2NrZXQsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgcmVtb3ZlQWxsTGlzdGVuZXJzOiBmdW5jdGlvbiAoZXZlbnROYW1lLCBjYWxsYmFjaykge1xuICAgICAgICAgIHNvY2tldC5yZW1vdmVBbGxMaXN0ZW5lcnMoZXZlbnROYW1lLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShzb2NrZXQsIGFyZ3MpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTsgXG4gICAgICB9XG4gICAgfTtcbn0pO1xuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd1LmdhbWUnLHtcbiAgICB1cmw6ICcvZ2FtZS9vdmVydmlldy86Z2FtZUlkJyxcbiAgICB0ZW1wbGF0ZVVybDogJ2pzL2dhbWUtb3ZlcnZpZXcvdXNlci1nYW1lcy5odG1sJyxcbiAgICBjb250cm9sbGVyOiAnR2FtZU92ZXJ2aWV3Q3RybCcsXG4gICAgcmVzb2x2ZToge1xuICAgICAgZ2FtZU9iajogZnVuY3Rpb24oJHN0YXRlUGFyYW1zLCBHYW1lRmFjdG9yeSl7XG4gICAgICAgIHJldHVybiBHYW1lRmFjdG9yeS5nZXRHYW1lKCRzdGF0ZVBhcmFtcy5nYW1lSWQpO1xuICAgIH0sIFxuICAgICAgbWVzc2FnZXM6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcywgR2FtZUZhY3Rvcnkpe1xuICAgICAgICByZXR1cm4gR2FtZUZhY3RvcnkuZ2V0TWVzc2FnZXMoJHN0YXRlUGFyYW1zLmdhbWVJZClcbiAgICAgIH1cbiAgfVxuICB9KVxufSlcblxuYXBwLmNvbnRyb2xsZXIoJ0dhbWVPdmVydmlld0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIGdhbWVPYmosIEdhbWVGYWN0b3J5LCBtZXNzYWdlcywgc29ja2V0KXtcblxuICAkc2NvcGUuZ2FtZSA9IGdhbWVPYmo7XG5cbiAgJHNjb3BlLmNvbnRlbnQgPSBtZXNzYWdlcztcblxuICBjb25zb2xlLmxvZygkc2NvcGUuY29udGVudCk7XG5cbiAgICBzb2NrZXQub24oJ2Nvbm5lY3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coJ1lvdSBoYXZlIGNvbm5lY3RlZCB0byB0aGUgc2VydmVyIScpO1xuICAgIHNvY2tldC5lbWl0KCdhZGR1c2VyJywgJHNjb3BlLnVzZXIuaWQsICRzY29wZS5nYW1lLmlkKVxuICB9KVxuXG4gIHNvY2tldC5vbigndXBkYXRlY2hhdCcsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgY29uc29sZS5sb2coXCJjaGF0IHVwZGF0ZWRcIiwgZGF0YSk7XG4gICAgJHNjb3BlLmNvbnRlbnQucHVzaCh7dXNlcm5hbWU6IGRhdGEudXNlcm5hbWUsIG1lc3NhZ2U6IGRhdGEuY29udGVudCwgY3JlYXRlZEF0OiBEYXRlLm5vdygpfSk7XG4gICAgfSlcblxuICAkc2NvcGUubWVzc2FnZSA9ICcnO1xuXG4gICRzY29wZS5vcGVuTWVzc2FnZXMgPSBmYWxzZTtcblxuICAkc2NvcGUub3Blbk1lc3NhZ2VCb3ggPSBmdW5jdGlvbigpe1xuICAgICRzY29wZS5vcGVuTWVzc2FnZXMgPSAhKCRzY29wZS5vcGVuTWVzc2FnZXMpXG4gIH07XG5cbiAgJHNjb3BlLnNlbmRNZXNzYWdlID0gZnVuY3Rpb24gKCl7XG5cbiAgICBHYW1lRmFjdG9yeS5zZW5kTWVzc2FnZSh7Z2FtZUlkOiAkc2NvcGUuZ2FtZS5pZCwgdXNlcm5hbWU6ICRzY29wZS51c2VyLnVzZXJuYW1lLCBtZXNzYWdlOiAkc2NvcGUubWVzc2FnZX0pXG4gICAgLnRoZW4oJHNjb3BlLmNvbnRlbnQucHVzaCh7Z2FtZUlkOiAkc2NvcGUuZ2FtZUlkLCB1c2VybmFtZTogJHNjb3BlLnVzZXIudXNlcm5hbWUsIG1lc3NhZ2U6ICRzY29wZS5tZXNzYWdlLCBjcmVhdGVkQXQ6IERhdGUubm93KCl9KSk7XG5cbiAgICAkc2NvcGUuc29ja2V0RW1pdCgkc2NvcGUubWVzc2FnZSk7XG5cbiAgICAkc2NvcGUubWVzc2FnZSA9ICcnO1xuXG4gIH1cblxuICAkc2NvcGUuc29ja2V0RW1pdCA9IGZ1bmN0aW9uICgpe1xuICAgIGNvbnNvbGUubG9nKFwic2VuZGluZyBtZXNzYWdlXCIpO1xuICAgIHNvY2tldC5lbWl0KCdzZW5kOm1lc3NhZ2UnLCB7XG4gICAgICBjb250ZW50OiAkc2NvcGUubWVzc2FnZSxcbiAgICAgIHVzZXJuYW1lOiAkc2NvcGUudXNlci51c2VybmFtZSxcbiAgICAgIG1lOiBmYWxzZSBcbiAgICB9KVxuXG4gICAkc2NvcGUubWVzc2FnZSA9ICcnO1xuICB9XG5cbiAgY29uc29sZS5sb2coJHNjb3BlLmdhbWUpO1xuXG4gICRzY29wZS5jb25maXJtZWQgPSAkc2NvcGUuZ2FtZS51c2Vycy5maWx0ZXIodXNlciA9PiB1c2VyLkdhbWVQbGF5ZXJzLnN0YXR1cyA9PT0gXCJDb25maXJtZWRcIik7XG4gICRzY29wZS51bmNvbmZpcm1lZCA9ICRzY29wZS5nYW1lLnVzZXJzLmZpbHRlcih1c2VyID0+IHVzZXIuR2FtZVBsYXllcnMuc3RhdHVzID09PSBcIlVuY29uZmlybWVkXCIpO1xuICAkc2NvcGUuaW52aXRlZCA9ICRzY29wZS5nYW1lLnVzZXJzLmZpbHRlcih1c2VyID0+IHVzZXIuR2FtZVBsYXllcnMuc3RhdHVzID09PSBcIkludml0ZWRcIik7XG5cbiAgJHNjb3BlLnBpZUNoYXJ0T3B0aW9ucyA9IHtcbiAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgdHlwZTogJ3BpZUNoYXJ0JyxcbiAgICAgICAgICBoZWlnaHQ6IDUwMCxcbiAgICAgICAgICB4OiBmdW5jdGlvbihkKXtyZXR1cm4gZC5rZXk7IH0sXG4gICAgICAgICAgeTogZnVuY3Rpb24oZCl7cmV0dXJuIGQueTsgfSxcbiAgICAgICAgICBzaG93TGFiZWxzOiBmYWxzZSxcbiAgICAgICAgICBkdXJhdGlvbjogNTAwLFxuICAgICAgICAgIGxhYmVsVGhyZXNob2xkOiAwLjAxLFxuICAgICAgICAgIGxhYmVsU3VuYmVhbUxheW91dDogdHJ1ZSxcbiAgICAgICAgICBsZWdlbmQ6IHtcbiAgICAgICAgICAgICAgbWFyZ2luOiB7XG4gICAgICAgICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICAgICAgICByaWdodDogNSxcbiAgICAgICAgICAgICAgICAgIGJvdHRvbTogNSxcbiAgICAgICAgICAgICAgICAgIGxlZnQ6IDBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgbGVnZW5kUG9zaXRpb246ICdjZW50ZXInXG4gICAgICB9LFxuICAgICAgdGl0bGU6IHtcbiAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgdGV4dDogXCJDdXJyZW50IFBvaW50IFNoYXJlXCIsXG4gICAgICAgICAgY2xhc3NOYW1lOiAnaDQnLFxuICAgICAgICAgIGNzczoge1xuICAgICAgICAgICAgJ2ZvbnQtc2l6ZSc6ICcyNHB4J1xuICAgICAgICAgIH1cbiAgICAgIH1cbiAgfTtcblxuICAkc2NvcGUuYmFyQ2hhcnRPcHRpb25zPSB7XG4gICAgICBjaGFydDoge1xuICAgICAgICAgIHR5cGU6ICdkaXNjcmV0ZUJhckNoYXJ0JyxcbiAgICAgICAgICBoZWlnaHQ6IDQ1MCxcbiAgICAgICAgICBtYXJnaW4gOiB7XG4gICAgICAgICAgICAgIHRvcDogMjAsXG4gICAgICAgICAgICAgIHJpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgYm90dG9tOiA1MCxcbiAgICAgICAgICAgICAgbGVmdDogNTVcbiAgICAgICAgICB9LFxuICAgICAgICAgIHg6IGZ1bmN0aW9uKGQpe3JldHVybiBkLmxhYmVsOyB9LFxuICAgICAgICAgIHk6IGZ1bmN0aW9uKGQpe3JldHVybiBkLnZhbHVlOyB9LFxuICAgICAgICAgIHNob3dWYWx1ZXM6IHRydWUsXG4gICAgICAgICAgdmFsdWVGb3JtYXQ6IGZ1bmN0aW9uKGQpe1xuICAgICAgICAgICAgICByZXR1cm4gZDMuZm9ybWF0KCckLC4yZicpKGQpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZHVyYXRpb246IDUwMCxcbiAgICAgICAgICB4QXhpczoge1xuICAgICAgICAgICAgICBheGlzTGFiZWw6ICdYIEF4aXMnXG4gICAgICAgICAgfSxcbiAgICAgICAgICB5QXhpczoge1xuICAgICAgICAgICAgICBheGlzTGFiZWw6ICcnLFxuICAgICAgICAgICAgICBheGlzTGFiZWxEaXN0YW5jZTogLTEwLFxuICAgICAgICAgICAgICB0aWNrRm9ybWF0OiBmdW5jdGlvbihkKXtyZXR1cm4gZDMuZm9ybWF0KFwiJCwuMmZcIikoZCk7IH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzaG93WEF4aXM6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgIHRleHQ6IFwiQ3VycmVudCBOZXQgUGF5b3V0c1wiLFxuICAgICAgICAgIGNsYXNzTmFtZTogJ2g0JyxcbiAgICAgICAgICBjc3M6IHtcbiAgICAgICAgICAgICdmb250LXNpemUnOiAnMjRweCdcbiAgICAgICAgICB9XG4gICAgICB9XG4gIH07XG5cblxufSlcbiIsImFwcC5kaXJlY3RpdmUoJ3RnTGVhZGVyYm9hcmQnLCBmdW5jdGlvbigpe1xuICByZXR1cm57XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICB0ZW1wbGF0ZVVybDogJ2pzL2dhbWUtb3ZlcnZpZXcvbGVhZGVyYm9hcmQuaHRtbCcsXG4gICAgc2NvcGU6IHtcbiAgICAgIGV2ZW50czogJz0nLFxuICAgICAgcGxheWVyczogJz0nLFxuICAgICAgdGFza3M6ICc9J1xuICAgIH0sXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUpe1xuICAgICAgc2NvcGUucGxheWVycyA9IHNjb3BlLnBsYXllcnMubWFwKHBsYXllciA9PiB7XG4gICAgICAgIHBsYXllci5wb2ludHMgPSBzY29wZS5ldmVudHMuZmlsdGVyKGV2ZW50ID0+IGV2ZW50LmNvbXBsZXRlZEJ5SWQgPT09IHBsYXllci5pZClcbiAgICAgICAgLm1hcChldmVudCA9PiBzY29wZS50YXNrcy5maW5kKHRhc2sgPT4gdGFzay5pZCA9PT0gZXZlbnQudGFza0lkKS5wb2ludHMpXG4gICAgICAgIC5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IHByZXYgKyBjdXJyLCAwKTtcbiAgICAgICAgcmV0dXJuIHBsYXllcjtcbiAgICAgIH0pLnNvcnQoKGEsYikgPT4gYi5wb2ludHMgLSBhLnBvaW50cyk7XG4gICAgfVxufX0pO1xuIiwiYXBwLmRpcmVjdGl2ZSgndGdOZXdzZmVlZCcsIGZ1bmN0aW9uKCl7XG4gIHJldHVybntcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHRlbXBsYXRlVXJsOiAnanMvZ2FtZS1vdmVydmlldy9uZXdzZmVlZC5odG1sJyxcbiAgICBzY29wZToge1xuICAgICAgZXZlbnRzOiAnPScsXG4gICAgICB1c2VyczogJz0nLFxuICAgICAgdGFza3M6ICc9J1xuICAgIH0sXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUpe1xuXG4gICAgICBzY29wZS5ldmVudHMuZm9yRWFjaChlPT4gZS51c2VyTmFtZSA9IHNjb3BlLnVzZXJzLmZpbmQoZnVuY3Rpb24odXNlcil7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICByZXR1cm4gdXNlci5pZCA9PSBlLmNvbXBsZXRlZEJ5SWQ7XG4gICAgICB9KS5maXJzdE5hbWUpO1xuXG4gICAgICBzY29wZS5ldmVudHMuZm9yRWFjaChlPT57XG4gICAgICAgIHZhciBmb3VuZFRhc2sgPSBzY29wZS50YXNrcy5maW5kKGZ1bmN0aW9uKHRhc2spe3JldHVybiB0YXNrLmlkID09IGUudGFza0lkfSlcbiAgICAgICAgZS50YXNrID0gZm91bmRUYXNrLm5hbWU7XG4gICAgICAgIGUucG9pbnRzID0gZm91bmRUYXNrLnBvaW50cztcbiAgICAgIH0pO1xuXG4gICAgfVxuICB9XG59KTtcbiIsImFwcC5jb250cm9sbGVyKCdIb21lQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJG1kRGlhbG9nKXtcbiAgICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJG1kRGlhbG9nLnNob3coe1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9sb2dpbi9sb2dpbi5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgICRzY29wZS5zaWdudXAgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJG1kRGlhbG9nLnNob3coe1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9zaWdudXAvc2lnbnVwLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1NpZ251cEN0cmwnXG4gICAgICAgIH0pO1xuICAgIH1cblxufSlcbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2hvbWUnLCB7XG4gICAgICAgIHVybDogJy9ob21lJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9ob21lL2hvbWUuaHRtbCdcbiAgICB9KTtcbn0pO1xuXG4iLCJhcHAuY29udHJvbGxlcignSW52aXRlRnJpZW5kc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJG1kRGlhbG9nLCAkaHR0cCl7XG5cbiAgICAkc2NvcGUuZnJpZW5kcyA9IFtdO1xuXG4gICAgY29uc29sZS5sb2coJ2ludml0ZWZyaWVuZHMnLCRzY29wZS5mcmllbmRzKTtcblxuICAgICRzY29wZS5hZGRGcmllbmQgPSBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgICBsZXQgZW1haWxSZWdleCA9IC9eWy1hLXowLTl+ISQlXiYqXz0rfXtcXCc/XSsoXFwuWy1hLXowLTl+ISQlXiYqXz0rfXtcXCc/XSspKkAoW2EtejAtOV9dWy1hLXowLTlfXSooXFwuWy1hLXowLTlfXSspKlxcLihhZXJvfGFycGF8Yml6fGNvbXxjb29wfGVkdXxnb3Z8aW5mb3xpbnR8bWlsfG11c2V1bXxuYW1lfG5ldHxvcmd8cHJvfHRyYXZlbHxtb2JpfFthLXpdW2Etel0pfChbMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9KSkoOlswLTldezEsNX0pPyQvaVxuICAgICAgICBpZighZW1haWwubWF0Y2goZW1haWxSZWdleCkpIHJldHVybjtcbiAgICAgICAgbGV0IG5ld0ZyaWVuZE51bSA9ICRzY29wZS5mcmllbmRzLmxlbmd0aCArIDE7XG4gICAgICAgICRzY29wZS5mcmllbmRzLnB1c2goe1xuICAgICAgICAgICAgaWQ6J2ZyaWVuZCcgKyBuZXdGcmllbmROdW0sXG4gICAgICAgICAgICBlbWFpbDogZW1haWxcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5yZW1vdmVGcmllbmQgPSBmdW5jdGlvbihmcmllbmRJZCkge1xuICAgICAgICAkc2NvcGUuZnJpZW5kcyA9ICRzY29wZS5mcmllbmRzLmZpbHRlcihlPT5lLmlkICE9PSBmcmllbmRJZCk7XG4gICAgfTtcblxuICAgICRzY29wZS5oYW5kbGVTdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBlbWFpbHMgPSBbXTtcbiAgICAgICAgJHNjb3BlLmZyaWVuZHMuZm9yRWFjaChmcmllbmQgPT4gZW1haWxzLnB1c2goZnJpZW5kLmVtYWlsKSk7XG4gICAgICAgICRodHRwLnBvc3QoJy9hcGkvZW1haWwvaW52aXRlRnJpZW5kcycsIHtcbiAgICAgICAgICAgIGVtYWlsczogZW1haWxzLFxuICAgICAgICAgICAgdXNlcjoge1xuICAgICAgICAgICAgICAgIGZpcnN0TmFtZTogJHNjb3BlLnVzZXIuZmlyc3ROYW1lLFxuICAgICAgICAgICAgICAgIGxhc3ROYW1lOiAkc2NvcGUudXNlci5sYXN0TmFtZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgJG1kRGlhbG9nLnNob3coe1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnanMvaW52aXRlLWZyaWVuZHMvc3VjY2Vzcy5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSW52aXRlU3VjY2Vzc0N0cmwnLFxuICAgICAgICAgICAgICAgIGxvY2FscyA6IHtkYXRhVG9QYXNzIDogJHNjb3BlLmZyaWVuZHN9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiAkbWREaWFsb2cuaGlkZSgpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgICRzY29wZS5oYW5kbGVDYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAkbWREaWFsb2cuaGlkZSgpO1xuICAgIH07XG5cbn0pXG4iLCJhcHAuY29udHJvbGxlcignSW52aXRlU3VjY2Vzc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRtZERpYWxvZywgZGF0YVRvUGFzcyl7XG5cbiAgICAkc2NvcGUuZnJpZW5kcyA9IGRhdGFUb1Bhc3M7XG5cbiAgICAkc2NvcGUuY2xvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAkbWREaWFsb2cuaGlkZSgpO1xuICAgIH07XG5cbn0pXG4iLCJhcHAuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbWREaWFsb2csICRzdGF0ZSwgQXV0aFNlcnZpY2Upe1xuICAgICRzY29wZS5lbWFpbCA9IG51bGw7XG4gICAgJHNjb3BlLnBhc3N3b3JkID0gbnVsbDtcblxuICAgICRzY29wZS5oYW5kbGVTdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5lcnJvciA9IG51bGw7XG5cbiAgICAgICAgbGV0IGxvZ2luSW5mbyA9IHtcbiAgICAgICAgICAgIGVtYWlsOiAkc2NvcGUuZW1haWwsXG4gICAgICAgICAgICBwYXNzd29yZDogJHNjb3BlLnBhc3N3b3JkXG4gICAgICAgIH1cblxuICAgICAgICBBdXRoU2VydmljZS5sb2dpbihsb2dpbkluZm8pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ3UuZGFzaCcsIHt1c2VySWQ6IHVzZXIuaWR9KTtcbiAgICAgICAgICAgIHJldHVybiAkbWREaWFsb2cuaGlkZSgpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9ICdJbnZhbGlkIGxvZ2luIGNyZWRlbnRpYWxzLic7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgICRzY29wZS5oYW5kbGVDYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAkbWREaWFsb2cuaGlkZSgpO1xuICAgIH07XG59KTtcbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbG9naW4nLCB7XG4gICAgICAgIHVybDogJy9sb2dpbicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvbG9naW4vbG9naW4uaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnXG4gICAgfSk7XG5cbn0pO1xuXG4iLCJhcHAuZGlyZWN0aXZlKCduYXZiYXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgQXV0aFNlcnZpY2UsIEFVVEhfRVZFTlRTLCAkc3RhdGUpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiB7fSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vZGlyZWN0aXZlcy9uYXZiYXIvbmF2YmFyLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUpIHtcblxuICAgICAgICAgICAgc2NvcGUuaXRlbXMgPSBbXG4gICAgICAgICAgICAgICAgeyBsYWJlbDogJ0hvbWUnLCBzdGF0ZTogJ2hvbWUnIH0sXG4gICAgICAgICAgICAgICAgeyBsYWJlbDogJ0Fib3V0Jywgc3RhdGU6ICdhYm91dCcgfSxcbiAgICAgICAgICAgICAgICB7IGxhYmVsOiAnRG9jdW1lbnRhdGlvbicsIHN0YXRlOiAnZG9jcycgfSxcbiAgICAgICAgICAgICAgICB7IGxhYmVsOiAnTWVtYmVycyBPbmx5Jywgc3RhdGU6ICdtZW1iZXJzT25seScsIGF1dGg6IHRydWUgfVxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgc2NvcGUudXNlciA9IG51bGw7XG5cbiAgICAgICAgICAgIHNjb3BlLmlzTG9nZ2VkSW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIEF1dGhTZXJ2aWNlLmxvZ291dCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnaG9tZScpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIHNldFVzZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgQXV0aFNlcnZpY2UuZ2V0TG9nZ2VkSW5Vc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS51c2VyID0gdXNlcjtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciByZW1vdmVVc2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNjb3BlLnVzZXIgPSBudWxsO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgc2V0VXNlcigpO1xuXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5sb2dpblN1Y2Nlc3MsIHNldFVzZXIpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMubG9nb3V0U3VjY2VzcywgcmVtb3ZlVXNlcik7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5zZXNzaW9uVGltZW91dCwgcmVtb3ZlVXNlcik7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxufSk7XG4iLCJhcHAuY29udHJvbGxlcignU2lnbnVwQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJG1kRGlhbG9nLCAkc3RhdGUsIFVzZXJGYWN0b3J5KXtcbiAgICAkc2NvcGUuZW1haWwgPSBudWxsO1xuICAgICRzY29wZS5wYXNzd29yZCA9IG51bGw7XG5cbiAgICAkc2NvcGUuaGFuZGxlU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xuXG4gICAgICAgIGxldCBzaWdudXBJbmZvID0ge1xuICAgICAgICAgICAgZW1haWw6ICRzY29wZS5lbWFpbCxcbiAgICAgICAgICAgIHBhc3N3b3JkOiAkc2NvcGUucGFzc3dvcmRcbiAgICAgICAgfTtcblxuICAgICAgICBVc2VyRmFjdG9yeS5jcmVhdGVOZXdVc2VyKHNpZ251cEluZm8pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgICAgICAgJHN0YXRlLmdvKCd1LmFjY291bnQnLCB7dXNlcjogdXNlcn0pO1xuICAgICAgICAgICAgcmV0dXJuICRtZERpYWxvZy5oaWRlKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gZXJyLm1lc3NhZ2U7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUuaGFuZGxlQ2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJG1kRGlhbG9nLmhpZGUoKTtcbiAgICB9O1xufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3NpZ251cCcsIHtcbiAgICAgICAgdXJsOiAnL3NpZ251cCcsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvc2lnbnVwL3NpZ251cC5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1NpZ251cEN0cmwnXG4gICAgfSk7XG5cbn0pO1xuIiwiYXBwLmZhY3RvcnkoJ1Rhc2tEZWV0c0ZhY3RvcnknLCBmdW5jdGlvbigkc2NvcGUsICRtZFNpZGVuYXYsICRtZE1lZGlhLCAkc3RhdGUsICRodHRwKSB7XG5cblxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgndS50YXNrJywge1xuICAgICAgICB1cmw6ICcvdGFza0RldGFpbC86dGFza0lkJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy90YXNrLWRldGFpbC90YXNrLWRldGFpbC5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1Rhc2tEZWV0c0N0cmwnLFxuICAgICAgICBwYXJhbXM6IHt0YXNrOiBudWxsfSxcbiAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgZXZlbnRzOiBmdW5jdGlvbigkc3RhdGVQYXJhbXMsIEdhbWVGYWN0b3J5LCBVc2VyRmFjdG9yeSl7XG4gICAgICAgIFx0cmV0dXJuIEdhbWVGYWN0b3J5LmdldEV2ZW50c2J5SWQoJHN0YXRlUGFyYW1zLnRhc2suaWQpXG4gICAgICAgIFx0LnRoZW4oZnVuY3Rpb24oZXZlbnRzKSB7XG4gICAgICAgIFx0XHRyZXR1cm4gUHJvbWlzZS5hbGwoZXZlbnRzLm1hcChmdW5jdGlvbihldmVudCl7XG4gICAgICAgIFx0XHRcdHJldHVybiBVc2VyRmFjdG9yeS5nZXRVc2VySW5mbyhldmVudC5jb21wbGV0ZWRCeUlkKVxuICAgICAgICBcdFx0XHRcdC50aGVuKGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgICAgICAgXHRcdFx0XHRldmVudC5uYW1lID0gdXNlci5maXJzdE5hbWUgKyBcIiBcIiArIHVzZXIubGFzdE5hbWU7XG4gICAgICAgICAgICBcdFx0XHRcdFx0cmV0dXJuIGV2ZW50XG4gICAgICAgICAgICBcdFx0XHR9KVxuICAgICAgICAgICAgXHR9KSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBcdH1cbiAgICBcdCAgLy8gZXZlbnRzOiBbJyRodHRwJywnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24oR2FtZUZhY3RvcnksICRzdGF0ZVBhcmFtcyl7XG4gICAgICAgLy8gICAgICAgXHRcdFx0cmV0dXJuIEdhbWVGYWN0b3J5LmdldEV2ZW50c0J5SWQoJHN0YXRlUGFyYW1zLnRhc2suaWQpLnRoZW4oZXZlbnRzPT5ldmVudHMpO1xuICAgICAgIC8vICAgXHRcdH1dXG4gICAgXHR9XG4gICAgfSlcbn0pO1xuIiwiYXBwLmNvbnRyb2xsZXIoJ1Rhc2tEZWV0c0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRtZFNpZGVuYXYsICRtZE1lZGlhLCAkbWREaWFsb2csICRzdGF0ZVBhcmFtcywgR2FtZUZhY3RvcnksIFVzZXJGYWN0b3J5LCBldmVudHMpIHtcblxuICAgICRzY29wZS5jb252ZXJ0RGF0ZSA9IGZ1bmN0aW9uKFNlcXVlbGl6ZURhdGUpe1xuICAgICAgICB2YXIgWWVhck1vbnRoRGF5ID0gU2VxdWVsaXplRGF0ZS5tYXRjaCgvW15UXSovKTtcbiAgICAgICAgWWVhck1vbnRoRGF5ID0gWWVhck1vbnRoRGF5WzBdLnNwbGl0KCctJyk7XG4gICAgICAgIHZhciBZZWFyID0gWWVhck1vbnRoRGF5WzBdO1xuICAgICAgICB2YXIgTW9udGggPSBZZWFyTW9udGhEYXlbMV07XG4gICAgICAgIHZhciBEYXkgPSBZZWFyTW9udGhEYXlbMl07XG4gICAgICAgIHZhciB0aW1lID0gU2VxdWVsaXplRGF0ZS5zbGljZShTZXF1ZWxpemVEYXRlLmluZGV4T2YoXCJUXCIpKzEsLTgpO1xuICAgICAgICBjb25zb2xlLmxvZyh0aW1lKTtcbiAgICAgICAgLy8gcmV0dXJuIFllYXJNb250aERheSArIFwiIFwiICsgdGltZTtcbiAgICAgICAgcmV0dXJuIE1vbnRoICsgXCIvXCIgKyBEYXkgKyBcIi9cIiArIFllYXIgKyBcIiBcIiArIHRpbWU7XG4gICAgfTtcblxuICAgICRzY29wZS50YXNrID0gJHN0YXRlUGFyYW1zLnRhc2s7XG5cbiAgICAkc2NvcGUuZXZlbnRzID0gZXZlbnRzLm1hcChmdW5jdGlvbihldmVudCl7XG4gICAgICAgIGV2ZW50LmNyZWF0ZWRBdCA9ICRzY29wZS5jb252ZXJ0RGF0ZShldmVudC5jcmVhdGVkQXQpXG4gICAgICAgIHJldHVybiBldmVudDtcbiAgICB9KVxuICAgIC8vIC5tYXAoZnVuY3Rpb24oZXZlbnQpe1xuICAgIC8vICAgICByZXR1cm4gVXNlckZhY3RvcnkuZ2V0VXNlckluZm8oZXZlbnQuY29tcGxldGVkQnlJZClcbiAgICAvLyAgICAgLnRoZW4oZnVuY3Rpb24odXNlcil7XG4gICAgLy8gICAgICAgICBldmVudC5uYW1lID0gdXNlci5maXJzdE5hbWUgKyBcIiBcIiArIHVzZXIubGFzdE5hbWU7XG4gICAgLy8gICAgICAgICByZXR1cm4gZXZlbnR9KTtcbiAgICAvLyB9KVxuICAgIC8vICkudGhlbihmdW5jdGlvbihldmVudEFycmF5KXtcbiAgICAvLyAgICAgJHNjb3BlLmV2ZW50TmFtZXMgPSBldmVudEFycmF5O1xuICAgIC8vICAgICAkc2NvcGUuZXZlbnROYW1lcy5tYXAoZnVuY3Rpb24oZXZlbnQpe1xuICAgIC8vICAgICBldmVudC5jcmVhdGVkQXQgPSAkc2NvcGUuY29udmVydERhdGUoZXZlbnQuY3JlYXRlZEF0KVxuICAgIC8vICAgICByZXR1cm4gZXZlbnQ7XG4gICAgLy8gfSlcbiAgICAvLyAgICAgcmV0dXJuIGV2ZW50QXJyYXlcbiAgICAvLyB9KTtcblxuICAgIC8vICRzY29wZS51cGRhdGVkRXZlbnREYXRlcyA9ICRzY29wZS5ldmVudHMubWFwKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAvLyAgICAgZXZlbnQuY3JlYXRlZEF0ID0gJHNjb3BlLmNvbnZlcnREYXRlKGV2ZW50LmNyZWF0ZWRBdClcbiAgICAvLyAgICAgcmV0dXJuIGV2ZW50O1xuICAgIC8vIH0pO1xuXG4gICAgLy8gJHNjb3BlLmV2ZW50RGF0ZXMgPSAkc2NvcGUuZXZlbnRzLm1hcChmdW5jdGlvbihldmVudCl7XG4gICAgLy8gICAgIGV2ZW50LmRhdGUgPSAkc2NvcGUuY29udmVydERhdGUoZXZlbnQuZGF0ZSk7XG4gICAgLy8gICAgIHJldHVybiBldmVudC5kYXRlO1xuICAgIC8vIH0pXG5cbiAgICAvLyAkc2NvcGUuY29tcGxldGVUYXNrID0gR2FtZUZhY3RvcnkuY29tcGxldGVUYXNrKGluZm8pO1xuXG4gICAgLy8gJHNjb3BlLmV2ZW50czEgPSBldmVudHNcblxuICAgICRzY29wZS50ZXN0RXZlbnRPYmogPSBmdW5jdGlvbigpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIioqKioqIGV2ZW50cyBcIiwgJHNjb3BlLmV2ZW50cylcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJldmVudHMxIFwiLCBldmVudHMxKVxuICAgIH1cblxuICAgICRzY29wZS50ZXN0RXZlbnRPYmooKTtcblxuICAgICRzY29wZS5zdGF0dXMgPSBudWxsO1xuXG4gICAgJHNjb3BlLnNob3dDb25maXJtID0gZnVuY3Rpb24oZXYpIHtcbiAgICAvLyBBcHBlbmRpbmcgZGlhbG9nIHRvIGRvY3VtZW50LmJvZHkgdG8gY292ZXIgc2lkZW5hdiBpbiBkb2NzIGFwcFxuICAgIHZhciBjb25maXJtID0gJG1kRGlhbG9nLmNvbmZpcm0oKVxuICAgICAgICAgIC50aXRsZSgnQXJlIHlvdSBzdXJlIHlvdSBjb21wbGV0ZWQgdGhpcyB0YXNrPycpXG4gICAgICAgICAgLnRleHRDb250ZW50KCdUYXNrcyB3aWxsIGJlIHZlcmlmaWVkIGJ5IHRoZSBvdGhlciBwbGF5ZXJzIGluIHRoZSBnYW1lJylcbiAgICAgICAgICAuYXJpYUxhYmVsKCdZZXMsIEkgZGlkJylcbiAgICAgICAgICAudGFyZ2V0RXZlbnQoZXYpXG4gICAgICAgICAgLm9rKCdZZXMsIEkgZGlkJylcbiAgICAgICAgICAuY2FuY2VsKCdObywgSSBoYXZlIG5vdCcpO1xuICAgICRtZERpYWxvZy5zaG93KGNvbmZpcm0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAkc2NvcGUuc3RhdHVzID0gJ0NvbXBsZXRlZCc7XG4gICAgICBjb25zb2xlLmxvZygkc2NvcGUuc3RhdHVzKTtcbiAgICAgIEdhbWVGYWN0b3J5LmNvbXBsZXRlVGFzayh7Y29tcGxldGVkQnlJZDogJHNjb3BlLnVzZXIuaWQsIHRhc2tJZDogJHNjb3BlLnRhc2suaWQsIGdhbWVJZDogJHNjb3BlLnRhc2suZ2FtZUlkfSlcbiAgICAgIC50aGVuKHRhc2s9PnRhc2spO1xuICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgJHNjb3BlLnN0YXR1cyA9ICdOb3QgQ29tcGxldGVkJztcbiAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5zdGF0dXMpO1xuICAgIH0pO1xuICB9O1xufSlcbiIsImFwcC5jb250cm9sbGVyKCdVc2VyQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIEF1dGhTZXJ2aWNlLCB1c2Vyc0dhbWVzLCAkbWREaWFsb2csIHVzZXIpIHtcbiAgICAkc2NvcGUudXNlciA9IHVzZXI7XG5cbiAgICAkc2NvcGUuaXNMb2dnZWRJbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgJHNjb3BlLmdhbWVzID0gdXNlcnNHYW1lcztcblxuICAgICRzY29wZS5tZW51SXRlbXMgPSB1c2Vyc0dhbWVzLmZpbHRlcihnYW1lID0+IGdhbWUuc3RhdHVzICE9PSAnQ29tcGxldGVkJyk7XG5cbiAgICAvLyBhd2FpdGluZyB1c2FnZVxuICAgIC8vICRzY29wZS5jb21wbGV0ZWRHYW1lcyA9IHVzZXJzR2FtZXMuZmlsdGVyKGdhbWUgPT4gZ2FtZS5zdGF0dXMgPT09ICdDb21wbGV0ZWQnKTtcblxuICAgICRzY29wZS5nb1RvRWRpdCA9IGZ1bmN0aW9uKGNvbW1pc3Npb25lcklkLCBsb2NrZWQpIHtcbiAgICAgICAgcmV0dXJuIChjb21taXNzaW9uZXJJZCA9PT0gJHNjb3BlLnVzZXIuaWQpICYmICFsb2NrZWQ7XG4gICAgfVxuXG4gICAgJHNjb3BlLmludml0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkbWREaWFsb2cuc2hvdyh7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2ludml0ZS1mcmllbmRzL2ludml0ZS1mcmllbmRzLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0ludml0ZUZyaWVuZHNDdHJsJyxcbiAgICAgICAgICAgIHNjb3BlOiAkc2NvcGVcbiAgICAgICAgfSk7XG4gICAgfVxuICAgICRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgQXV0aFNlcnZpY2UubG9nb3V0KClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgJHNjb3BlLmRhc2hCb2FyZCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICRzdGF0ZS5nbygndS5kYXNoJylcbiAgICB9XG59KVxuIiwiYXBwLmZhY3RvcnkoJ1VzZXJGYWN0b3J5JywgZnVuY3Rpb24oJHN0YXRlLCAkaHR0cCl7XG5cbiAgICBsZXQgVXNlckZhY3RvcnkgPSB7fTtcblxuICAgIFVzZXJGYWN0b3J5LmdldEFsbFVzZXJuYW1lcyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiSW4gZ2V0IEFsbCBVc2VybmFtZXNcIilcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCgnYXBpL3VzZXIvYWxsVXNlcm5hbWVzJylcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24odXNlck5hbWVzKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmV0dXJuZWQgZnJvbSBnZXQgYWxsIHVzZXJOYW1lcyB3aXRoOlwiLCB1c2VyTmFtZXMuZGF0YSlcbiAgICAgICAgICAgIHJldHVybiB1c2VyTmFtZXMuZGF0YTtcbiAgICAgICAgfSlcbiAgICB9XG4gICAgVXNlckZhY3RvcnkuZ2V0VXNlckluZm8gPSBmdW5jdGlvbihpZCl7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdXNlci8nICsgaWQpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgICAgICAgcmV0dXJuIHVzZXIuZGF0YVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIFVzZXJGYWN0b3J5LmNyZWF0ZU5ld1VzZXIgPSBmdW5jdGlvbihzaWdudXBJbmZvKXtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9zaWdudXAnLCBzaWdudXBJbmZvKVxuICAgICAgICAudGhlbihmdW5jdGlvbihuZXdVc2VyKXtcbiAgICAgICAgICAgIHJldHVybiBuZXdVc2VyLmRhdGEudXNlcjtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBVc2VyRmFjdG9yeS51cGRhdGVVc2VyID0gZnVuY3Rpb24oaWQsIG5ld1VzZXJJbmZvKXtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dCgnL2FwaS91c2VyLycraWQsIG5ld1VzZXJJbmZvKVxuICAgICAgICAudGhlbihmdW5jdGlvbih1cGRhdGVkVXNlcil7XG4gICAgICAgICAgICByZXR1cm4gdXBkYXRlZFVzZXIuZGF0YVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIFVzZXJGYWN0b3J5LmF1dG9jb21wbGV0ZSA9IGZ1bmN0aW9uKHN0cil7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdXNlci9pbnZpdGUvJytzdHIpXG4gICAgICAgIC50aGVuKHVzZXJzPT51c2Vycy5kYXRhKTtcbiAgICB9XG5cbiAgICAgICAgcmV0dXJuIFVzZXJGYWN0b3J5O1xufSlcbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3UnLCB7XG4gICAgICAgIHVybDogJy91Lzp1c2VySWQnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3VzZXIvdXNlci5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1VzZXJDdHJsJyxcbiAgICAgICAgZGF0YToge2F1dGhlbnRpY2F0ZTogdHJ1ZX0sXG4gICAgICAgIHJlc29sdmU6e1xuICAgICAgICAgICAgdXNlcnNHYW1lczogZnVuY3Rpb24oJHN0YXRlUGFyYW1zLCBHYW1lRmFjdG9yeSwgQXV0aFNlcnZpY2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiBBdXRoU2VydmljZS5nZXRMb2dnZWRJblVzZXIoKS50aGVuKHVzZXI9PntcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEdhbWVGYWN0b3J5LmdldFVzZXJzR2FtZXModXNlci5pZCl9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1c2VyIDogZnVuY3Rpb24oJHN0YXRlUGFyYW1zLCBBdXRoU2VydmljZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEF1dGhTZXJ2aWNlLmdldExvZ2dlZEluVXNlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59KTtcbiIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3VzZXJHYW1lRGV0YWlsJywge1xuICAgIHVybDogJy9nYW1lL3VzZXInLFxuICAgIHRlbXBsYXRlVXJsOiAnanMvdXNlci1nYW1lLWRldGFpbC91c2VyLWdhbWUtZGV0YWlsLmh0bWwnLFxuICAgIGNvbnRyb2xsZXI6ICdVc2VyR2FtZUN0cmwnXG4gIH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdVc2VyR2FtZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRtZFNpZGVuYXYsICRtZE1lZGlhKSB7XG4gICRzY29wZS5vcGVuTGVmdE1lbnUgPSBmdW5jdGlvbigpIHtcbiAgICAgICRtZFNpZGVuYXYoJ2xlZnQnKS50b2dnbGUoKVxuICB9XG4gICRzY29wZS5tZW51SXRlbXMgPSBbe1xuICAgICAgbmFtZTogXCJLZWVwIEFwYXJ0bWVudCBQSEEgQ2xlYW5cIlxuICB9LCB7XG4gICAgICBuYW1lOiBcIkdhbWUyXCJcbiAgfSwge1xuICAgICAgbmFtZTogXCJHYW1lM1wiXG4gIH0sIHtcbiAgICAgIG5hbWU6IFwiR2FtZTRcIlxuICB9LHtcbiAgICAgIG5hbWU6IFwiR2FtZTVcIlxuICB9XTtcbiAgJHNjb3BlLnRhc2tzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgJHNjb3BlLnRhc2tzLnB1c2goe25hbWU6ICdUYXNrJywgcG9pbnRzOiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApICsgMSksIHRpbWU6IChuZXcgRGF0ZShuZXcgRGF0ZSgpIC0gKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDFlOSkgKyAxKSkudG9TdHJpbmcoKS5zcGxpdChcIiBcIikuc2xpY2UoMCw1KS5qb2luKFwiIFwiKSl9KTtcbiAgfVxuICAkc2NvcGUudG90YWxQb2ludHMgPSAkc2NvcGUudGFza3MucmVkdWNlKChwcmV2LCBjdXJyKSA9PiBwcmV2ICsgY3Vyci5wb2ludHMsIDApO1xuICBjb25zb2xlLmxvZygkc2NvcGUudGFza3MpO1xuICAkc2NvcGUuZWxpcHNlcyA9ICgkc2NvcGUubWVudUl0ZW1zLmxlbmd0aD40KTtcbiAgY29uc29sZS5sb2coJHNjb3BlLmVsaXBzZXMpO1xufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
