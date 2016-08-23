/**
 * Created by mark on 7/6/16.
 */

function TaskController($scope, $timeout, $uibModal, AuthService, DatetimeService, TaskService, TASK_EVENTS) {
    // Extract from controller
    var ctrl = this;
    $scope.task = ctrl.task;
    var task = ctrl.task;

    // Control offsets
    $scope.taskDepth = task.depth * 1.5;
    $scope.taskWidth = 100 - $scope.taskDepth;

    $scope.isCollapsed = false;
    $scope.isFlipped = false;

    $scope.markAsDone = function () {
        promise = TaskService.markAsDone(task);
        promise.then(function (data) {
            task.done = data.done
        });
    };

    var timeout = null;
    var saveTask = function (newVal) {
        TaskService.editTask(task, newVal);
    };

    var debounceSaveUpdates = function (newVal, oldVal) {
        if (newVal != oldVal) {
            if (timeout) {
                $timeout.cancel(timeout)
            }
            timeout = $timeout(saveTask(newVal), 1000); // saves updates every 1 second
        }
    };
    $scope.$watch('task.content', debounceSaveUpdates);

    $scope.callDateTimePicker = function (event) {
        var el = event.target;
        var viewportOffset = el.getBoundingClientRect();
        var left = viewportOffset.left;
        var top = viewportOffset.top;
        var bottom = viewportOffset.bottom;
        if (top < window.innerHeight / 2) { // button in top half of window
            cur_pos = [left - 330, bottom - 70]
        } else {
            cur_pos = [left - 330, top - 330]
        }
        DatetimeService.setCursorPos(cur_pos, task.id);
    };

    $scope.removeDate = function () {
        promise = TaskService.removeDate(task);
        promise.then(function () {
            task.due_date = null
        })
    };

    $scope.newTask = function () {
        promise = TaskService.addTask(task);
        promise.then(function () {
            $scope.$emit(TASK_EVENTS.refreshTaskList);
            $scope.newtask = ""
        }, function(error) {
            console.log(error)
        });
        $scope.newtask = "";
    };

    $scope.deleteTask = function () {
        promise = TaskService.deleteTask(task);
        promise.then(function (response) {
            $scope.$emit(TASK_EVENTS.refreshTaskList);
            Materialize.toast('Task deleted', 1000);
        })
    };

    $scope.setCurrentTask = function () {
        TaskService.setCurrentTask(task)
    };

    // $scope.showCompleted = AuthService.getUserPreference();
    $scope.$watch(AuthService.retrieveShowTaskPref,
        function (newval, oldval) {
            $scope.showCompleted = newval
        }
    );

    $scope.$watch('task.due_date', function (new_date) {
        if(new_date) {
            var dateObj = new Date(new_date);
            var dateWrapper = moment(dateObj);
            $scope.formattedDate = dateWrapper.format('MMM DD')
        }
    });

    $scope.openDeleteTaskModal = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'static/partials/delete_task_modal.html',
            controller: 'deleteTaskModalController'
        });

        modalInstance.result.then(function () {
            var content = task.content;
            $scope.deleteTask();
        })
    };

    /*for card flipping*/
    $scope.flipCard = function () {
        $scope.isFlipped = !$scope.isFlipped
    };
    /*end card flipping*/
}

angular.module('todoApp')
    .controller('TaskController', TaskController);

angular.module('todoApp')
    .component('task', {
        templateUrl: 'static/partials/task.html',
        controller: 'TaskController',
        controllerAs: 'ctrl',
        bindings: {
            task: '='
        }
    });
