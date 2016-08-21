function BoardController($scope, $timeout, AuthService, DatetimeService, TaskService, TASK_EVENTS) {
    var ctrl = this;
    $scope.curBoard = ctrl.board;
    $scope.tasks = ctrl.tasks;

    // Pass in data
    this.$onChanges = function (changesObj) {
        if (changesObj.board) {
            $scope.curBoard = changesObj.board.currentValue;
        }
        if (changesObj.tasks) {
            if (changesObj.tasks.currentValue !== null) {
                $scope.tasks = changesObj.tasks.currentValue;
            }
        }
    };
}

angular.module('todoApp')
    .controller('BoardController', BoardController);

angular.module('todoApp')
    .component('board', {
        templateUrl: 'static/partials/board.html',
        controller: 'BoardController',
        controllerAs: 'ctrl',
        bindings: {
            board: '<',
            tasks: '<'
        }
    });