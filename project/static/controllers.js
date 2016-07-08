/**
 * Created by mark on 7/6/16.
 */
angular.module('todoApp').controller('loginController',
    ['$scope', '$rootScope', '$location', 'AUTH_EVENTS', 'AuthService',
        function ($scope, $rootScope, $location, AUTH_EVENTS, AuthService) {

            $scope.login = function () {

                // initial values
                $scope.error = false;
                $scope.disabled = true;

                // call login from service
                AuthService.login($scope.loginForm.email, $scope.loginForm.password)
                // handle success
                    .then(function () {
                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                        $location.path('/');
                        $scope.disabled = false;
                        $scope.loginForm = {};
                    })
                    // handle error
                    .catch(function () {
                        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                        $scope.error = true;
                        $scope.errorMessage = "Invalid username and/or password";
                        $scope.disabled = false;
                        $scope.loginForm = {};
                    });

            };
        }]);

angular.module('todoApp').controller('logoutController',
    ['$scope', '$rootScope', '$location', 'AUTH_EVENTS', 'AuthService',
        function ($scope, $rootScope, $location, AUTH_EVENTS, AuthService) {

            $scope.logout = function () {

                // call logout from service
                AuthService.logout()
                    .then(function () {
                        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                        $location.path('/login');
                    });

            };

        }]);

angular.module('todoApp').controller('registerController',
    ['$scope', '$location', 'AuthService',
        function ($scope, $location, AuthService) {

            $scope.register = function () {

                // initial values
                $scope.error = false;
                $scope.disabled = true;

                // call register from service
                AuthService.register(
                    $scope.registerForm.email,
                    $scope.registerForm.password,
                    $scope.registerForm.username
                )
                // handle success
                    .then(function () {
                        $location.path('/login');
                        $scope.disabled = false;
                        $scope.registerForm = {};
                    })
                    // handle error
                    .catch(function () {
                        $scope.error = true;
                        $scope.errorMessage = "Something went wrong!";
                        $scope.disabled = false;
                        $scope.registerForm = {};
                    });

            };

        }]);

todoApp.controller("mainController", [
    '$scope',
    '$http',
    function ($scope, $http) {
        $scope.tasks = [{content: "asdf"}, {content: "hello"}];
        $scope.newtask = "";
        $scope.retrieveNr = 10;
        $scope.addTask = function () {
            if (!$scope.newtask) {
                return
            } else {
                $http({
                    url: '/add',
                    method: "POST",
                    data: {
                        content: $scope.newtask,
                        duedate: 2015
                    } //TODO: add input date
                }).then(function (response) {
                    $scope.retrieveLastNItems($scope.retrieveNr);
                    $scope.newtask = ""
                }, function (error) {
                    console.log(error)
                })
            }
            $scope.newtask = ""
        };

        // TODO: get n tasks only
        $scope.retrieveLastNItems = function (n) {
            $http({
                method: 'POST',
                url: '/retrieve',
                data: {
                    numTasks: $scope.retrieveNr
                }
            }).then(function (response) {
                $scope.tasks = response.data;
            }, function (error) {
                console.log(error);
            });
        };

        $scope.retrieveLastNItems($scope.retrieveNr)
    }
]);

todoApp.controller("navController", [
    '$scope',
    '$rootScope',
    'AUTH_EVENTS',
    'AuthService',
    function ($scope, $rootScope, AUTH_EVENTS, AuthService) {
        $scope.loggedIn = AuthService.isLoggedIn();
        $rootScope.$on(AUTH_EVENTS.loginSuccess, function (next, current) {
            $scope.loggedIn = true;
        });
        $rootScope.$on(AUTH_EVENTS.logoutSuccess, function (next, current) {
            $scope.loggedIn = false;
        })
    }
]);