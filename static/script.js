angular.module("TodoApp",[])
    .config(function($routeProvider){
        $routeProvider
        // TODO: not sure why this doesn't work
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
            $scope.addTask = function(){
                console.log("posted" + $scope.newtask);
                $scope.newtask=""
            }
        }
    ]);

