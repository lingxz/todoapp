/**
 * Created by mark on 7/6/16.
 */

function TaskController($scope, $http, $timeout, AuthService) {
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
    }
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