var todoApp = angular.module("todoApp", [
    'ngRoute',
    'ngAnimate',
    'ngAria',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'cfp.hotkeys',
    'monospaced.elastic',
    'angular.filter'
]);

// todoApp.config(['$interpolateProvider', function ($interpolateProvider) {
//     $interpolateProvider.startSymbol('{[');
//     $interpolateProvider.endSymbol(']}');
// }]);

todoApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'static/partials/show_tasks.html',
            controller: 'mainController',
            access: {restricted: true}
        })
        .when('/login', {
            templateUrl: 'static/partials/login.html',
            controller: 'loginController',
            access: {restricted: false}
        })
        .when('/logout', {
            controller: 'logoutController',
            access: {restricted: true}
        })
        .when('/register', {
            templateUrl: 'static/partials/register.html',
            controller: 'registerController',
            access: {restricted: false}
        })
        .when('/one', {
            template: '<h1>This is page one!</h1>',
            access: {restricted: true}
        })
        .when('/two', {
            template: '<h1>This is page two!</h1>',
            access: {restricted: false}
        })
        .otherwise({
            redirectTo: '/'
        });
});

todoApp.run(function ($rootScope, $location, $route, AuthService) {
    $rootScope.$on('$routeChangeStart',
        function (event, next, current) {
            if (next.access) {
                if (next.access.restricted && !AuthService.isLoggedIn()) {
                    $location.path('/login');
                    $route.reload();
                }
            }
        });
});
// });

todoApp.run(['$route', function ($route) {
    $route.reload();
}]);

