function BoardController($scope, $timeout, AuthService, DatetimeService, TaskService, TASK_EVENTS) {
    var ctrl = this;
    $scope.curBoard = ctrl.board;
    $scope.tasks = ctrl.tasks;
    $scope.showBoard = false;

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
        $scope.showBoard = ($scope.curBoard !== null);
    };

    /*---scrollbar config-----*/
    $scope.scrollBarsConfig = {
        autoHideScrollbar: false,
        theme: 'minimal-dark',
        advanced: {
            updateOnContentResize: true
        },
        scrollInertia: 50
    };

    // Edit the title
    var timeout = null;
    var saveTask = function (newVal) {
        if ($scope.curBoard !== null) {
            TaskService.editTask($scope.curBoard, newVal);
        }
    };

    var debounceSaveUpdates = function (newVal, oldVal) {
        if (newVal != oldVal) {
            if (timeout) {
                $timeout.cancel(timeout)
            }
            timeout = $timeout(saveTask(newVal), 1000); // saves updates every 1 second
        }
    };
    $scope.$watch('curBoard.content', debounceSaveUpdates);
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