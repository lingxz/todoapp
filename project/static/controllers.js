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
    'TaskService',
    'USER_PREFERENCES',
    'TASK_EVENTS',
    'hotkeys',
    function ($scope, $rootScope, $http, AuthService, TaskService, USER_PREFERENCES, TASK_EVENTS, hotkeys) {
        $scope.newtask = "";

        $scope.$on(TASK_EVENTS.refreshTaskList, function (next, current) {
            TaskService.retrieveItems()
        });

        // $scope.showCompleted = AuthService.getUserPreference();  //TODO: need to change default

        // AuthService.getUserPreference();
        $scope.$watch(AuthService.retrieveShowTaskPref,
            function (newval, oldval) {
                $scope.showCompleted = newval
            }
        );

        TaskService.retrieveItems();

        $scope.deleteTask = function (task) {
            $http({
                method: 'POST',
                url: '/delete_task',
                headers: {Authorization: 'Bearer ' + AuthService.getToken()},
                data: {
                    user_id: AuthService.getCurrentUserID(),
                    id: task.id
                }
            }).then(function (response) {
                $scope.$emit(TASK_EVENTS.refreshTaskList)
            })
        };


        $scope.currentTask = TaskService.getCurrentTask();
        $scope.$watch(TaskService.getCurrentTask,
            function (new_task, old_task) {
                $scope.currentTask = new_task
            }
        );

        $scope.makeSubTaskHelper = function (task, prev_id) {

            // need to find previous sibling task first
            //
            //index = $scope.tasks.indexOf(task);
            //prev_task = $scope.tasks[index-1];


            $http({
                url: '/add_subtask',
                method: "POST",
                headers: {Authorization: 'Bearer ' + AuthService.getToken()},
                data: {
                    user_id: AuthService.getCurrentUserID(),
                    prev_task_id: prev_id,
                    subtask_id: task.id
                }
            }).then(function (response) {
                $scope.$emit(TASK_EVENTS.refreshTaskList);
            }, function (error) {
                console.log(error)
            });
        };

        $scope.makeSubTask = function (task) {
            // get previous task first
            $http({
                url: '/get_prev_sibling',
                method: "POST",
                headers: {Authorization: 'Bearer ' + AuthService.getToken()},
                data: {
                    user_id: AuthService.getCurrentUserID(),
                    task_id: task.id
                }
            }).then(function (response) {
                prev_id = response.data.id;
                $scope.makeSubTaskHelper(task, prev_id)
            }, function (error) {
                console.log(error)
            });
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
