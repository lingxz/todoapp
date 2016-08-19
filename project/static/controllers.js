/**
 * Created by mark on 7/6/16.
 */
angular.module('todoApp').controller('loginController',
    ['$scope', '$location', 'AuthService',
        function ($scope, $location, AuthService) {

            $scope.login = function () {

                // initial values
                $scope.error = false;
                $scope.disabled = true;

                // call login from service
                AuthService.login($scope.loginForm.email, $scope.loginForm.password)
                // handle success
                    .then(function () {
                        $location.path('/');
                        $scope.disabled = false;
                        $scope.loginForm = {};
                    })
                    // handle error
                    .catch(function () {
                        $scope.error = true;
                        $scope.errorMessage = "Invalid username and/or password";
                        $scope.disabled = false;
                        $scope.loginForm = {};
                    });

            };
        }]);

angular.module('todoApp').controller('logoutController',
    ['$scope', '$location', 'AuthService',
        function ($scope, $location, AuthService) {

            $scope.logout = function () {

                // call logout from service
                AuthService.logout()
                    .then(function () {
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
    'TaskService',
    'USER_PREFERENCES',
    'TASK_EVENTS',
    'hotkeys',
    function ($scope, $rootScope, $http, AuthService, TaskService, USER_PREFERENCES, TASK_EVENTS, hotkeys) {
        $scope.newtask = "";

        /* ----- For the boards ----- */
        $scope.taskGroup = -1;
        $scope.greaterThan = function (prop, val) {
            return function (item) {
                return item[prop] > val;
            }
        };

        $scope.taskGroupFilter = function () {
            return function (item) {
                if ($scope.taskGroup >= 0) {
                    return item['group'] == $scope.taskGroup;
                }
                return true
            }
        };

        $scope.changeBoard = function(val) {
            if ($scope.taskGroup === val) {
                $scope.taskGroup = -1
            } else {
                $scope.taskGroup = val;
            }
        };

        /* ----- End boards ----- */

        /* ----- Scrollbar config ----- */
        $scope.scrollBarsConfig = {
            autoHideScrollbar: false,
            theme: 'minimal',
            advanced:{
                updateOnContentResize: true
            },
            scrollInertia: 50
        };

        $scope.$on(TASK_EVENTS.refreshTaskList, function (next, current) {
            $scope.retrieveItems()
        });

        // $scope.showCompleted = AuthService.getUserPreference();  //TODO: need to change default

        // AuthService.getUserPreference();
        $scope.$watch(AuthService.retrieveShowTaskPref,
            function (newval, oldval) {
                $scope.showCompleted = newval
            }
        );

        $scope.retrieveItems = function () {
            promise = TaskService.retrieveItems();
            promise.then(function (response) {
                $scope.tasks = response;
            });
        };

        $scope.retrieveItems();

        $scope.deleteTask = function (task) {
            promise = TaskService.deleteTask(task);
            promise.then(function (response) {
                $scope.$emit(TASK_EVENTS.refreshTaskList)
            })
        };

        $scope.currentTask = TaskService.getCurrentTask();
        $scope.$watch(TaskService.getCurrentTask,
            function (new_task, old_task) {
                $scope.currentTask = new_task
            }
        );

        $scope.makeSubTask = function (task) {
            var prev_id;
            var promise = TaskService.getPrevSibling(task);
            promise.then(function (response) {
                prev_id = response.id;
                var promise2 = TaskService.makeSubTask(task, prev_id);
                promise2.then(function (response) {
                    $scope.$emit(TASK_EVENTS.refreshTaskList);
                })
            })
        };

        hotkeys.bindTo($scope)
            .add({
                combo: 'ctrl+shift+backspace',
                description: 'delete this task',
                allowIn: ['TEXTAREA'],
                callback: function (event, keypress) {
                    $scope.deleteTask($scope.currentTask)
                }
            });

        hotkeys.bindTo($scope)
            .add({
                combo: 'tab',
                description: 'make this a sub task',
                allowIn: ['TEXTAREA'],
                callback: function (event, keypress) {
                    $scope.makeSubTask($scope.currentTask)
                }
            });
    }
]);
