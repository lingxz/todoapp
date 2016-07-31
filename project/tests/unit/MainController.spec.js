describe('mainController', function () {

    var scope,
        ctrl,
        httpBackend;

    beforeEach(module('todoApp'));

    // beforeEach(inject(function ($injector) {
    //     httpBackend = $injector.get('$httpBackend');
    //     rootScope = $injector.get('$rootScope');
    //
    //     controller = $injector.get('$controller');
    //
    //     createController = function () {
    //         return controller('mainController', { $scope: scope });
    //     }
    // }));

    beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
        scope = $rootScope.$new();
        ctrl = $controller('mainController', { $scope: scope });
        httpBackend = _$httpBackend_;
    }));

    // describe('retrieveLastNItems function', function () {
    //     httpBackend.when('POST', '/retrieve_tasks', )
    //
    //
    // });


    it('should have a retrieveLastNItems function', function () {
        expect(angular.isFunction(scope.retrieveLastNItems)).toBe(true);
    });

    // it('should send auth header', function () {
    //     httpBackend.flush();
    //
    //     httpBackend.expectPOST('/retrieve_tasks', {}, function (headers) {
    //         return headers['Authorization']
    //     }).respond(201, '');
    //
    //     httpBackend.flush();
    //
    // });

    it('should populate task data when the http request succeeds', function () {
        httpBackend.flush();
        responseData = [
            {content: "bla", depth: 0, done: true, due_date: null, id: 1, lft: 0, rgt: 5}
        ];

        httpBackend.expectPOST('/retrieve_tasks', undefined, {user_id: 1}).respond(responseData);
        httpBackend.flush();
        expect(scope.tasks).toEqual(responseData);
    })

});