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

        user_id = 12;
        var token = 'some_token';

        // mock the AuthService
        var mockService = {
            getCurrentUserID: function () { return user_id },
            getToken: function () { return token }
        };

        it('should exist', function () {
            scope = rootScope.$new();
            var controller = createController(scope, AuthService);
            expect(angular.isFunction(scope.retrieveItems)).toBe(true);
        });

        it('should be called when the controller initiates', function () {
            $httpBackend.expectPOST('/retrieve_tasks');
            scope = rootScope.$new();
            var controller = createController(scope, mockService);
        });

        it('should send user data with correct header to the server', function () {
            scope = rootScope.$new();

            // this is the call to retrieveItems when call initializes
            $httpBackend.whenPOST('/retrieve_tasks').respond(200, '');

            var controller = createController(scope, mockService);
            $httpBackend.expectPOST('/retrieve_tasks', {user_id: user_id}, function (headers) {
                return headers.Authorization === 'Bearer ' + token
            }).respond(200, '');

            scope.retrieveItems();
            $httpBackend.flush()
        });

        it('should set tasks to the response data', function () {
            scope = rootScope.$new();
            tasklist = 'xxx';
            $httpBackend.whenPOST('/retrieve_tasks').respond(201, tasklist);
            var controller = createController(scope, mockService);

            scope.retrieveItems();
            $httpBackend.flush();
            expect(scope.tasks).toEqual(tasklist)
        });
    });

    describe('deleteTask function', function () {

        user_id = 12;
        var token = 'some_token';

        // mock the AuthService
        var mockService = {
            getCurrentUserID: function () { return user_id },
            getToken: function () { return token }
        };

        it('should exist', function () {
            scope = rootScope.$new();
            var controller = createController(scope, AuthService);
            expect(angular.isFunction(scope.deleteTask)).toBe(true);
        });

        it('should send user and task data and headers to the server', function () {
            scope = rootScope.$new();
            $httpBackend.whenPOST('/retrieve_tasks').respond(201, '');
            var controller = createController(scope, mockService);
            task = {id: 3};

            $httpBackend.expectPOST('/delete_task', {user_id: user_id, id: task.id}, function (headers) {
                return headers.Authorization === 'Bearer ' + token
            }).respond(200, '');
            scope.deleteTask(task);
            $httpBackend.flush();
        });

    })

});