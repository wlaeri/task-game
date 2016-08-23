'use strict';
window.app = angular.module('Gamr', [
    'fsaPreBuilt',
    'ui.router',
    'ui.bootstrap',
    'ngAnimate',
    'ngMaterial',
    'ngAria',
    'ngMaterialDatePicker',
    'nvd3'
]);

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

app.config(function($mdThemingProvider){
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
    $mdThemingProvider
        .definePalette('GamrPrimary',
                        customPrimary);

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
    $mdThemingProvider
        .definePalette('GamrAccent',
                        customAccent);

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
    $mdThemingProvider
        .definePalette('GamrWarn',
                        customWarn);

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
    $mdThemingProvider
        .definePalette('GamrBackground',
                        customBackground);

   $mdThemingProvider.theme('default')
       .primaryPalette('GamrPrimary', {
        'default': '500',
        'hue-2': '600'
       })
       .accentPalette('GamrAccent')
       .warnPalette('GamrWarn')
       .backgroundPalette('GamrBackground')
});

// This app.run is for controlling access to specific states.
app.run(function ($rootScope, AuthService, $state) {

    // The given state requires an authenticated user.
    var destinationStateRequiresAuth = function (state) {
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
