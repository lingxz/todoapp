/**
 * Created by mark on 7/6/16.
 */

function TaskController($scope, $timeout, AuthService, DatetimeService, TaskService, TASK_EVENTS) {
    // Extract from controller
    var ctrl = this;
    $scope.task = ctrl.task;
    var task = ctrl.task;

    // Control offsets
    $scope.taskDepth = task.depth * 1.5;
    $scope.taskWidth = 100 - $scope.taskDepth;

    $scope.isCollapsed = false;

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
    })
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