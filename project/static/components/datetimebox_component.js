/**
 * Created by mark on 7/17/16.
 */

function dateTimeBoxController($scope) {
    $scope.getToday = function () {
        return moment();
    };

}

angular.module('todoApp')
    .component('datetimebox', {
        templateUrl: 'static/partials/datetimebox.html',
        controller: dateTimeBoxController,
        controllerAs: 'ctrl'
    });