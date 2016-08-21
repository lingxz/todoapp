function BoardController($scope, $timeout, AuthService, DatetimeService, TaskService, TASK_EVENTS) {
    var ctrl = this;
    $scope.currentBoard = ctrl.board;
    $scope.tasks = ctrl.tasks;

    // Pass in data
    this.$onChanges = function (changesObj) {
        if (changesObj.board) {
            $scope.currentBoard = changesObj.board.currentValue;
        }
        if (changesObj.tasks) {
            $scope.tasks = changesObj.tasks;
        }
        console.log($scope.currentBoard, $scope.tasks.currentValue);
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