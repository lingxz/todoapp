describe('registerController', function () {

    var scope,
        $rootScope,
        $controller,
        $q,
        $location,
        AuthService,
        deferred,
        controller,
        createController;

    beforeEach(module('templates'));
    beforeEach(module('todoApp'));

    beforeEach(inject(function (_$controller_, _$rootScope_, _$q_, _$location_, _AuthService_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $q = _$q_;
        $location = _$location_;
        AuthService = _AuthService_;
        scope = $rootScope.$new();
        createController = function () {
            return $controller('registerController', {
                '$scope': scope
            })
        };

        controller = createController();
        deferred = $q.defer();
        spyOn(AuthService, 'register').and.returnValue(deferred.promise);

        scope.registerForm = {};
        scope.registerForm.email = 'xyz';
        scope.registerForm.password = '123';
        scope.registerForm.username = 'abc';

    }));

    describe('register function', function () {

        it('should exist', function () {
            expect(angular.isFunction(scope.register)).toBe(true)
        });

        it('should call register function in AuthService with correct arguments', function () {
            scope.register();
            expect(AuthService.register).toHaveBeenCalled();
            expect(AuthService.register).toHaveBeenCalledWith('xyz', '123', 'abc');
        });

        it('should redirect the page on successful registration', function () {
            spyOn($location, 'path').and.callThrough();
            scope.register();
            deferred.resolve();
            scope.$digest();
            expect($location.path.calls.count()).toBe(4);
            expect($location.path.calls.mostRecent().args).toEqual(['/login']);
        });

        it('should clear registration form and set disabled to false on successful registration', function () {
            scope.register();
            deferred.resolve();
            scope.$digest();
            expect(scope.disabled).toBe(false);
            expect(scope.registerForm).toEqual({})
        });

        it('should show error message and clear registration form on failed registration', function () {
            scope.register();
            deferred.reject();
            scope.$digest();
            expect(scope.error).toBe(true);
            expect(scope.errorMessage).toBe("Something went wrong!");
            expect(scope.registerForm).toEqual({})
        });

        // if redirecting, it is the 4th call, so we expect the fourth call not to be made
        it('should not redirect on failed registration', function () {
            spyOn($location, 'path').and.callThrough();
            scope.register();
            deferred.reject();
            scope.$digest();
            expect($location.path.calls.count()).toBe(3)
        })
    })


});

