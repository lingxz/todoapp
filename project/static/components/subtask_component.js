function SubtaskController ($scope) {

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

