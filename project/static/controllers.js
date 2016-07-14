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
    '$rootScope',
    '$http',
    'AuthService',
    'USER_PREFERENCES',
    'TASK_EVENTS',
    function ($scope, $rootScope, $http, AuthService, USER_PREFERENCES, TASK_EVENTS) {
        $scope.tasks = [{content: "asdf"}, {content: "hello"}];
        $scope.newtask = "";
        $scope.retrieveNr = 10;

        $scope.$on(TASK_EVENTS.addNewEmptyTask, function (next, current) {
            $scope.addTask("");
        });

        $scope.addTask = function (content) {
            $http({
                url: '/add',
                method: "POST",
                headers: {Authorization: 'Bearer ' + AuthService.getToken()},
                data: {
                    content: content,
                    duedate: 2015,
                    user_id: AuthService.getCurrentUserID()
                } //TODO: add input date
            }).then(function (response) {
                $scope.retrieveLastNItems($scope.retrieveNr);
                $scope.newtask = ""
            }, function (error) {
                console.log(error)
            });
            $scope.newtask = ""
        };

        // TODO: get n tasks only
        $scope.retrieveLastNItems = function (n) {
            $http({
                method: 'POST',
                url: '/retrieve',
                headers: {Authorization: 'Bearer ' + AuthService.getToken()},
                data: {
                    numTasks: $scope.retrieveNr
                }
            }).then(function (response) {
                $scope.tasks = response.data;
            }, function (error) {
                console.log(error);
            });
        };

        $scope.showCompleted = true;  //TODO: need to change default
        $rootScope.$on(USER_PREFERENCES.showCompletedTasks, function (next, current) {
            $scope.showCompleted = true;
        });
        $rootScope.$on(USER_PREFERENCES.hideCompletedTasks, function (next, current) {
            $scope.showCompleted = false;
        });

        $scope.retrieveLastNItems($scope.retrieveNr)
    }
]);
