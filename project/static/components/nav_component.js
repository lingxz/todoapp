/**
 * Created by mark on 7/6/16.
 */

function navController($scope, $rootScope, AUTH_EVENTS, AuthService, USER_PREFERENCES) {
    var promise = AuthService.getUserPreference(); // TODO: need to store user preference, cannot always default to true
    promise.then(function (value) {
        $scope.showCompleted = value;
    });

    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getCurrentUser();
    $rootScope.$on(AUTH_EVENTS.loginSuccess, function (next, current) {
        $scope.loggedIn = true;
        $scope.currentUser = AuthService.getCurrentUser();
    });
    $rootScope.$on(AUTH_EVENTS.logoutSuccess, function (next, current) {
        $scope.loggedIn = false;
        $scope.currentUser = AuthService.getCurrentUser();
    });

    $scope.toggleCompleted = function () {
        if ($scope.showCompleted) {
            $rootScope.$broadcast(USER_PREFERENCES.hideCompletedTasks);
            $scope.showCompleted = false;
        } else {
            $rootScope.$broadcast(USER_PREFERENCES.showCompletedTasks);
            $scope.showCompleted = true;
        }
    };

}


angular.module('todoApp')
    .component('navigation', {
        templateUrl: 'static/partials/nav.html',
        controller: navController
    });
