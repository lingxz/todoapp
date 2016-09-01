function SubtaskController ($scope, TaskService) {
    var subtask = $scope.ctrl.subtask;

    $scope.markAsDone = function () {
        promise = TaskService.markAsDone(subtask);
        promise.then(function (data) {
            console.log(data);
            subtask.done = data.done
        });
    };
}


angular.module('todoApp')
    .controller('SubtaskController', SubtaskController);

angular.module('todoApp')
    .component('subtask', {
        templateUrl: 'static/partials/subtask.html',
        controller: 'SubtaskController',
        controllerAs: 'ctrl',
        bindings: {
            subtask: '='
        }
    });

