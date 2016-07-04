var app = angular.module("TodoApp", []);

app.config(['$interpolateProvider', function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[');
    $interpolateProvider.endSymbol(']}');
}]);

app.controller("mainController", [
    '$scope',
    '$http',
    function ($scope, $http) {
        $scope.tasks = [{content:"asdf"}, {content:"hello"}];
        $scope.newtask = "";
        $scope.addTask = function () {
            $scope.tasks.unshift({content:$scope.newtask});
            $scope.newtask = ""
        }
    }
]);

