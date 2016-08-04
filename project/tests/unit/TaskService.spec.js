describe('TaskService', function () {

    var TaskService,
        $httpBackend,
        AuthService,
        $q;

    beforeEach(module('templates'));
    beforeEach(module('todoApp'));

    beforeEach(inject(function (_TaskService_, _$httpBackend_, _AuthService_, _$q_) {
        TaskService = _TaskService_;
        $httpBackend = _$httpBackend_;
        AuthService = _AuthService_;
        $q = _$q_;
        spyOn(AuthService, 'getHeaders').and.returnValue({Authorization: 'xxx'});
        spyOn(AuthService, 'getCurrentUserID').and.returnValue(5);
    }));

    describe('set and get current task functions', function () {
        it('should set the current task correctly', function () {
            expect(TaskService.getCurrentTask()).toBe(null);
            TaskService.setCurrentTask('xxx');
            expect(TaskService.getCurrentTask()).toBe('xxx');
        })
    });

    describe('addTask function', function () {

        it('should exist', function () {
            expect(angular.isFunction(TaskService.addTask)).toBe(true)
        });
        
        it('should send task data to the server', function () {
            var content = "content";
            var task = {id: 3};

            expectedData = {
                content: content,
                user_id: 5,
                prev_task: task.id
            };

            $httpBackend.expectPOST('/add', expectedData).respond(201, '');
            TaskService.addTask(task, content);
            $httpBackend.flush();
        });

        // this is not really unitary since it's checking data and headers at once
        it('should send correct auth headers', function () {
            var content = "content";
            var task = {id: 3};

            expectedData = {
                content: content,
                user_id: 5,
                prev_task: task.id
            };

            $httpBackend.expectPOST('/add', expectedData, function (headers) {
                return headers.Authorization === 'xxx'
            }).respond(201, '');

            TaskService.addTask(task, content);
            $httpBackend.flush()
        });

        it('content should default to empty string if not provided', function () {

            var task = {id: 3};

            expectedData = {
                content: "",
                user_id: 5,
                prev_task: task.id
            };

            $httpBackend.expectPOST('/add', expectedData).respond(201, '');
            TaskService.addTask(task);
            $httpBackend.flush()
        });

        it('should resolve promise when request is successful', function () {
            var task = {id: 3};
            $httpBackend.whenPOST('/add').respond(201, '');
            promise = TaskService.addTask(task);

            var result = null;
            promise.then(function () {
                result = 'resolved'
            }, function (error) {
                result = 'rejected'
            });
            $httpBackend.flush();
            expect(result).toBe('resolved')
        });

        it('should reject promise when request failed', function () {
            var task = {id: 3};
            $httpBackend.whenPOST('/add').respond(500, '');
            promise = TaskService.addTask(task);

            var result = null;
            promise.then(function () {
                result = 'resolved'
            }, function (error) {
                result = 'rejected'
            });
            $httpBackend.flush();
            expect(result).toBe('rejected')
        })
    });

    describe('removeDate function', function () {

        it('should exist', function () {
            expect(angular.isFunction(TaskService.removeDate)).toBe(true)
        });

        it('should send task data to the server', function () {
            var task = {id: 3, another: 'bla'};
            var expectedData = {id: 3};

            $httpBackend.expectPOST('/remove_date', expectedData).respond(201, '');
            TaskService.removeDate(task);
            $httpBackend.flush();
        });

        it('should send correct auth headers', function () {
            var task = {id: 3, another: 'bla'};
            var expectedData = {id: 3};

            $httpBackend.expectPOST('/remove_date', expectedData, function (headers) {
                return headers.Authorization === 'xxx'
            }).respond(201, '');

            TaskService.removeDate(task);
            $httpBackend.flush()
        });

        it('should resolve promise when request is successful', function () {
            var task = {id: 3, another: 'bla'};
            $httpBackend.whenPOST('/remove_date').respond(201, '');
            promise = TaskService.removeDate(task);

            var result = null;
            promise.then(function () {
                result = 'resolved'
            }, function (error) {
                result = 'rejected'
            });
            $httpBackend.flush();
            expect(result).toBe('resolved')
        });

        it('should reject promise when request failed', function () {
            var task = {id: 3, another: 'bla'};
            $httpBackend.whenPOST('/remove_date').respond(500, '');
            promise = TaskService.removeDate(task);

            var result = null;
            promise.then(function () {
                result = 'resolved'
            }, function (error) {
                result = 'rejected'
            });
            $httpBackend.flush();
            expect(result).toBe('rejected')
        })
    });

    describe('editTask function', function () {

        it('should exist', function () {
            expect(angular.isFunction(TaskService.editTask)).toBe(true)
        });

        it('should send task data to the server', function () {
            var task = {id: 3, another: 'bla'};
            var content = 'content';
            var expectedData = {id: task.id, content: content};

            $httpBackend.expectPOST('/edit_task', expectedData).respond(201, '');
            TaskService.editTask(task, content);
            $httpBackend.flush();
        });

        it('should send correct auth headers', function () {

            var task = {id: 3, another: 'bla'};
            var content = 'content';
            var expectedData = {id: task.id, content: content};

            $httpBackend.expectPOST('/edit_task', expectedData, function (headers) {
                return headers.Authorization === 'xxx'
            }).respond(201, '');
            TaskService.editTask(task, content);
            $httpBackend.flush();
        });
    })

});