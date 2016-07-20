/**
 * Created by mark on 7/17/16.
 */

function dateTimeBoxController($scope, $http, DatetimeService, AuthService, TASK_EVENTS) {
    // TODO: need to make datetimepicker opaque, now it's transparent

    $scope.visibility = "hidden";
    $scope.getToday = function () {
        return moment();
    };

    cur_task = null;

    $scope.showBox = function (cur_position) {
        $scope.posx = cur_pos[0];
        $scope.posy = cur_pos[1];
        $scope.visibility = "show";
    };

    $scope.closeBox = function () {
        $scope.visibility = "hidden"
    };

    $scope.$watch(DatetimeService.getCursorPos,
        function (cur_pos, oldvalue) {
            if (cur_pos){
                task_id = DatetimeService.getCurTask();
                if ($scope.visibility == "hidden") {
                    $scope.showBox(cur_pos);
                    cur_task = task_id
                } else if ($scope.visibility === "show" && task_id === cur_task) {
                    $scope.closeBox()
                }
            }
        });

    $scope.chosenTime = null;
    $scope.$watch('chosenTime', function(){
        if ($scope.chosenTime) {
            // close box when user selects a time
            $scope.closeBox();
            $scope.setTime($scope.chosenTime);
        }
    });

    $scope.setTime = function(newTime) { // should i edit task date here or from task controller?
        $http({
            method: 'POST',
            url: '/edit_date',
            headers: {Authorization: 'Bearer ' + AuthService.getToken()},
            data: {
                id: cur_task,
                date: newTime
            }
        }).then(function (response) {
            $scope.$emit(TASK_EVENTS.refreshTaskList)
        }, function (error) {
            console.log(error);
        });
    };

}

angular.module('todoApp')
    .component('datetimebox', {
        templateUrl: 'static/partials/datetimebox.html',
        controller: dateTimeBoxController,
        controllerAs: 'ctrl'
    });