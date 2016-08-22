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

        // For boards
        $scope.curBoardID = -1;
        $scope.curBoard = null;

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

        // $scope.showCompleted = AuthService.getUserPreference();  //TODO: need to change default

        // AuthService.getUserPreference();
        $scope.$watch(AuthService.retrieveShowTaskPref,
            function (newval, oldval) {
                $scope.showCompleted = newval
            }
        );

        // To pass the correct data to the board component
        $scope.filteredTasks = null;
        $scope.taskFilter = function () {
            var res = [];

            for (var i in $scope.tasks) {
                if ($scope.curBoardID === -1) {
                    if ($scope.tasks[i].depth > 0) res.push($scope.tasks[i]);
                } else {
                    if ($scope.tasks[i].rgt < $scope.curBoard.rgt && $scope.tasks[i].lft > $scope.curBoard.lft) {
                        res.push($scope.tasks[i]);
                    }
                }
            }
            $scope.filteredTasks = res;
        };

        $scope.retrieveItems = function () {
            promise = TaskService.retrieveItems();
            promise.then(function (response) {
                $scope.tasks = response;

                // Find the very first board (for display)
                $scope.firstBoard = $scope.tasks[0];

                // Find the last board (for appending)
                for (var i in $scope.tasks) {
                    var curTask = $scope.tasks[i];
                    if (curTask.depth == 0) {
                        $scope.lastBoard = curTask;
                        console.log(curTask.group, $scope.curBoardID);
                        if (curTask.group === $scope.curBoardID) {
                            $scope.curBoard = curTask;
                        }
                    }
                }

                $scope.taskFilter();
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

        /* ----- For the boards ----- */
        $scope.greaterThan = function (prop, val) {
            return function (item) {
                return item[prop] > val;
            }
        };

        $scope.taskGroupFilter = function () {
            return function (item) {
                if ($scope.curBoardID >= 0) {
                    return item['group'] == $scope.curBoardID;
                }
                return true
            }
        };

        $scope.changeBoard = function (task) {
            var val = task.group;
            if ($scope.curBoardID === val) {
                $scope.curBoardID = -1;
                $scope.curBoard = null;
            } else {
                $scope.curBoardID = val;
                $scope.curBoard = task;
            }
            $scope.taskFilter();
        };

        $scope.addTaskToBoard = function () {
            var parent_id;
            if ($scope.curBoard == null) {
                parent_id = $scope.firstBoard.id;
            } else {
                parent_id = $scope.curBoard.id;
            }
            var promise = TaskService.addSubTask(parent_id);
            promise.then(function (response) {
                $scope.$emit(TASK_EVENTS.refreshTaskList);
            })
        };

        $scope.addNewBoard = function () {
            // console.log($scope.lastBoard);
            var promise = TaskService.addTask($scope.lastBoard, "NEW BOARD");
            promise.then(function (response) {
                $scope.$emit(TASK_EVENTS.refreshTaskList);
                // Basically need to delay the new board until the retrieve completes
            });
        };

        $scope.deleteBoard = function () {
            console.log("DELETE BOARD", $scope.curBoardID);
            if ($scope.curBoardID == -1) return;
            var promise = TaskService.deleteTask($scope.curBoard);
            promise.then(function (response) {
                $scope.$emit(TASK_EVENTS.refreshTaskList);
                // Again, similar functionality is needed here
            })
        };
        /* ----- End boards ----- */


        hotkeys.bindTo($scope)
            .add({
                combo: 'ctrl+shift+backspace',
                description: 'delete this task',
                allowIn: ['TEXTAREA'],
                callback: function (event, keypress) {
                    $scope.deleteTask($scope.currentTask)
                }
            });

        // hotkeys.bindTo($scope)
        //     .add({
        //         combo: 'tab',
        //         description: 'make this a sub task',
        //         allowIn: ['TEXTAREA'],
        //         callback: function (event, keypress) {
        //             $scope.makeSubTask($scope.currentTask)
        //         }
        //     });
    }
]);
