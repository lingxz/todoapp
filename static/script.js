var todoapp = angular.module("TodoApp", []);

todoapp.config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[');
    $interpolateProvider.endSymbol(']}');
}]);

todoapp.controller("mainController", [
    '$scope',
    '$http',
    function ($scope, $http) {
        $scope.tasks = [{content: "asdf"}, {content: "hello"}];
        $scope.newtask = "";
        $scope.retrieveNr = 10;
        $scope.addTask = function () {
            if (!$scope.newtask) {
                return
            } else {
                $http({
                    url: '/add',
                    method: "POST",
                    data: {content: $scope.newtask, duedate: 2015} //TODO: add input date
                }).then(function (response) {
                    $scope.retrieveLastNItems($scope.retrieveNr);
                    $scope.newtask = ""
                }, function (error) {
                    console.log(error)
                })
            }
            $scope.newtask = ""
        };

        // TODO: get n tasks only
        $scope.retrieveLastNItems = function (n) {
            $http({
                method: 'POST',
                url: '/retrieve',
                data: {numTasks: $scope.retrieveNr}
            }).then(function (response) {
                $scope.tasks = response.data;
                console.log("mm", $scope.tasks);
            }, function (error) {
                console.log(error);
            });
        };

        $scope.retrieveLastNItems($scope.retrieveNr)
    }
]);

