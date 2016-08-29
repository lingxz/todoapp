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
    'BoardService',
    'USER_PREFERENCES',
    'TASK_EVENTS',
    'hotkeys',
    function ($scope, $rootScope, $http, AuthService, TaskService, BoardService, USER_PREFERENCES, TASK_EVENTS, hotkeys) {
        $scope.newtask = "";

        // For boards
        $scope.currentBoardID = -1;
        $scope.curBoard = null;
        $scope.filteredTasks = null;

        /* ----- Scrollbar config ----- */
        $scope.scrollBarsConfig = {
            autoHideScrollbar: false,
            theme: 'minimal',
            advanced: {
                updateOnContentResize: true
            },
            scrollInertia: 50
        };

        $scope.$on(TASK_EVENTS.refreshTaskList, function (next, current) {
            $scope.retrieveItems()
        });

        $scope.$watch(AuthService.retrieveShowTaskPref,
            function (newval, oldval) {
                $scope.showCompleted = newval
            }
        );

        $scope.processResponse = function (response) {
            $scope.tasks = response.tasks;
            $scope.firstBoard = response.firstBoard;
            $scope.lastBoard = response.lastBoard;
            $scope.curBoard = response.currentBoard;
            $scope.filteredTasks = response.filteredTasks;
            $scope.currentBoardID = response.currentBoardID;
        };

        $scope.retrieveItems = function () {
            var promise = BoardService.retrieveItems();
            promise.then(function (response) {
                $scope.processResponse(response);
            });
        };

        $scope.retrieveItems();

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

        /* ----- For the boards ----- */

        // Used for display filtering
        $scope.greaterThan = function (prop, val) {
            return function (item) {
                return item[prop] > val;
            }
        };

        // Used for display filtering
        $scope.taskGroupFilter = function () {
            return function (item) {
                if ($scope.currentBoardID >= 0) {
                    return item['group'] == $scope.currentBoardID;
                }
                return true
            }
        };

        $scope.changeBoard = function (task) {
            var response = BoardService.changeBoard(task);
            $scope.processResponse(response);
        };

        $scope.addTaskToBoard = function () {
            var promise = BoardService.addTaskToBoard();
            promise.then(function (response) {
                $scope.processResponse(response);
            });
        };

        $scope.addNewBoard = function () {
            var promise = BoardService.addNewBoard();
            promise.then(function (response) {
                $scope.processResponse(response);
            });
        };

        $scope.deleteBoard = function () {
            var promise = BoardService.deleteBoard();
            promise.then(function (response) {
                $scope.processResponse(response);
            });
        };
        /* ----- End boards ----- */
    }
]);

todoApp.controller('deleteTaskModalController', function ($scope, $uibModalInstance) {
    $scope.yes = function () {
        $uibModalInstance.close()
    };
    $scope.no = function () {
        $uibModalInstance.dismiss()
    }
});

