/**
 * Created by mark on 7/6/16.
 */

function navController($scope, $rootScope, AUTH_EVENTS, AuthService, USER_PREFERENCES) {
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

    $scope.showCompleted = AuthService.getUserPreference(); // TODO: need to store user preference, cannot always default to true
    $scope.toggleCompleted = function () {
        if ($scope.showCompleted) {
            $rootScope.$broadcast(USER_PREFERENCES.hideCompletedTasks);
        } else {
            $rootScope.$broadcast(USER_PREFERENCES.showCompletedTasks);
        }
        $scope.showCompleted = AuthService.getUserPreference();
    };

}


angular.module('todoApp')
    .component('navigation', {
        templateUrl: 'static/partials/nav.html',
        controller: navController
    });
