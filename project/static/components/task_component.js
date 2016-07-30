/**
 * Created by mark on 7/6/16.
 */

function TaskController($scope, $http, $timeout, AuthService, DatetimeService, TaskService, TASK_EVENTS) {
    var task = $scope.task;
    $scope.isCollapsed = false;
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
        // $scope.$emit(TASK_EVENTS.addNewEmptyTask)
            $http({
                url: '/add',
                method: "POST",
                headers: {Authorization: 'Bearer ' + AuthService.getToken()},
                data: {
                    content: "",
                    user_id: AuthService.getCurrentUserID(),
                    prev_task: task.id
                } //TODO: add input date
            }).then(function (response) {
                $scope.$emit(TASK_EVENTS.refreshTaskList);
                $scope.newtask = ""
            }, function (error) {
                console.log(error)
            });
            $scope.newtask = ""
    };

    $scope.setCurrentTask = function(){
        TaskService.setCurrentTask(task)
    }


}


angular.module('todoApp').directive("task", function(RecursionHelper) {
    return {
        restrict: "E",
        scope: {task: '='},
        templateUrl: 'static/partials/task.html',
        controller: TaskController,
        compile: function(element) {
            return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn){
                // Define your normal link function here.
                // Alternative: instead of passing a function,
                // you can also pass an object with
                // a 'pre'- and 'post'-link function.
            });
        }
    };
});


//angular.module('todoApp')
//    .component('task', {
//        templateUrl: 'static/partials/task.html',
//        controller: TaskController,
//        controllerAs: 'ctrl',
//        bindings: {
//            task: '='
//        }
//    });






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