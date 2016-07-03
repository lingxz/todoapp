angular.module("TodoApp",[])
    .config(function($routeProvider){
        $routeProvider
        // route for home page
            .when('/', {
                templateUrl : '../static/todo.html',
                controller  : 'mainController'
            })
            .otherwise({ redirectTo: '/'})
        })

    .controller("mainController", [
        '$scope',
        '$http',
        function($scope, $http){
            $scope.state = {};
            $scope.todoList = ["hello"];
        }
    ]);

