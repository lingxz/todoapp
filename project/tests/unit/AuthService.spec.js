describe('AuthService', function () {

    var AuthService,
        $q,
        $timeout,
        $httpBackend,
        $window;


    beforeEach(module('todoApp'));

    beforeEach(inject(function(_AuthService_, _$q_, _$timeout_, _$httpBackend_, _$window_){
        AuthService = _AuthService_;
        $q = _$q_;
        $timeout = _$timeout_;
        $httpBackend = _$httpBackend_;
        $window = _$window_;
    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    describe('AuthService functions', function(){

        it('should have a isLoggedIn function', function(){
            expect(angular.isFunction(AuthService.isLoggedIn)).toBe(true);
        });

        it('should have a login function', function(){
            expect(angular.isFunction(AuthService.login)).toBe(true);
        });

        it('should have a logout function', function(){
            expect(angular.isFunction(AuthService.logout)).toBe(true);
        });
        it('should have a register function', function(){
            expect(angular.isFunction(AuthService.register)).toBe(true);
        });
        it('should have a getCurrentUser function', function(){
            expect(angular.isFunction(AuthService.getCurrentUser)).toBe(true);
        });
        it('should have a getCurrentUserID function', function(){
            expect(angular.isFunction(AuthService.getCurrentUserID)).toBe(true);
        });
        it('should have a getToken function', function(){
            expect(angular.isFunction(AuthService.getToken)).toBe(true);
        });
        it('should have a getUserPreference function', function(){
            expect(angular.isFunction(AuthService.getUserPreference)).toBe(true);
        });
        it('should have a updateShowTaskPref function', function(){
            expect(angular.isFunction(AuthService.updateShowTaskPref)).toBe(true);
        });
        it('should have a retrieveShowTaskPref function ', function(){
            expect(angular.isFunction(AuthService.retrieveShowTaskPref)).toBe(true);
        });

    });

    describe('AuthService', function(){
        it('should have ', function(){

        })
    })

});
