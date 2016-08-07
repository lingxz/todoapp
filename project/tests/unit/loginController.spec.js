describe('loginController', function () {

    var scope,
        $rootScope,
        $controller,
        $q,
        $location,
        AuthService,
        AUTH_EVENTS,
        controller,
        deferred,
        createController;

    beforeEach(module('templates'));
    beforeEach(module('todoApp'));

    beforeEach(inject(function (_$controller_, _$rootScope_, _$q_, _$location_, _AuthService_, _AUTH_EVENTS_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        scope = $rootScope.$new();
        $q = _$q_;
        $location = _$location_;
        AuthService = _AuthService_;
        AUTH_EVENTS = _AUTH_EVENTS_;

        createController = function () {
            return $controller('loginController', {
                '$scope': scope
            })
        };

        controller = createController();
        deferred = $q.defer();
        spyOn(AuthService, 'login').and.returnValue(deferred.promise);

        scope.loginForm = {};
        scope.loginForm.email = 'xyz';
        scope.loginForm.password = '123';
    }));

    describe('login function', function () {

        it('should exist', function () {
            expect(angular.isFunction(scope.login)).toBe(true);
        });

        it('should call login function from AuthService with correct arguments', function () {
            scope.login();
            expect(AuthService.login).toHaveBeenCalled();
            expect(AuthService.login).toHaveBeenCalledWith('xyz', '123')
        });

        it('should redirect to home page on success', function () {
            spyOn($location, 'path').and.callThrough();
            scope.login();
            deferred.resolve();
            scope.$digest();
            expect($location.path.calls.count()).toBe(4);
            expect($location.path.calls.mostRecent().args).toEqual(['/']);
        });

        it('should set clear login form and set $scope.disabled to false on success', function () {
            scope.login();
            deferred.resolve();
            scope.$digest();
            expect(scope.disabled).toBe(false);
            expect(scope.loginForm).toEqual({});
        });

        it('should show error and clear login form when login fails', function () {
            scope.login();
            deferred.reject();
            scope.$digest();
            expect(scope.error).toBe(true);
            expect(scope.errorMessage).toBe("Invalid username and/or password");
            expect(scope.loginForm).toEqual({});
            expect(scope.disabled).toBe(false);
        });
        
        it('should not redirect when login fails', function () {
            spyOn($location, 'path').and.callThrough();
            scope.login();
            deferred.reject();
            scope.$digest();
            expect($location.path.calls.count()).toBe(3)
        })
    })

});
