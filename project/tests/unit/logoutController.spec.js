describe('logoutController', function () {

    var scope,
        $rootScope,
        $controller,
        $q,
        $location,
        AuthService,
        AUTH_EVENTS,
        deferred,
        controller,
        createController;

    beforeEach(module('templates'));
    beforeEach(module('todoApp'));

    beforeEach(inject(function (_$controller_, _$rootScope_, _$q_, _$location_, _AuthService_, _AUTH_EVENTS_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $q = _$q_;
        $location = _$location_;
        AuthService = _AuthService_;
        AUTH_EVENTS = _AUTH_EVENTS_;
        scope = $rootScope.$new();
        createController = function () {
            return $controller('logoutController', {
                '$scope': scope
            })
        };

        controller = createController();
        deferred = $q.defer();
        spyOn(AuthService, 'logout').and.returnValue(deferred.promise);
    }));

    describe('logout function', function () {

        it('should exist', function () {
            expect(angular.isFunction(scope.logout)).toBe(true)
        });

        it('should call logout function from AuthService', function () {
            scope.logout();
            expect(AuthService.logout).toHaveBeenCalled()
        });

        it('should redirect to login page on successful logout', function () {
            spyOn($location, 'path').and.callThrough();
            scope.logout();
            deferred.resolve();
            scope.$digest();
            expect($location.path.calls.count()).toBe(4);
            expect($location.path.calls.mostRecent().args).toEqual(['/login']);
        });

        it('should not redirect on unsuccessful logout', function () {
            spyOn($location, 'path').and.callThrough();
            scope.logout();
            deferred.reject();
            scope.$digest();
            expect($location.path.calls.count()).toBe(3)
        })
    })
});