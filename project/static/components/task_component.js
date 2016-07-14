/**
 * Created by mark on 7/6/16.
 */

function TaskController($scope, $http, $timeout, AuthService, keyboardManager) {
    $scope.isCollapsed = true;
    $scope.markAsDone = function (task) {
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

    $scope.addRow = function () {
        return
    };

    $scope.onTimeSet = function (newTime, oldTime) {
        var task = $scope.ctrl.task;
        // TODO: somewhere here it's sending the time that's one hour earlier, probably something to do with timezone
        // My time has issues as well
        console.log($scope.ctrl);
        $http({
            method: 'POST',
            url: '/edit_date',
            headers: {Authorization: 'Bearer ' + AuthService.getToken()},
            data: {
                id: task.id,
                date: newTime
            }
        }).then(function (response) {
            task.due_date = response.data;
        })
    };

    $scope.getToday = function () {
        var today = moment();
        return today;
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

    // trying the keyboard thing
    $scope.logs = [];

    var addLog = function(label) {
        $scope.logs.push(label);
    };

    // bind ctrl + backspace
    keyboardManager.bind('ctrl+enter', function () {
        addLog('Callback ctrl+enter')
    });

    //TODO: figure out how to actually use this
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
                    console.log(element.html());
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