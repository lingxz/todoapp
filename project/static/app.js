var todoApp = angular.module("todoApp", ['ngRoute']);

// todoApp.config(['$interpolateProvider', function ($interpolateProvider) {
//     $interpolateProvider.startSymbol('{[');
//     $interpolateProvider.endSymbol(']}');
// }]);

todoApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'static/partials/home.html',
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
            AuthService.getUserStatus()
                .then(function () {
                    if (next.access.restricted && !AuthService.isLoggedIn()) {
                        $location.path('/login');
                        $route.reload();
                    }
                });
        });
});

// todoApp.controller("mainController", [
//     '$scope',
//     '$http',
//     function ($scope, $http) {
//         $scope.tasks = [{content: "asdf"}, {content: "hello"}];
//         $scope.newtask = "";
//         $scope.retrieveNr = 10;
//         $scope.addTask = function () {
//             if (!$scope.newtask) {
//                 return
//             } else {
//                 $http({
//                     url: '/add',
//                     method: "POST",
//                     headers: {
//                     'X-CSRFToken': csrftoken
//                     },
//                     data: {
//                         content: $scope.newtask,
//                         duedate: 2015
//                     } //TODO: add input date
//                 }).then(function (response) {
//                     $scope.retrieveLastNItems($scope.retrieveNr);
//                     $scope.newtask = ""
//                 }, function (error) {
//                     console.log(error)
//                 })
//             }
//             $scope.newtask = ""
//         };
//
//         // TODO: get n tasks only
//         $scope.retrieveLastNItems = function (n) {
//             $http({
//                 method: 'POST',
//                 url: '/retrieve',
//                 headers: {
//                     'X-CSRFToken': csrftoken
//                 },
//                 data: {
//                     numTasks: $scope.retrieveNr
//                 }
//             }).then(function (response) {
//                 $scope.tasks = response.data;
//                 console.log("mm", $scope.tasks);
//             }, function (error) {
//                 console.log(error);
//             });
//         };
//
//         $scope.retrieveLastNItems($scope.retrieveNr)
//     }
// ]);

