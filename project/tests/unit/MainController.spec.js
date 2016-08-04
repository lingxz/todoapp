describe('mainController', function () {

    var scope,
        createContrller,
        httpBackend,
        createController,
        AuthService,
        TaskService,
        USER_PREFERENCES,
        TASK_EVENTS,
        hotkeys;

    beforeEach(module('templates'));
    beforeEach(module('todoApp'));

    beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, $injector) {
        AuthService = $injector.get('AuthService');
        TaskService = $injector.get('TaskService');
        USER_PREFERENCES = $injector.get('USER_PREFERENCES');
        TASK_EVENTS = $injector.get('TASK_EVENTS');
        hotkeys = $injector.get('hotkeys');
        rootScope = $rootScope;

        createController = function (scope, mockService) {
            return $controller('mainController', {
                '$scope': scope,
                'AuthService': mockService
            })
        };

        $httpBackend = _$httpBackend_;
    }));

    describe('retrieveItems function', function () {

    });

    describe('deleteTask function', function () {
        
    })

});