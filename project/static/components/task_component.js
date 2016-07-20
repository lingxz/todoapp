/**
 * Created by mark on 7/6/16.
 */

function TaskController($scope, $http, $timeout, AuthService, DatetimeService, keyboardManager, TASK_EVENTS, hotkeys) {
    var task = $scope.ctrl.task;
    $scope.isCollapsed = true;
    $scope.markAsDone = function () {
        $http({
            method: 'POST',
            url: '/markdone',
            headers: {Authorization: 'Bearer ' + AuthService.getToken()},
            data: {
                id: task.id
            }
        }).then(function (response) {
            task.done = response.data.done;
        }, function (error) {
            console.log(error);
        });
    };

    var timeout = null;
    var saveTask = function (newVal) {
        var task = $scope.ctrl.task;
        $http({
            method: 'POST',
            url: '/edit_task',
            headers: {Authorization: 'Bearer ' + AuthService.getToken()},
            data: {
                id: task.id,
                content: newVal
            }
        })
    };

    var debounceSaveUpdates = function (newVal, oldVal) {
        if (newVal != oldVal) {
            if (timeout) {
                $timeout.cancel(timeout)
            }
            timeout = $timeout(saveTask(newVal), 1000); // saves updates every 1 second
        }
    };
    $scope.$watch('ctrl.task.content', debounceSaveUpdates);

    $scope.callDateTimePicker = function (event) {
        cur_pos = [event.originalEvent.pageX - 300, event.originalEvent.pageY - 350];
        DatetimeService.setCursorPos(cur_pos, task.id);
    };

    $scope.removeDate = function () {
        var task = $scope.ctrl.task;
        task.due_date = null;
        $http({
            method: 'POST',
            url: '/remove_date',
            headers: {Authorization: 'Bearer ' + AuthService.getToken()},
            data: {
                id: task.id
            }
        })
    };

    $scope.newTask = function () {
        // only fire event to parent scope
        $scope.$emit(TASK_EVENTS.addNewEmptyTask)
    };

    $scope.deleteTask = function () {
        var task = $scope.ctrl.task;
        console.log($scope);
        $http({
            method: 'POST',
            url: '/delete_task',
            headers: {Authorization: 'Bearer ' + AuthService.getToken()},
            data: {
                id: task.id
            }
        }).then(function (response) {
            $scope.$emit(TASK_EVENTS.refreshTaskList)
        })
    };


    hotkeys.bindTo($scope)
        .add({
            combo: 'ctrl+shift+backspace',
            description: 'delete this task',
            callback: $scope.deleteTask
        });
}

angular.module('todoApp')
    .component('task', {
        templateUrl: 'static/partials/task.html',
        controller: TaskController,
        controllerAs: 'ctrl',
        bindings: {
            task: '='
        }
    });


angular.module('todoApp')
    .directive("contenteditable", function () {
        return {
            restrict: "A",
            require: "ngModel",
            link: function (scope, element, attrs, ngModel) {

                ngModel.$render = function () {
                    element.html(ngModel.$viewValue || "");
                };

                element.on("blur keyup change", function () {
                    scope.$apply(read);
                });
                ngModel.$render();

                function read() {
                    var html = element.html();
                    // When we clear the content editable the browser leaves a <br> behind
                    // If strip-br attribute is provided then we strip this out
                    if (attrs.stripBr && html == '<br>') {
                        html = '';
                    }
                    ngModel.$setViewValue(html);
                }
            }
        };
    });