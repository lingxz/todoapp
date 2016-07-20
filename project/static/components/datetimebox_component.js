/**
 * Created by mark on 7/17/16.
 */

function dateTimeBoxController($scope, $rootScope, TASK_EVENTS) {
    // TODO: need to make datetimepicker opaque, now it's transparent

    $scope.visibility = "hidden";
    $scope.getToday = function () {
        return moment();
    };

    cur_task = null;
    $scope.$on(TASK_EVENTS.summonDatePicker, function (event, data) {
        if ($scope.visibility === "hidden") {
            $scope.showBox(data.cur_pos);
            cur_task = data.task_id
        } else if ($scope.visibility === "show" && data.task_id === cur_task) {
            // if alarm button is clicked the second time, close box
            $scope.hideBox()
        }
    });

    $scope.showBox = function (cur_position) {
        $scope.posx = cur_pos[0];
        $scope.posy = cur_pos[1];
        $scope.visibility = "show";
    };

    $scope.hideBox = function () {
        $scope.visibility = "hidden"
    }

}

angular.module('todoApp')
    .component('datetimebox', {
        templateUrl: 'static/partials/datetimebox.html',
        controller: dateTimeBoxController,
        controllerAs: 'ctrl'
    });