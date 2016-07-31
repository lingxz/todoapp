/**
 * Created by mark on 7/6/16.
 */

function navController($scope, $rootScope, AUTH_EVENTS, AuthService, USER_PREFERENCES) {
    this.$onInit = function () {
        // Possible fix for the initial display of hidden might go here
        console.log("INIT");
        $scope.showCompleted = AuthService.retrieveShowTaskPref();
    };

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
            AuthService.updateShowTaskPref(false);
        } else {
            AuthService.updateShowTaskPref(true);
        }
    };

    // Monitor the value of showCompleted
    $scope.$watch(AuthService.retrieveShowTaskPref,
        function (newval, oldval) {
            $scope.showCompleted = newval
        }
    );
}

angular.module('todoApp')
    .component('navigation', {
        controller: navController,
        templateUrl: 'static/partials/nav.html'
    });
