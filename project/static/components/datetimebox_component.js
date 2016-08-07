/**
 * Created by mark on 7/17/16.
 */

function dateTimeBoxController($scope, $http, DatetimeService, AuthService, TaskService, TASK_EVENTS) {

    $scope.visibility = "hidden";
    $scope.getToday = function () {
        return moment();
    };

    $scope.cur_task = null;

    $scope.showBox = function (cur_pos) {
        $scope.posx = cur_pos[0];
        $scope.posy = cur_pos[1];
        $scope.visibility = "show";
    };

    $scope.closeBox = function () {
        $scope.visibility = "hidden"
    };

    $scope.$watch(DatetimeService.getCursorPos,
        function (cur_pos, oldvalue) {
            if (cur_pos) {
                var task_id = DatetimeService.getCurTask();
                if ($scope.visibility == "hidden") {
                    $scope.showBox(cur_pos);
                    $scope.cur_task = task_id
                } else if ($scope.visibility === "show" && task_id === $scope.cur_task) {
                    $scope.closeBox()
                }
            }
        });

    $scope.chosenTime = null;
    $scope.$watch('chosenTime', function () {
        if ($scope.chosenTime) {
            // close box when user selects a time
            $scope.closeBox();
            $scope.setDate($scope.cur_task, $scope.chosenTime);
        }
    });

    $scope.setDate = function (task_id, newDate) { // should i edit task date here or from task controller?
        var promise = TaskService.editDate(task_id, newDate);
        promise.then(function () {
            $scope.$emit(TASK_EVENTS.refreshTaskList)
        });
    };

    $scope.beforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {
        var minDate = moment().startOf($view);
        for (var i = 0; i < $dates.length; i++){
            if (minDate.valueOf() > $dates[i].localDateValue()) {
                $dates[i].selectable = false;
            }
        }
    };
}

angular.module('todoApp')
    .controller('dateTimeBoxController', dateTimeBoxController);

angular.module('todoApp')
    .component('datetimebox', {
        templateUrl: 'static/partials/datetimebox.html',
        controller: 'dateTimeBoxController',
        controllerAs: 'ctrl'
    });