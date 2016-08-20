function BoardController($scope, $timeout, AuthService, DatetimeService, TaskService, TASK_EVENTS) {
    var ctrl = this;
    $scope.currentBoard = ctrl.board;
    $scope.tasks = ctrl.tasks;
    console.log($scope.currentBoard, $scope.tasks);
}

angular.module('todoApp')
    .controller('BoardController', BoardController);

angular.module('todoApp')
    .component('board', {
        templateUrl: 'static/partials/board.html',
        controller: 'BoardController',
        controllerAs: 'ctrl',
        bindings: {
            board: '=',
            tasks: '='
        }
    });