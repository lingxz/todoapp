/**
 * Created by mark on 7/6/16.
 */

function TaskController($scope, $http, AuthService) {
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
