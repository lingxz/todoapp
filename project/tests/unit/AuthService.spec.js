describe('AuthService', function () {

    var AuthService,
        $q,
        $timeout,
        $httpBackend,
        $window;

    beforeEach(module('templates'));
    beforeEach(module('todoApp'));

    beforeEach(inject(function(_$q_, _$timeout_, _$httpBackend_, _$window_, _AuthService_){
        AuthService = _AuthService_;
        $q = _$q_;
        $timeout = _$timeout_;
        $httpBackend = _$httpBackend_;
        $window = _$window_;
    }));

    var tokenName = 'someToken';

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


    describe('login function', function () {

        it('should exist', function () {
            expect(angular.isFunction(AuthService.login)).toBe(true);
        });

        it('should send login data to server', function () {
            email = 'abc.com';
            password = '12345';

            $httpBackend.expectPOST('/api/login', {email: email, password: password})
                .respond(200, '');
            AuthService.login(email, password);
            $httpBackend.flush();
        });

    });

    describe('logout function', function () {
        it('should exist', function () {
            expect(angular.isFunction(AuthService.logout)).toBe(true);
        });

        it('should send a get request to the server', function () {
            $httpBackend.expectGET('/api/logout').respond(200, '');
            AuthService.logout();
            $httpBackend.flush();
        });
    });
});
